import { useEffect, useState } from 'react'
import './App.css'
import Connexion from "./pages/connexion.jsx";
import Home from "./pages/home.jsx";

function getCurrentRoute() {
  return window.location.hash || '#/'
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute())

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === '#/connexion') {
    return <Connexion />;
  }

  return <Home />;
}

export default App
