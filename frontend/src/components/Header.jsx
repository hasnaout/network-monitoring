const navItems = [
  { href: '#/', label: 'Dashboard' },
  { href: '#/machines/new', label: 'Machines' },
];

export default function Header({ auth, onLogout, route }) {
  const isAuthenticated = Boolean(auth?.accessToken);
  const currentRoute = route || window.location.hash || '#/';

  return (
    <header className="site-header">
      <div className="site-header__brand">
        <a className="brand" href="#/">
          <img src="../../public/assets/logo.png" alt="logo" />
          <div className="brand-copy">
            <p className="brand-kicker">Operations cockpit</p>
            <h1>Network Monitor</h1>
          </div>
        </a>
        <p className="brand-summary">
          Une interface de supervision repensee pour piloter le parc avec plus de lisibilite.
        </p>
      </div>

      <nav className="top-nav" aria-label="Navigation principale">
        {navItems.map((item) => (
          <a
            className={currentRoute === item.href ? 'nav-link is-active' : 'nav-link'}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
        {isAuthenticated ? (
          <button className="nav-action" onClick={onLogout} type="button">
            Se deconnecter
          </button>
        ) : (
          <a
            className={currentRoute === '#/connexion' ? 'nav-link is-active' : 'nav-link'}
            href="#/connexion"
          >
            Connexion
          </a>
        )}
      </nav>

      <div className="header-badge">
        <span className="header-badge__label">Session</span>
        <strong className="header-badge__value">
          {isAuthenticated ? auth.username : 'Visiteur'}
        </strong>
        <span className={isAuthenticated ? 'signal-pill signal-pill--live' : 'signal-pill'}>
          {isAuthenticated ? 'Securisee' : 'Standby'}
        </span>
      </div>
    </header>
  );
}
