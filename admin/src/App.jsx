import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import PacienteDetalle from './pages/PacienteDetalle'
import FormPaciente from './pages/FormPaciente'
import Citas from './pages/Citas'
import FormCita from './pages/FormCita'

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Cierra sidebar al navegar en móvil
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  return (
    <div className="admin-layout">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <Header onToggle={() => setSidebarOpen(o => !o)} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/"                         element={<Dashboard />} />
            <Route path="/pacientes"                element={<Pacientes />} />
            <Route path="/pacientes/nuevo"          element={<FormPaciente />} />
            <Route path="/pacientes/:id"            element={<PacienteDetalle />} />
            <Route path="/pacientes/:id/editar"     element={<FormPaciente />} />
            <Route path="/citas"                    element={<Citas />} />
            <Route path="/citas/nueva"              element={<FormCita />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  )
}
