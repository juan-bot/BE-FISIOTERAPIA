import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', motivo: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    // Integra aquí tu servicio de email (Formspree, EmailJS, etc.)
    setSent(true)
  }

  return (
    <section id="contacto" className={styles.section}>
      <div className="container">
        <div className="row g-5 align-items-start">

          {/* Info */}
          <div className="col-lg-5">
            <p className="section-subtitle mb-2">Hablemos</p>
            <h2 className="section-title mb-4">Reserva tu primera cita</h2>
            <p className={styles.body}>
              La primera consulta incluye una valoración completa sin coste adicional.
              Escríbeme o llámame y encontramos el horario que mejor se adapte a ti.
            </p>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><i className="bi bi-geo-alt" /></div>
                <div>
                  <p className={styles.infoLabel}>Dirección</p>
                  <p className={styles.infoValue}>Calle de la Salud 12, Madrid</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><i className="bi bi-telephone" /></div>
                <div>
                  <p className={styles.infoLabel}>Teléfono</p>
                  <p className={styles.infoValue}>+34 600 000 000</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><i className="bi bi-envelope" /></div>
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <p className={styles.infoValue}>hola@beleludomilia.com</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><i className="bi bi-clock" /></div>
                <div>
                  <p className={styles.infoLabel}>Horario</p>
                  <p className={styles.infoValue}>Lun – Vie: 9:00 – 20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="col-lg-7">
            {sent ? (
              <div className={styles.successBox}>
                <i className="bi bi-check-circle-fill fs-2 mb-3" style={{ color: 'var(--color-verde)' }} />
                <h3 className={styles.successTitle}>¡Mensaje enviado!</h3>
                <p className={styles.body}>Me pondré en contacto contigo en menos de 24 h.</p>
                <button className="btn btn-outline-verde mt-2" onClick={() => setSent(false)}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className={styles.form} noValidate>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className={styles.label} htmlFor="nombre">Nombre completo</label>
                    <input
                      id="nombre" name="nombre" type="text"
                      className={styles.input} required
                      value={form.nombre} onChange={handle}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className={styles.label} htmlFor="email">Correo electrónico</label>
                    <input
                      id="email" name="email" type="email"
                      className={styles.input} required
                      value={form.email} onChange={handle}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className={styles.label} htmlFor="telefono">Teléfono</label>
                    <input
                      id="telefono" name="telefono" type="tel"
                      className={styles.input}
                      value={form.telefono} onChange={handle}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className={styles.label} htmlFor="motivo">Motivo de consulta</label>
                    <select id="motivo" name="motivo" className={styles.input} value={form.motivo} onChange={handle}>
                      <option value="">Selecciona un servicio</option>
                      <option>Fisioterapia manual</option>
                      <option>Rehabilitación deportiva</option>
                      <option>Reeducación postural</option>
                      <option>Punción seca</option>
                      <option>Electroterapia</option>
                      <option>Pilates terapéutico</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className={styles.label} htmlFor="mensaje">Mensaje</label>
                    <textarea
                      id="mensaje" name="mensaje" rows="4"
                      className={styles.input}
                      value={form.mensaje} onChange={handle}
                      placeholder="Cuéntame cómo puedo ayudarte..."
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-verde w-100">
                      Enviar mensaje
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
