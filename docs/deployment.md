# Deployment

## Backend — Render

The repository includes `render.yaml` for the FastAPI service.

- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/health`

Required environment variables:

```text
DATABASE_URL
SECRET_KEY
CORS_ORIGINS
```

Set `CORS_ORIGINS` to the deployed frontend origin, for example:

```text
https://your-app.vercel.app
```

Run the existing Alembic migrations against the production database before the first release:

```bash
cd backend
alembic upgrade head
```

## Frontend — Vercel

Use `finpilot-ui` as the Vercel project root.

Set:

```text
VITE_API_URL=https://your-finpilot-api.onrender.com
```

The included `vercel.json` provides SPA rewrites so React Router paths such as `/dashboard` and `/ai` work on direct navigation.
