import React, { useState } from 'react';
import './connexion.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Connexion({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('access_token')) {
      window.location.hash = '#/';
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Connexion impossible');
      }

      onLoginSuccess({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        username: data.username,
      });
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Impossible de joindre le backend. Demarre l'API sur http://127.0.0.1:8000.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="connexion-shell">
      <section className="connexion-showcase">
        <p className="eyebrow">Espace de pilotage</p>
        <h1 className="showcase-title">
          Un point d'entree plus premium pour administrer la supervision reseau.
        </h1>
        <p className="showcase-copy">
          Connectez-vous pour acceder a un dashboard modernise, suivre l'etat du parc
          et enrichir rapidement l'inventaire des machines.
        </p>

        <div className="showcase-pill-row" aria-label="Points forts">
          <span className="showcase-pill">Vue executive</span>
          <span className="showcase-pill">Inventaire structure</span>
          <span className="showcase-pill">Administration rapide</span>
        </div>

        <div className="showcase-grid">
          <article className="showcase-stat">
            <span>01</span>
            <strong>Dashboard plus lisible</strong>
            <p>Les indicateurs importants sont visibles sans surcharge visuelle.</p>
          </article>
          <article className="showcase-stat">
            <span>02</span>
            <strong>Inventaire valorise</strong>
            <p>Les machines recentes et les points d'attention remontent plus clairement.</p>
          </article>
          <article className="showcase-stat">
            <span>03</span>
            <strong>Flux admin simplifie</strong>
            <p>Le formulaire d'ajout est mieux guide et plus presentable.</p>
          </article>
        </div>

        <div className="showcase-note">
          <span>Compte de demonstration</span>
          <strong>admin / 123456</strong>
        </div>
      </section>

      <section className="connexion-card">
        <div className="connexion-card__header">
          <p className="eyebrow">Connexion securisee</p>
          <h2>Acceder a l'administration</h2>
          <p>Utilisez votre compte pour ouvrir le cockpit de supervision.</p>
        </div>

        <form className="connexion-form" onSubmit={handleSubmit}>
          <label className="form-group" htmlFor="username">
            <span>Nom d&apos;utilisateur</span>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </label>
          <label className="form-group" htmlFor="password">
            <span>Mot de passe</span>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="feedback error-feedback login-feedback">{error}</p> : null}

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="connexion-card__footer">
          <div className="connexion-inline-meta">
            <span>Acces de test</span>
            <strong>admin / 123456</strong>
          </div>
          <a className="back-link" href="#/">
            Voir le dashboard
          </a>
        </div>
      </section>
    </div>
  );
}
