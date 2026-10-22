ALTER TABLE users RENAME COLUMN status TO account_status;
ALTER TABLE users ADD COLUMN customer_tier TEXT NOT NULL DEFAULT 'standard';
