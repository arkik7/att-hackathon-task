import { app, fixture, finish } from "./platform.js";
import { db } from "./database.js";
if (!db.prepare("SELECT id FROM users LIMIT 1").get()) {
  const insert = db.prepare(
    "INSERT INTO users (id, display_name, email, account_status, customer_tier) VALUES (?, ?, ?, ?, ?)",
  );
  for (const user of fixture("users.json"))
    insert.run(
      user.id,
      user.display_name,
      user.email,
      user.account_status,
      user.customer_tier,
    );
}
app.get("/v2/users/:id", (req, res) => {
  const user = db
    .prepare(
      "SELECT id, display_name, email, account_status, customer_tier FROM users WHERE id = ?",
    )
    .get(req.params.id);
  if (!user) return res.status(404).json({ error: "Customer not found" });
  return res.json(user);
});
finish(5002);
