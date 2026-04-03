# Fastcat Billing System

Scaffold for Hono (Cloudflare Workers) billing system.

## Setup

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Initialize Database (D1)**
   ```bash
   npx wrangler d1 create billing-db
   ```
   *Copy the database ID to `wrangler.jsonc`*

3. **Deploy Migrations**
   ```bash
   npx wrangler d1 execute billing-db --file=src/db/schema.sql
   ```

4. **Run Local Development**
   ```bash
   npm run dev
   ```

## API Structure

- `GET /balance` - Check current balance (Header: `X-API-Key`)
- `POST /usage {service_id, amount, metadata?}` - Log usage and charge user balance.

### Example Usage Call
```bash
curl -X POST http://localhost:8787/usage \
  -H "X-API-Key: YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"service_id": "stt_whisper", "amount": 10}'
```

## Database Schema

Located in `server/src/db/schema.sql`.
Contains tables for `users`, `services`, `usage_logs`, and `transactions`.
