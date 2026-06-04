import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useApp, newId } from '../context/AppContext'

const GENEROS = ['femenino', 'masculino', 'otro', 'prefiero no indicar']
const SERVICIOS = ['Fisioterapia manual', 'Rehabilitación deportiva', 'Reeducación postural', 'Punción seca', 'Electroterapia', 'Pilates terapéutico', 'Otro']

const VACIO = {
  nombre: '', apellidos: '', fechaNacimiento: '', genero: 'femenino',
  telefono: '', email: '', direccion: '', profesion: '',
  motivoConsulta: '', antecedentes: '', alergias: '', medicacion: '',
  observaciones: '',
}

export default function FormPaciente() {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (esEdicion) {
      const paciente = state.pacientes.find(p => p.id === id)
      if (paciente) setForm(paciente)
      else navigate('/pacientes')
    }
  }, [id])

  const handle = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errores[name]) setErrores(er => ({ ...er, [name]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = 'El nombre es obligatorio'
    if (!form.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios'
    if (!form.telefono.trim())  e.telefono  = 'El teléfono es obligatorio'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  function guardar(e) {
    e.preventDefault()
    if (!validar()) return
    if (esEdicion) {
      dispatch({ type: 'UPDATE_PACIENTE', payload: { ...form, id } })
      navigate(`/pacientes/${id}`)
    } else {
      const nuevo = { ...form, id: newId(), createdAt: new Date().toISOString() }
      dispatch({ type: 'ADD_PACIENTE', payload: nuevo })
      navigate(`/pacientes/${nuevo.id}`)
    }
  }

  const Field = ({ label, name, type = 'text', required, placeholder, options, rows }) => (
    <div className="mb-3">
      <label className="form-label-be" htmlFor={name}>
        {label}{required && <span style={{ color: 'var(--color-terracota)' }}> *</span>}
      </label>
      {options ? (
        <select id={name} name={name} className="form-select-be" value={form[name]} onChange={handle}>
          {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
        </select>
      ) : rows ? (
        <textarea id={name} name={name} rows={rows} className="form-control-be"
          placeholder={placeholder} value={form[name]} onChange={handle} />
      ) : (
        <input id={name} name={name} type={type} className="form-control-be"
          placeholder={placeholder} value={form[name]} onChange={handle} />
      )}
      {errores[name] && (
        <p style={{ color: 'var(--color-terracota)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
          <i className="bi bi-exclamation-circle me-1" />{errores[name]}
        </p>
      )}
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{esEdicion ? 'Editar paciente' : 'Nuevo paciente'}</h1>
          <p className="page-subtitle">Expediente clínico</p>
        </div>
        <Link to={esEdicion ? `/pacientes/${id}` : '/pacientes'} className="btn-be-outline">
          <i className="bi bi-arrow-left" /> Cancelar
        </Link>
      </div>

      <form onSubmit={guardar} noValidate>
        <div className="row g-4">

          {/* Datos personales */}
          <div className="col-12">
            <div className="card-be">
              <h4 style={{ fontSize: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--color-taupe)', marginBottom: '1.25rem', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                <i className="bi bi-person me-2" style={{ color: 'var(--color-verde)' }} />
                Datos personales
              </h4>
              <div className="row g-3">
                <div className="col-sm-6 col-lg-4"><Field label="Nombre" name="nombre" required placeholder="Nombre" /></div>
                <div className="col-sm-6 col-lg-4"><Field label="Apellidos" name="apellidos" required placeholder="Apellidos" /></div>
                <div className="col-sm-6 col-lg-4"><Field label="Fecha de nacimiento" name="fechaNacimiento" type="date" /></div>
                <div className="col-sm-6 col-lg-4"><Field label="Género" name="genero" options={GENEROS} /></div>
                <div className="col-sm-6 col-lg-4"><Field label="Teléfono" name="telefono" type="tel" required placeholder="+34 600 000 000" /></div>
                <div className="col-sm-6 col-lg-4"><Field label="Email" name="email" type="email" placeholder="correo@email.com" /></div>
                <div className="col-sm-6 col-lg-6"><Field label="Dirección" name="direccion" placeholder="Calle, número, ciudad" /></div>
                <div className="col-sm-6 col-lg-6"><Field label="Profesión" name="profesion" placeholder="Ocupación" /></div>
              </div>
            </div>
          </div>

          {/* Expediente clínico */}
          <div className="col-12">
            <div className="card-be">
              <h4 style={{ fontSize: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--color-taupe)', marginBottom: '1.25rem', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                <i className="bi bi-clipboard2-pulse me-2" style={{ color: 'var(--color-terracota)' }} />
                Expediente clínico
              </h4>
              <div className="row g-3">
                <div className="col-12"><Field label="Motivo principal de consulta" name="motivoConsulta" rows={2} placeholder="Describe el motivo de consulta…" /></div>
                <div className="col-md-6"><Field label="Antecedentes médicos relevantes" name="antecedentes" rows={3} placeholder="Cirugías previas, patologías crónicas…" /></div>
                <div className="col-md-6"><Field label="Alergias" name="alergias" rows={3} placeholder="Alergias conocidas o 'Ninguna'" /></div>
                <div className="col-md-6"><Field label="Medicación actual" name="medicacion" rows={3} placeholder="Fármacos o 'Ninguno'" /></div>
                <div className="col-md-6"><Field label="Observaciones adicionales" name="observaciones" rows={3} placeholder="Cualquier dato relevante…" /></div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="col-12">
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Link to={esEdicion ? `/pacientes/${id}` : '/pacientes'} className="btn-be-outline">
                Cancelar
              </Link>
              <button type="submit" className="btn-be-verde">
                <i className={`bi ${esEdicion ? 'bi-check-lg' : 'bi-person-plus-fill'}`} />
                {esEdicion ? 'Guardar cambios' : 'Crear paciente'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
