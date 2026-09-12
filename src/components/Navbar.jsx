import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const links = [
  { href: '#inicio',        label: 'Inicio' },
  { href: '#servicios',     label: 'Servicios' },
  { href: '#sobre-mi',      label: 'Sobre mí' },
  { href: '#testimonios',   label: 'Testimonios' },
  { href: '#contacto',      label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = () => setOpen(false)

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className="container">
        {/* Logo */}
        <a className={`navbar-brand ${styles.brand}`} href="#inicio">
          <span className={styles.brandB}>B</span>
          <span className={styles.brandE}>E</span>
          <span className={styles.brandText}>Fisioterapia</span>
        </a>

        {/* Toggle */}
        <button
          className={`navbar-toggler border-0 ${styles.toggler}`}
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'} fs-4`} style={{ color: 'var(--color-taupe-dark)' }} />
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
            {links.map(l => (
              <li key={l.href} className="nav-item">
                <a className={`nav-link ${styles.navLink}`} href={l.href} onClick={handleLink}>
                  {l.label}
                </a>
              </li>
            ))}
            <li className="nav-item ms-lg-3">
              <a href="#contacto" className="btn btn-verde" onClick={handleLink}>
                Reservar cita
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
