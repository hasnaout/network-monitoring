export default function Header({ auth, onLogout }) {
  const isAuthenticated = Boolean(auth?.accessToken);

  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-dot" aria-hidden="true" />
        <div>
          <h1>Network Monitor</h1>
          <p>Etat global du parc et activite temps reel</p>
        </div>
      </div>

      <nav className="top-nav" aria-label="Navigation principale">
        <a href="#/">Dashboard</a>
        <a href="#/machines/new">Ajouter machine</a>
        {isAuthenticated ? (
          <button className="nav-action" onClick={onLogout} type="button">
            Deconnexion
          </button>
        ) : (
          <a href="#/connexion">Connexion</a>
        )}
      </nav>

      <div className="header-status">
        {isAuthenticated ? `Connecte: ${auth.username}` : 'Systeme online'}
      </div>
    </header>
  );
}
