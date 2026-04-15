function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-meta">
        <h3>Network Monitor</h3>
        <p>Outil de supervision des equipements reseau en temps reel.</p>
      </div>

      <div className="footer-meta">
        <h4>Navigation</h4>
        <div className="footer-links">
          <a href="#/">Dashboard</a>
          <a href="#">Equipements</a>
          <a href="#">Alertes</a>
          <a href="#">Rapports</a>
          <a href="#/connexion">Connexion</a>
        </div>
      </div>

      <div className="footer-meta">
        <h4>Informations</h4>
        <p>Email : support@networkmonitor.com</p>
        <p>Version : 1.0.0</p>
        <p>Statut : Online</p>
      </div>
    </footer>
  )
}

export default Footer
