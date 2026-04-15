import { useEffect, useState } from 'react';

import Footer from "../componenet/footer.jsx";
import Header from "../componenet/Header.jsx";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const initialForm = {
  name: '',
  ip: '',
  location: '',
  status: 'Offline',
  description: '',
};

export default function MachinesPage({ auth, onLogout, onSessionExpired }) {
  const [form, setForm] = useState(initialForm);
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadMachines() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}/machines`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });

        if (response.status === 401) {
          onSessionExpired();
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Impossible de charger les machines');
        }

        setMachines(data.items || []);
      } catch (err) {
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
  }, [auth.accessToken, onSessionExpired]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/machines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        onSessionExpired();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Impossible d\'ajouter la machine');
      }

      setMachines((currentMachines) => [data.machine, ...currentMachines]);
      setSuccess('La machine a ete enregistree dans la base de donnees.');
      setForm(initialForm);
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Impossible de joindre le backend. Demarre l'API sur http://127.0.0.1:8000.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <Header auth={auth} onLogout={onLogout} />

      <main className="dashboard-main">
        <section className="hero-panel">
          <p className="eyebrow">Administration</p>
          <h2>Ajout des machines</h2>
          <p className="hero-copy">
            Creez une nouvelle machine et enregistrez-la directement dans la base de donnees.
          </p>
          <div className="hero-actions">
            <span className="welcome-chip">Admin: {auth.username}</span>
            <a className="secondary-button" href="#/">
              Retour au dashboard
            </a>
          </div>
        </section>

        <section className="page-grid">
          <article className="table-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Formulaire</p>
                <h3>Ajouter une machine</h3>
              </div>
            </div>

            <form className="machine-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label className="field-group">
                  <span>Nom de la machine</span>
                  <input
                    name="name"
                    onChange={handleChange}
                    placeholder="Serveur principal"
                    required
                    value={form.name}
                  />
                </label>

                <label className="field-group">
                  <span>Adresse IP</span>
                  <input
                    name="ip"
                    onChange={handleChange}
                    placeholder="192.168.1.10"
                    required
                    value={form.ip}
                  />
                </label>

                <label className="field-group">
                  <span>Localisation</span>
                  <input
                    name="location"
                    onChange={handleChange}
                    placeholder="Salle serveur"
                    value={form.location}
                  />
                </label>

                <label className="field-group">
                  <span>Statut initial</span>
                  <select name="status" onChange={handleChange} value={form.status}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </label>
              </div>

              <label className="field-group">
                <span>Description</span>
                <textarea
                  name="description"
                  onChange={handleChange}
                  placeholder="Role ou commentaire complementaire"
                  rows="4"
                  value={form.description}
                />
              </label>

              {error ? <p className="feedback error-feedback">{error}</p> : null}
              {success ? <p className="feedback success-feedback">{success}</p> : null}

              <button className="primary-submit" disabled={isSaving} type="submit">
                {isSaving ? 'Enregistrement...' : 'Enregistrer la machine'}
              </button>
            </form>
          </article>

          <article className="table-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Base de donnees</p>
                <h3>Machines enregistrees</h3>
              </div>
              <span className="live-badge">{machines.length} machine(s)</span>
            </div>

            {isLoading ? (
              <div className="empty-state">
                <p>Chargement des machines...</p>
              </div>
            ) : machines.length === 0 ? (
              <div className="empty-state">
                <p>Aucune machine enregistree pour le moment.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>IP</th>
                      <th>Statut</th>
                      <th>Localisation</th>
                      <th>Date d&apos;ajout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machines.map((machine) => (
                      <tr key={machine.id}>
                        <td>{machine.name}</td>
                        <td>{machine.ip}</td>
                        <td>
                          <span
                            className={
                              machine.status === 'Online'
                                ? 'status-pill is-online'
                                : machine.status === 'Maintenance'
                                  ? 'status-pill is-maintenance'
                                  : 'status-pill is-offline'
                            }
                          >
                            {machine.status}
                          </span>
                        </td>
                        <td>{machine.location || '-'}</td>
                        <td>
                          {machine.created_at
                            ? new Date(machine.created_at).toLocaleString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
