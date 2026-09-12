import { useEffect, useMemo, useState } from 'react'
import styles from './Contact.module.css'
import { createBookingRequest, getAvailability } from '../services/bookingApi'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const toISODate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const formatDate = iso => new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${iso}T12:00:00`))

export default function Contact() {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [availabilityError, setAvailabilityError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', motivo: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const monthStart = useMemo(() => new Date(month.getFullYear(), month.getMonth(), 1), [month])
  const monthEnd = useMemo(() => new Date(month.getFullYear(), month.getMonth() + 1, 0), [month])
  const today = toISODate(new Date())

  useEffect(() => {
    let active = true
    setLoading(true)
    setAvailabilityError('')
    setSelectedSlot(null)
    getAvailability({ from: toISODate(monthStart), to: toISODate(monthEnd) })
      .then(data => { if (active) setSlots(data.slots || []) })
      .catch(() => { if (active) { setSlots([]); setAvailabilityError('No fue posible consultar la agenda en este momento. Intenta nuevamente más tarde.') } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [monthStart, monthEnd])

  const slotsByDate = useMemo(() => slots.reduce((map, slot) => {
    if (!map[slot.date]) map[slot.date] = []
    map[slot.date].push(slot)
    return map
  }, {}), [slots])

  const calendarDays = useMemo(() => {
    const leadingDays = (monthStart.getDay() + 6) % 7
    return Array.from({ length: leadingDays + monthEnd.getDate() }, (_, index) => {
      if (index < leadingDays) return null
      const date = new Date(month.getFullYear(), month.getMonth(), index - leadingDays + 1)
      return { date, iso: toISODate(date) }
    })
  }, [month, monthStart, monthEnd])

  const submit = async e => {
    e.preventDefault()
    if (!selectedSlot) { setSubmitError('Selecciona primero un horario disponible.'); return }
    if (!form.nombre.trim() || !form.telefono.trim() || !form.motivo || !form.mensaje.trim()) {
      setSubmitError('Completa todos los campos obligatorios. El correo electrónico es opcional.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      await createBookingRequest({ name: form.nombre.trim(), phone: form.telefono.trim(), email: form.email.trim(), service: form.motivo, notes: form.mensaje.trim(), slot: selectedSlot })
      setSent(true)
    } catch (error) {
      setSubmitError(error.message || 'No se pudo enviar tu solicitud. Intenta nuevamente.')
    } finally { setSubmitting(false) }
  }

  const previousMonthDisabled = monthStart.getFullYear() === new Date().getFullYear() && monthStart.getMonth() === new Date().getMonth()

  return (
    <section id="contacto" className={styles.section}>
      <div className="container">
        <div className="row g-5 align-items-start">

          {/* Info */}
          <div className="col-lg-4">
            <p className="section-subtitle mb-2">Agenda en línea</p>
            <h2 className="section-title mb-4">Solicita tu cita</h2>
            <p className={styles.body}>
              Elige uno de los horarios disponibles. La clínica te contactará para confirmar tu cita.
            </p>
            <div className={styles.notice}><i className="bi bi-info-circle" /><p>Tu horario queda pendiente de confirmación hasta que el equipo se comunique contigo.</p></div>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><i className="bi bi-telephone" /></div>
                <div>
                  <p className={styles.infoLabel}>Teléfono</p>
                  <p className={styles.infoValue}>+34 600 000 000</p>
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
          <div className="col-lg-8">
            {sent ? (
              <div className={styles.successBox}>
                <i className="bi bi-calendar-check fs-2 mb-3" style={{ color: 'var(--color-verde)' }} />
                <h3 className={styles.successTitle}>Solicitud recibida</h3>
                <p className={styles.body}>Recibimos tu solicitud para el {formatDate(selectedSlot.date)} a las {selectedSlot.startTime}. Te contactaremos al teléfono indicado para confirmarla.</p>
                <button className="btn btn-outline-verde mt-2" onClick={() => { setSent(false); setSelectedSlot(null) }}>Solicitar otro horario</button>
              </div>
            ) : (
              <div className={styles.bookingCard}>
                <div className={styles.calendarHeader}>
                  <div><p className={styles.calendarEyebrow}>1. Elige día y hora</p><h3>{MONTHS[month.getMonth()]} {month.getFullYear()}</h3></div>
                  <div className={styles.monthActions}><button type="button" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))} disabled={previousMonthDisabled} aria-label="Mes anterior"><i className="bi bi-chevron-left" /></button><button type="button" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))} aria-label="Mes siguiente"><i className="bi bi-chevron-right" /></button></div>
                </div>
                <div className={styles.weekdays}>{WEEKDAYS.map(day => <span key={day}>{day}</span>)}</div>
                <div className={styles.calendarGrid}>
                  {calendarDays.map((day, index) => day ? <button type="button" key={day.iso} disabled={day.iso < today || !slotsByDate[day.iso]?.length} onClick={() => setSelectedSlot(slotsByDate[day.iso][0])} className={`${styles.day} ${slotsByDate[day.iso]?.length ? styles.dayAvailable : ''} ${selectedSlot?.date === day.iso ? styles.daySelected : ''}`}><span>{day.date.getDate()}</span>{slotsByDate[day.iso]?.length ? <small>{slotsByDate[day.iso].length} horario{slotsByDate[day.iso].length !== 1 ? 's' : ''}</small> : null}</button> : <span className={styles.emptyDay} key={`empty-${index}`} />)}
                </div>
                {loading && <p className={styles.calendarStatus}><i className="bi bi-arrow-repeat" /> Consultando disponibilidad…</p>}
                {availabilityError && <p className={styles.error} role="alert">{availabilityError}</p>}
                {selectedSlot && <div className={styles.slotPanel}><p className={styles.slotTitle}>Horarios disponibles el {formatDate(selectedSlot.date)}</p><div className={styles.slotList}>{slotsByDate[selectedSlot.date]?.map(slot => <button type="button" key={`${slot.date}-${slot.startTime}`} className={`${styles.slot} ${selectedSlot.startTime === slot.startTime ? styles.slotSelected : ''}`} onClick={() => setSelectedSlot(slot)}>{slot.startTime} – {slot.endTime}</button>)}</div></div>}
              <form onSubmit={submit} className={styles.form} noValidate>
                <p className={styles.calendarEyebrow}>2. Tus datos</p>
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
                      placeholder="Tu teléfono"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className={styles.label} htmlFor="motivo">Motivo de consulta</label>
                    <select id="motivo" name="motivo" className={styles.input} required value={form.motivo} onChange={handle}>
                      <option value="" disabled>Selecciona un servicio</option>
                      <option>Consulta de fisioterapia</option>
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
                      required value={form.mensaje} onChange={handle}
                      placeholder="Cuéntanos brevemente cómo podemos ayudarte"
                    />
                  </div>
                  {submitError && <div className="col-12"><p className={styles.error} role="alert">{submitError}</p></div>}
                  <div className="col-12">
                    <button type="submit" className="btn btn-verde w-100" disabled={submitting || !selectedSlot}>{submitting ? 'Enviando solicitud…' : selectedSlot ? `Solicitar ${selectedSlot.startTime} – ${selectedSlot.endTime}` : 'Selecciona un horario'}</button>
                  </div>
                </div>
              </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
