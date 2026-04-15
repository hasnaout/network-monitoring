import { useEffect, useState } from 'react';

import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const statusRank = {
  Offline: 0,
  Maintenance: 1,
  Online: 2,
};

function formatDate(value) {
  if (!value) {
    return 'Aucune date disponible';
  }

  return new Date(value).toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getStatusClass(status) {
  if (status === 'Online') {
    return 'status-pill is-online';
  }

  if (status === 'Maintenance') {
    return 'status-pill is-maintenance';
  }

  return 'status-pill is-offline';
}

export default function Home({ auth, onLogout, onSessionExpired, route }) {
  const isAuthenticated = Boolean(auth?.accessToken);
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMachines() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}/machines`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          signal: controller.signal,
        });

        if (response.status === 401) {
          onSessionExpired();
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Impossible de charger le dashboard');
        }

        setMachines(data.items || []);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        if (err instanceof TypeError) {
          setError("Impossible de joindre le backend. Demarre l'API sur http://127.0.0.1:8000.");
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadMachines();

    return () => controller.abort();
  }, [auth.accessToken, onSessionExpired]);

  const totalMachines = machines.length;
  const onlineMachines = machines.filter((machine) => machine.status === 'Online').length;
  const maintenanceMachines = machines.filter((machine) => machine.status === 'Maintenance').length;
  const offlineMachines = machines.filter((machine) => machine.status === 'Offline').length;
  const locations = [...new Set(machines.map((machine) => machine.location?.trim()).filter(Boolean))];
  const healthScore = totalMachines === 0
    ? 100
    : Math.round(((onlineMachines + maintenanceMachines * 0.6) / totalMachines) * 100);
  const attentionMachines = [...machines]
    .filter((machine) => machine.status !== 'Online')
    .sort((first, second) => statusRank[first.status] - statusRank[second.status])
    .slice(0, 4);
  const recentMachines = machines.slice(0, 5);
  const latestMachine = recentMachines[0];
  const stats = [
    {
      label: 'Disponibilite reseau',
      value: `${healthScore}%`,
      detail: totalMachines === 0 ? 'Parc pret a etre initialise' : 'Score calcule depuis les statuts',
      tone: 'info',
    },
    {
      label: 'Machines online',
      value: `${onlineMachines}`,
      detail: `${totalMachines} equipement(s) au total`,
      tone: 'success',
    },
    {
      label: 'Surveillance requise',
      value: `${offlineMachines + maintenanceMachines}`,
      detail: offlineMachines > 0 ? `${offlineMachines} hors ligne` : 'Aucun incident critique',
      tone: offlineMachines > 0 ? 'danger' : 'warning',
    },
    {
      label: 'Sites couverts',
      value: `${locations.length}`,
      detail: locations.length > 0 ? 'Zones avec localisation renseignee' : 'Ajoutez vos localisations',
      tone: 'neutral',
    },
  ];

  return (
    <div className="dashboard-shell">
      <Header auth={auth} onLogout={onLogout} route={route} />

      <main className="dashboard-main dashboard-flow">
        <section className="hero-panel hero-panel--split">
          <div className="hero-copy-block">
            <p className="eyebrow">Command center</p>
            <h2>Une supervision plus nette, plus presentable et plus rassurante au premier regard.</h2>
            <p className="hero-copy">
              Le dashboard met maintenant en avant la disponibilite du parc, les priorites
              du moment et les machines recemment enregistrees dans une interface plus
              professionnelle.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <>
                  <span className="welcome-chip">Admin actif: {auth.username}</span>
                  <a className="primary-link" href="#/machines/new">
                    Ajouter une machine
                  </a>
                  <button className="secondary-button" onClick={onLogout} type="button">
                    Se deconnecter
                  </button>
                </>
              ) : (
                <a className="primary-link" href="#/connexion">
                  Acceder a la page de connexion
                </a>
              )}
            </div>
          </div>

          <aside className="hero-sidecard" aria-label="Synthese du parc">
            <span className="section-label">Synthese du parc</span>
            <div className="hero-score">
              <strong>{healthScore}%</strong>
              <span>Indice de sante reseau</span>
            </div>
            <div className="hero-sidecard__grid">
              <div>
                <span>Machines</span>
                <strong>{totalMachines}</strong>
              </div>
              <div>
                <span>Online</span>
                <strong>{onlineMachines}</strong>
              </div>
              <div>
                <span>Maintenance</span>
                <strong>{maintenanceMachines}</strong>
              </div>
              <div>
                <span>Sites</span>
                <strong>{locations.length}</strong>
              </div>
            </div>
            <p className="hero-note">
              {latestMachine
                ? `Derniere machine ajoutee: ${latestMachine.name} le ${formatDate(latestMachine.created_at)}`
                : 'Aucune machine disponible pour le moment.'}
            </p>
          </aside>
        </section>

        <section className="stats-grid" aria-label="Statistiques principales">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <div className="stat-topline">
                <p className="stat-label">{stat.label}</p>
                <span className={`stat-dot ${stat.tone}`} aria-hidden="true" />
              </div>
              <p className={`stat-value ${stat.tone}`}>{stat.value}</p>
              <p className="stat-detail">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-columns">
          <article className="table-panel table-panel--primary">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Inventaire</p>
                <h3>Machines recentes</h3>
              </div>
              <span className="live-badge">Mise a jour depuis l'API</span>
            </div>

            {error ? <p className="feedback error-feedback">{error}</p> : null}

            {isLoading ? (
              <div className="empty-state">
                <h3>Chargement du parc en cours</h3>
                <p>Nous recuperons les machines et leur etat le plus recent.</p>
              </div>
            ) : recentMachines.length === 0 ? (
              <div className="empty-state">
                <h3>Le dashboard est pret</h3>
                <p>Ajoutez une premiere machine pour alimenter les vues de supervision.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Machine</th>
                      <th>Adresse IP</th>
                      <th>Localisation</th>
                      <th>Statut</th>
                      <th>Ajoutee le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMachines.map((machine) => (
                      <tr key={machine.id}>
                        <td>
                          <div className="machine-cell">
                            <strong>{machine.name}</strong>
                            <span>{machine.description || 'Aucune description complementaire'}</span>
                          </div>
                        </td>
                        <td>{machine.ip}</td>
                        <td>{machine.location || 'Non renseignee'}</td>
                        <td>
                          <span className={getStatusClass(machine.status)}>{machine.status}</span>
                        </td>
                        <td>{formatDate(machine.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <aside className="dashboard-side">
            <article className="insight-card">
              <div className="panel-heading panel-heading--compact">
                <div>
                  <p className="eyebrow">Priorites</p>
                  <h3>Points d'attention</h3>
                </div>
              </div>

              {attentionMachines.length === 0 ? (
                <div className="insight-empty">
                  Tous les equipements sont online. Le parc ne presente aucun point chaud.
                </div>
              ) : (
                <div className="priority-list">
                  {attentionMachines.map((machine) => (
                    <div className="priority-item" key={machine.id}>
                      <div className="priority-item__copy">
                        <strong>{machine.name}</strong>
                        <span>{machine.location || 'Localisation a preciser'}</span>
                      </div>
                      <span className={getStatusClass(machine.status)}>{machine.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="insight-card insight-card--accent">
              <p className="eyebrow">Pilotage</p>
              <h3>Actions rapides</h3>
              <p className="hero-copy">
                Gardez un inventaire propre en ajoutant les nouvelles machines et en
                renseignant les localisations de chaque equipement critique.
              </p>
              <div className="action-stack">
                <a className="primary-link" href="#/machines/new">
                  Ouvrir l'administration
                </a>
                <a className="secondary-button" href="#/connexion">
                  Gerer la session
                </a>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <span>Admin courant</span>
                  <strong>{auth.username}</strong>
                </div>
                <div className="info-row">
                  <span>Machines suivies</span>
                  <strong>{totalMachines}</strong>
                </div>
                <div className="info-row">
                  <span>Dernier ajout</span>
                  <strong>{latestMachine ? latestMachine.name : 'Aucun'}</strong>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
