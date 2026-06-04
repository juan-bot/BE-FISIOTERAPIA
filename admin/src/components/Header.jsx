import { useLocation, Link } from 'react-router-dom'
import styles from './Header.module.css'

const TITLES = {
  '/':                   { label: 'Dashboard',        sub: 'Resumen general' },
  '/pacientes':          { label: 'Pacientes',         sub: 'Gestión de pacientes' },
  '/pacientes/nuevo':    { label: 'Nuevo paciente',    sub: 'Crear expediente clínico' },
  '/citas':              { label: 'Citas',             sub: 'Agenda de citas' },
  '/citas/nueva':        { label: 'Nueva cita',        sub: 'Programar cita' },
}

export default function Header({ onToggle }) {
  const { pathname } = useLocation()

  const key = Object.keys(TITLES).find(k => pathname === k || pathname.startsWith(k + '/'))
  const info = TITLES[key] ?? { label: '', sub: '' }

  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Hamburguesa — solo móvil */}
        <button className={styles.hamburger} onClick={onToggle} aria-label="Abrir menú">
          <i className="bi bi-list" />
        </button>
        <div>
          <h2 className={styles.title}>{info.label}</h2>
          <p className={styles.sub}>{info.sub}</p>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.date}>
          <i className="bi bi-calendar3 me-1" />
          {hoy.charAt(0).toUpperCase() + hoy.slice(1)}
        </span>
        <Link to="/pacientes/nuevo" className="btn-be-verde">
          <i className="bi bi-plus-lg" />
          <span className={styles.btnLabel}> Nuevo paciente</span>
        </Link>
      </div>
    </header>
  )
}
