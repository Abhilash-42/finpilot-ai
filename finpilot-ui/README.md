# FinPilot AI — Frontend

React + Vite frontend for FinPilot AI.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` and set:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Production build

```bash
npm run build
npm run preview
```

## Vercel

Set the Vercel project root directory to `finpilot-ui` and configure:

```env
VITE_API_URL=https://your-finpilot-api.onrender.com
```

The included `vercel.json` keeps React Router deep links working on Vercel.
