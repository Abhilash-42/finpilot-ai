# FinPilot AI

FinPilot AI is a personal finance web application with a FastAPI/PostgreSQL backend and a React/Vite frontend.

## Current modules

- Authentication and JWT
- Accounts
- Categories
- Transactions
- Goals
- Budgets
- Dashboard
- Reports
- AI Assistant

## Project structure

```text
finpilot-ai/
├── backend/       # FastAPI + SQLAlchemy + Alembic
├── finpilot-ui/   # React + Vite
├── docs/          # Project documentation
└── render.yaml    # Render backend deployment configuration
```

## Local development

### Backend

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set your PostgreSQL connection and a development secret.

Run migrations:

```bash
alembic upgrade head
```

Start the API:

```bash
uvicorn app.main:app --reload
```

Health check: `http://127.0.0.1:8000/health`
Swagger: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd finpilot-ui
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set `VITE_API_URL`.

## Deployment

### Backend — Render

The repository includes `render.yaml`. Set the `DATABASE_URL` and `CORS_ORIGINS` environment variables in Render. Render uses `pip install -r requirements.txt` and starts FastAPI with Uvicorn.

Run database migrations before the first production release:

```bash
cd backend
alembic upgrade head
```

### Frontend — Vercel

Deploy the `finpilot-ui` directory as the Vercel project root and set:

```env
VITE_API_URL=https://your-finpilot-api.onrender.com
```

## Security

Never commit `.env`, database passwords, JWT secrets, API keys, or generated local credentials. Use environment variables in deployment platforms.
