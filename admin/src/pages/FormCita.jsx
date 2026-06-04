import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp, newId } from '../context/AppContext'

const TIPOS = ['Fisioterapia manual', 'Rehabilitación deportiva', 'Reeducación postural', 'Punción seca', 'Electroterapia', 'Pilates terapéutico', 'Valoración inicial', 'Otro']
const DURACIONES = [30, 45, 60, 90]

export default function FormCita() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { state, dispatch } = useApp()

  const [form, setForm] = useState({
    pacienteId: params.get('pacienteId') || '',
    fecha: new Date().toISOString().slice(0, 10),
    hora: '10:00',
    duracion: 60,
    tipo: TIPOS[0],
    estado: 'pendiente',
  })
  const [error, setError] = useState('')

  const handle = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setError('')
  }

  function guardar(e) {
    e.preventDefault()
    if (!form.pacienteId) { setError('Selecciona un paciente'); return }
    if (!form.fecha)       { setError('La fecha es obligatoria'); return }
    const cita = { ...form, duracion: Number(form.duracion), id: newId(), createdAt: new Date().toISOString() }
    dispatch({ type: 'ADD_CITA', payload: cita })
    navigate(form.pacienteId ? `/pacientes/${form.pacienteId}` : '/citas')
  }

  const pacientesOrdenados = [...state.pacientes].sort((a, b) => a.apellidos.localeCompare(b.apellidos))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Nueva cita</h1>
          <p className="page-subtitle">Programar sesión</p>
        </div>
        <Link to="/citas" className="btn-be-outline">
          <i className="bi bi-arrow-left" /> Cancelar
        </Link>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="card-be">
          <form onSubmit={guardar} noValidate>
            <div className="row g-3">

              <div className="col-12">
                <label className="form-label-be" htmlFor="pacienteId">
                  Paciente <span style={{ color: 'var(--color-terracota)' }}>*</span>
                </label>
                <select id="pacienteId" name="pacienteId" className="form-select-be"
                  value={form.pacienteId} onChange={handle}>
                  <option value="">— Seleccionar paciente —</option>
                  {pacientesOrdenados.map(p => (
                    <option key={p.id} value={p.id}>{p.apellidos}, {p.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6">
                <label className="form-label-be" htmlFor="fecha">Fecha *</label>
                <input id="fecha" name="fecha" type="date" className="form-control-be"
                  value={form.fecha} onChange={handle} required />
              </div>

              <div className="col-sm-6">
                <label className="form-label-be" htmlFor="hora">Hora *</label>
                <input id="hora" name="hora" type="time" className="form-control-be"
                  value={form.hora} onChange={handle} required />
              </div>

              <div className="col-sm-6">
                <label className="form-label-be" htmlFor="tipo">Tipo de sesión</label>
                <select id="tipo" name="tipo" className="form-select-be" value={form.tipo} onChange={handle}>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="col-sm-6">
                <label className="form-label-be" htmlFor="duracion">Duración (minutos)</label>
                <select id="duracion" name="duracion" className="form-select-be" value={form.duracion} onChange={handle}>
                  {DURACIONES.map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>

              {error && (
                <div className="col-12">
                  <p style={{ color: 'var(--color-terracota)', fontSize: '0.82rem' }}>
                    <i className="bi bi-exclamation-circle me-1" />{error}
                  </p>
                </div>
              )}

              <div className="col-12" style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Link to="/citas" className="btn-be-outline">Cancelar</Link>
                <button type="submit" className="btn-be-verde">
                  <i className="bi bi-calendar-plus" /> Guardar cita
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
