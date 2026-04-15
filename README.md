## Network Monitoring

Structure simplifiee du projet :

- `backend/` : API FastAPI, auth JWT, acces base de donnees
- `frontend/` : application React/Vite
- `network_monitor.db` : base SQLite de secours locale

Lancement local :

```bash
uvicorn backend.main:app --reload
```

```bash
cd frontend
npm install
npm run dev
```