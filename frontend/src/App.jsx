import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('consultando')

  useEffect(() => {
    fetch('http://localhost:3000/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Health check failed')
        }
        return response.json()
      })
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main>
      <p className="eyebrow">CINEMA / CONFIGURACION INICIAL</p>
      <h1>La pantalla esta lista.</h1>
      <p className="description">React esta ejecutandose y puede comunicarse con Express.</p>
      <div className={`status status-${status}`}>
        <span aria-hidden="true" />
        <span>API health: {status}</span>
      </div>
    </main>
  )
}

export default App
