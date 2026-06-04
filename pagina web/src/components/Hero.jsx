import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="inicio" className={styles.hero}>
      <div className={`container ${styles.content}`}>
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 col-xl-5">
            <p className="section-subtitle mb-3">Fisioterapia personalizada</p>

            <h1 className={styles.heading}>
              Tu cuerpo tiene la capacidad de{' '}
              <em>sanar.</em>
            </h1>

            <div className="divider my-4">
              <span className="divider-dot" />
            </div>

            <p className={`tagline fs-5 mb-4 ${styles.tagline}`}>
              Creer. Sentir. Avanzar.
            </p>

            <p className={styles.body}>
              Acompañándote en cada paso de tu recuperación con un enfoque
              humano, integral y basado en la evidencia.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-5 justify-content-lg-start justify-content-center">
              <a href="#contacto" className="btn btn-verde">
                Reservar cita
              </a>
              <a href="#servicios" className="btn btn-outline-verde">
                Ver servicios
              </a>
            </div>
          </div>

          <div className="col-lg-6 col-xl-7 d-none d-lg-flex justify-content-center">
            <div className={styles.imageWrapper}>
              <div className={styles.imagePlaceholder}>
                <i className="bi bi-person-heart" style={{ fontSize: '5rem', color: 'var(--color-verde)', opacity: 0.4 }} />
              </div>
              <div className={styles.badge}>
                <span className={styles.badgeNum}>+500</span>
                <span className={styles.badgeText}>Pacientes<br/>recuperados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
    </section>
  )
}
