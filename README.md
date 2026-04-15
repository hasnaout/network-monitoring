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

Raccourcis PowerShell :

```powershell
.\start-backend.ps1
.\start-frontend.ps1
```

Raccourcis Windows simples :

```bat
start-backend.bat
start-frontend.bat
start-all.bat
```
