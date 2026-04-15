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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="connexion-container">
      <div className="connexion-box">
        <h1>Connexion</h1>
        <p className="connexion-subtitle">
          Compte par defaut: <strong>admin</strong> / <strong>123456</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom d&apos;utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <a className="back-link" href="#/">
          Retour au dashboard
        </a>
      </div>
    </div>
  );
}
