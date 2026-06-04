import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const NAV = [
  { to: '/',          icon: 'bi-grid',          label: 'Dashboard'  },
  { to: '/pacientes', icon: 'bi-people',         label: 'Pacientes'  },
  { to: '/citas',     icon: 'bi-calendar3',      label: 'Citas'      },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Botón cerrar en móvil */}
      <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar menú">
        <i className="bi bi-x-lg" />
      </button>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoB}>B</span>
        <span className={styles.logoE}>E</span>
        <div className={styles.logoText}>
          <span className={styles.logoName}>Fisioterapia</span>
          <span className={styles.logoSub}>Panel admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <p className={styles.navSection}>Menú</p>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <i className={`bi ${item.icon} ${styles.navIcon}`} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.user}>
          <div className={styles.userAvatar}>BE</div>
          <div>
            <p className={styles.userName}>Belén Eludomilia</p>
            <p className={styles.userRole}>Fisioterapeuta</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
