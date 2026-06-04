import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row align-items-center gy-4">

          {/* Logo */}
          <div className="col-md-4">
            <div className={styles.brand}>
              <span className={styles.brandB}>B</span>
              <span className={styles.brandE}>E</span>
              <span className={styles.brandText}>Fisioterapia</span>
            </div>
            <p className={`tagline mt-2 ${styles.tagline}`}>
              Creer. Sentir. Avanzar.
            </p>
          </div>

          {/* Links */}
          <div className="col-md-4 text-md-center">
            <nav className={styles.nav}>
              {['Inicio', 'Servicios', 'Sobre mí', 'Testimonios', 'Contacto'].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(' ', '-').replace('í', 'i')}`} className={styles.link}>
                  {l}
                </a>
              ))}
            </nav>
          </div>

          {/* Redes */}
          <div className="col-md-4 text-md-end">
            <div className={styles.social}>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <i className="bi bi-instagram" />
              </a>
              <a href="#" aria-label="Facebook" className={styles.socialLink}>
                <i className="bi bi-facebook" />
              </a>
              <a href="#" aria-label="WhatsApp" className={styles.socialLink}>
                <i className="bi bi-whatsapp" />
              </a>
            </div>
          </div>

        </div>

        <hr className={styles.hr} />

        <p className={styles.copy}>
          © {new Date().getFullYear()} Belén Eludomilia · BE Fisioterapia · Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}
