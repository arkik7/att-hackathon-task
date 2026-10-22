"""Supply Operations catalog and availability API."""
import json
import os
import re
import sqlite3
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, StrictInt

SERVICE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("DATA_DIR", SERVICE_DIR.parent.parent / ".runtime" / "inventory-service"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / "service.sqlite"

def connection():
    db = sqlite3.connect(DB_PATH, timeout=5)
    db.row_factory = sqlite3.Row
    return db

def initialize():
    with connection() as db:
        db.execute("CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY)")
        for path in sorted((SERVICE_DIR / "migrations").glob("*.sql")):
            if not db.execute("SELECT name FROM migrations WHERE name = ?", (path.name,)).fetchone():
                db.executescript(path.read_text())
                db.execute("INSERT INTO migrations VALUES (?)", (path.name,))
        if not db.execute("SELECT sku FROM products LIMIT 1").fetchone():
            products = json.loads((SERVICE_DIR / "fixtures/products.json").read_text())
            db.executemany("INSERT INTO products (sku,name,price_minor,stock_on_hand) VALUES (:sku,:name,:price_minor,:stock_on_hand)", products)

initialize()
app = FastAPI(title="Supply inventory", version="2.4")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET", "POST"], allow_headers=["*"])

@app.middleware("http")
async def request_context(request: Request, call_next):
    from uuid import uuid4
    candidate = request.headers.get("x-request-id", "")
    request_id = candidate if re.fullmatch(r"[A-Za-z0-9-]{1,80}", candidate) else str(uuid4())
    response = await call_next(request)
    response.headers["x-request-id"] = request_id
    return response

class Item(BaseModel):
    sku: str
    quantity: StrictInt = Field(gt=0)

class Availability(BaseModel):
    items: list[Item] = Field(min_length=1, max_length=20)

class Adjustment(BaseModel):
    delta: StrictInt

@app.get("/health")
def health():
    return {"status": "ok", "service": "inventory-service"}

@app.get("/v1/products")
def products():
    with connection() as db:
        return [dict(row) for row in db.execute("SELECT sku,name,price_minor,stock_on_hand,location FROM products ORDER BY sku")]

@app.post("/v1/availability")
def availability(body: Availability):
    if len({item.sku for item in body.items}) != len(body.items):
        raise HTTPException(400, "Duplicate SKU")
    total = 0
    with connection() as db:
        for item in body.items:
            row = db.execute("SELECT * FROM products WHERE sku = ?", (item.sku,)).fetchone()
            if row is None:
                raise HTTPException(404, "Unknown SKU")
            if row["stock_on_hand"] <= item.quantity:
                raise HTTPException(409, "Insufficient stock")
            total += row["price_minor"] * item.quantity
    return {"available": True, "total_minor": total, "currency": "USD"}

@app.post("/v1/products/{sku}/adjustments")
def adjust(sku: str, body: Adjustment):
    with connection() as db:
        changed = db.execute("UPDATE products SET stock_on_hand = stock_on_hand + ? WHERE sku = ? AND stock_on_hand + ? >= 0", (body.delta, sku, body.delta))
        if changed.rowcount == 0:
            raise HTTPException(409, "Unknown SKU or negative resulting stock")
        return dict(db.execute("SELECT * FROM products WHERE sku = ?", (sku,)).fetchone())
