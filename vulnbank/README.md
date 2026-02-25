# ⚠️ VulnBank (Intentionally Vulnerable Mock Banking App)

> **WARNING:** This repository is intentionally insecure and exists only for security research, scanner testing, and educational demonstrations.

`VulnBank` is a fictional full-stack banking platform built to demonstrate vulnerability detection with tools such as **Needle**.

## Security Notice

- Intentionally vulnerable by design
- Must only run in local/dev isolated environments
- Never deploy publicly
- Never use with real credentials or real financial data

Read [SECURITY_WARNING.md](./SECURITY_WARNING.md) before use.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- Auth: JWT (intentionally weak configuration)

## Project Structure

```text
vulnbank/
  ├── client/
  ├── server/
  ├── database/
  ├── .env
  ├── README.md
  ├── SECURITY_WARNING.md
  └── VULNERABILITIES.md
```

## Local Setup (Codespaces-friendly)

From the `vulnbank` directory:

```bash
npm install
npm run dev
```

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:4000`

## Features

- User registration and login
- Account balance display
- Money transfer between users
- Transaction history
- Admin panel listing all users

## Demo Accounts

Create users via Register page, or use seeded users after first backend start:

- `alice` / `password123`
- `bob` / `password123`
- `admin` / `admin123`

## Vulnerability Index

A full list of intentionally included vulnerabilities is in [VULNERABILITIES.md](./VULNERABILITIES.md).

## Safe Usage Guidelines

- Use fake data only
- Keep environment isolated
- Treat all secrets as dummy values
- Do not reuse any code patterns in production
