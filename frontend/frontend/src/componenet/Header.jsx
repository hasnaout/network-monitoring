export default function Header() {
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
        <a href="#">Equipements</a>
        <a href="#">Alertes</a>
        <a href="#">Rapports</a>
        <a href="#/connexion">Connexion</a>
      </nav>

      <div className="header-status">Systeme online</div>
    </header>
  );
}
