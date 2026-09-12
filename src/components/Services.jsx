import styles from './Services.module.css'

const services = [
  {
    icon: 'bi-bandaid',
    color: 'verde',
    title: 'Fisioterapia manual',
    desc: 'Técnicas manuales especializadas para aliviar el dolor, mejorar la movilidad y restaurar la función muscular y articular.',
  },
  {
    icon: 'bi-activity',
    color: 'terracota',
    title: 'Rehabilitación deportiva',
    desc: 'Programas individualizados para la recuperación de lesiones deportivas y la vuelta segura a tu actividad física.',
  },
  {
    icon: 'bi-person-walking',
    color: 'verde',
    title: 'Reeducación postural',
    desc: 'Análisis y corrección de patrones posturales deficientes que generan dolor crónico o limitan tu calidad de vida.',
  },
  {
    icon: 'bi-heart-pulse',
    color: 'terracota',
    title: 'Punción seca',
    desc: 'Técnica de terapia invasiva mínima para el tratamiento de puntos gatillo miofasciales con alta eficacia clínica.',
  },
  {
    icon: 'bi-lightning',
    color: 'verde',
    title: 'Electroterapia',
    desc: 'Aplicación terapéutica de corrientes eléctricas para reducir el dolor, disminuir la inflamación y acelerar la recuperación.',
  },
  {
    icon: 'bi-flower1',
    color: 'terracota',
    title: 'Pilates terapéutico',
    desc: 'Método de ejercicio consciente que fortalece el centro del cuerpo, mejora la postura y previene lesiones futuras.',
  },
]

export default function Services() {
  return (
    <section id="servicios" className={styles.section}>
      <div className="container">
        <div className="text-center mb-5">
          <p className="section-subtitle mb-2">Lo que ofrezco</p>
          <h2 className="section-title">Servicios especializados</h2>
          <div className="divider justify-content-center mt-3 mb-0">
            <span className="divider-dot" />
          </div>
        </div>

        <div className="row g-4">
          {services.map((s, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className={`${styles.card} ${styles[`card--${s.color}`]}`}>
                <div className={`${styles.iconBox} ${styles[`icon--${s.color}`]}`}>
                  <i className={`bi ${s.icon}`} />
                </div>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
                <a href="#contacto" className={styles.cardLink}>
                  Más información <i className="bi bi-arrow-right ms-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
