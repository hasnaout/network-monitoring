import Footer from "../componenet/footer.jsx";
import Header from "../componenet/Header.jsx";

const stats = [
  { label: "Equipements actifs", value: "12", tone: "success" },
  { label: "Equipements offline", value: "3", tone: "danger" },
  { label: "Alertes", value: "5", tone: "warning" },
  { label: "Temps de reponse moyen", value: "32 ms", tone: "info" },
];

const devices = [
  { name: "Routeur", ip: "192.168.1.1", status: "Online", latency: "10 ms" },
  { name: "Google DNS", ip: "8.8.8.8", status: "Online", latency: "25 ms" },
  { name: "Serveur Web", ip: "192.168.1.10", status: "Offline", latency: "---" },
];

export default function Home() {
  return (
    <div className="dashboard-shell">
      <Header />

      <main className="dashboard-main">
        <section className="hero-panel">
          <p className="eyebrow">Supervision reseau</p>
          <h2>Dashboard</h2>
          <p className="hero-copy">
            Vue d&apos;ensemble des equipements surveilles et de leur etat le plus recent.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#/connexion">
              Acceder a la page de connexion
            </a>
          </div>
        </section>

        <section className="stats-grid" aria-label="Statistiques principales">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <p className="stat-label">{stat.label}</p>
              <p className={`stat-value ${stat.tone}`}>{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="table-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Inventaire</p>
              <h3>Liste des equipements</h3>
            </div>
            <span className="live-badge">Mise a jour en direct</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>IP</th>
                  <th>Statut</th>
                  <th>Temps de reponse</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={`${device.name}-${device.ip}`}>
                    <td>{device.name}</td>
                    <td>{device.ip}</td>
                    <td>
                      <span
                        className={
                          device.status === "Online"
                            ? "status-pill is-online"
                            : "status-pill is-offline"
                        }
                      >
                        {device.status}
                      </span>
                    </td>
                    <td>{device.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
