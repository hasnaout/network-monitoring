import React, { useState } from 'react';
import './connexion.css';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setError('');
    console.log('Connexion:', { email, password });
    window.location.hash = '#/';
  };

  return (
    <div className="connexion-container">
      <div className="connexion-box">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="User Name"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-submit">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
