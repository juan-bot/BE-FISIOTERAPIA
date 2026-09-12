import styles from './About.module.css'

const stats = [
  { num: '8+',   label: 'Años de experiencia' },
  { num: '500+', label: 'Pacientes tratados'   },
  { num: '95%',  label: 'Satisfacción'         },
]

export default function About() {
  return (
    <section id="sobre-mi" className={styles.section}>
      <div className="container">
        <div className="row align-items-center g-5">

          {/* Imagen */}
          <div className="col-lg-5 d-flex justify-content-center">
            <div className={styles.imageArea}>
              <div className={styles.imagePlaceholder}>
                <i className="bi bi-person-heart" style={{ fontSize: '4rem', color: 'var(--color-verde)', opacity: 0.4 }} />
              </div>
              <div className={styles.accentBox} />
            </div>
          </div>

          {/* Texto */}
          <div className="col-lg-7">
            <p className="section-subtitle mb-2">Sobre mí</p>
            <h2 className="section-title mb-4">
              Hola, soy <em style={{ color: 'var(--color-terracota)', fontStyle: 'italic' }}>Belén Eludomilia</em>
            </h2>

            <p className={styles.body}>
              Soy Belén Eludomilia, fisioterapeuta colegiada con más de 8 años de experiencia clínica.
              Mi filosofía de trabajo se basa en tres pilares: <strong>creer</strong> en el potencial
              de recuperación de cada persona, <strong>sentir</strong> cada tejido para afinar el
              diagnóstico y <strong>avanzar</strong> juntos hacia tus objetivos de salud.
            </p>
            <p className={styles.body}>
              Me especializo en fisioterapia musculoesquelética, rehabilitación deportiva y
              tratamiento del dolor crónico, siempre con un enfoque centrado en la persona.
            </p>

            <div className="row g-3 mt-2 mb-4">
              {stats.map((s, i) => (
                <div key={i} className="col-4">
                  <div className={styles.stat}>
                    <span className={styles.statNum}>{s.num}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <a href="#contacto" className="btn btn-terracota mt-2">
              Contactar ahora
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
