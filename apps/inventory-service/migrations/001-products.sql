CREATE TABLE products (
 sku TEXT PRIMARY KEY, name TEXT NOT NULL, price_minor INTEGER NOT NULL CHECK(price_minor > 0),
 stock_on_hand INTEGER NOT NULL CHECK(stock_on_hand >= 0)
);
