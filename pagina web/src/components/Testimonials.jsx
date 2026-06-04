import styles from './Testimonials.module.css'

const testimonials = [
  {
    name: 'Laura M.',
    tag: 'Lesión de rodilla',
    stars: 5,
    text: 'Después de meses con dolor crónico de rodilla, en pocas sesiones noté una mejoría increíble. El trato es cercano y profesional a la vez. ¡100% recomendable!',
  },
  {
    name: 'Carlos R.',
    tag: 'Rehabilitación deportiva',
    stars: 5,
    text: 'Volví a competir antes de lo que esperaba. El protocolo de recuperación fue impecable y me enseñaron a conocer mejor mi cuerpo para evitar nuevas lesiones.',
  },
  {
    name: 'Ana P.',
    tag: 'Dolor de espalda',
    stars: 5,
    text: 'Llevaba años con contracturas. Me explicaron el porqué de cada técnica, algo que valoro mucho. Ahora vivo sin ese dolor constante que creía que era "normal".',
  },
]

function Stars({ count }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} className="bi bi-star-fill" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonios" className={styles.section}>
      <div className="container">
        <div className="text-center mb-5">
          <p className="section-subtitle mb-2">Pacientes</p>
          <h2 className="section-title">Lo que dicen de mí</h2>
          <div className="divider justify-content-center mt-3 mb-0">
            <span className="divider-dot" />
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {testimonials.map((t, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className={styles.card}>
                <i className={`bi bi-quote ${styles.quoteIcon}`} />
                <Stars count={t.stars} />
                <p className={styles.text}>"{t.text}"</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className={styles.name}>{t.name}</p>
                    <p className={styles.tag}>{t.tag}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
