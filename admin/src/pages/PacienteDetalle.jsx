import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp, formatFecha, calcEdad, newId } from '../context/AppContext'

export default function PacienteDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const paciente = state.pacientes.find(p => p.id === id)
  if (!paciente) {
    navigate('/pacientes')
    return null
  }

  const citas = [...state.citas.filter(c => c.pacienteId === id)]
    .sort((a, b) => `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`))

  const [tab, setTab] = useState('citas') // 'citas' | 'expediente'
  const [citaAbierta, setCitaAbierta] = useState(null)
  const [modalNota, setModalNota] = useState(null) // citaId
  const [formNota, setFormNota] = useState({ evolucion: '', tratamiento: '', observaciones: '' })
  const [editandoNota, setEditandoNota] = useState(null)

  function cambiarEstadoCita(cita, estado) {
    dispatch({ type: 'UPDATE_CITA', payload: { ...cita, estado } })
  }

  function eliminarCita(citaId) {
    dispatch({ type: 'DELETE_CITA', payload: citaId })
    if (citaAbierta === citaId) setCitaAbierta(null)
  }

  function abrirModalNota(citaId, notaExistente) {
    if (notaExistente) {
      setEditandoNota(notaExistente.id)
      setFormNota({
        evolucion: notaExistente.evolucion,
        tratamiento: notaExistente.tratamiento,
        observaciones: notaExistente.observaciones,
      })
    } else {
      setEditandoNota(null)
      setFormNota({ evolucion: '', tratamiento: '', observaciones: '' })
    }
    setModalNota(citaId)
  }

  function guardarNota(e) {
    e.preventDefault()
    if (editandoNota) {
      const nota = state.notas.find(n => n.id === editandoNota)
      dispatch({ type: 'UPDATE_NOTA', payload: { ...nota, ...formNota } })
    } else {
      dispatch({
        type: 'ADD_NOTA',
        payload: { ...formNota, id: newId(), citaId: modalNota, pacienteId: id, createdAt: new Date().toISOString() },
      })
    }
    setModalNota(null)
  }

  function notaDeCita(citaId) {
    return state.notas.find(n => n.citaId === citaId)
  }

  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', gap: '0.5rem', padding: '0.6rem 0', borderBottom: '1px solid var(--color-crema-dark)' }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--color-taupe)', minWidth: 160 }}>{label}</span>
      <span style={{ fontSize: '0.9rem', color: 'var(--color-taupe-dark)', flex: 1 }}>{value || '—'}</span>
    </div>
  )

  return (
    <div>
      {/* Header paciente */}
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
          <Link to="/pacientes" style={{ color: 'var(--color-taupe)', textDecoration: 'none', fontSize: '1.2rem', flexShrink: 0 }}>
            <i className="bi bi-arrow-left" />
          </Link>
          <div style={{
            width: 46, height: 46, borderRadius: '50%', background: 'var(--color-verde)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: '#fff',
          }}>
            {paciente.nombre.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {paciente.nombre} {paciente.apellidos}
            </h1>
            <p className="page-subtitle">
              {calcEdad(paciente.fechaNacimiento)} años · {paciente.genero} · {paciente.motivoConsulta}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to={`/citas/nueva?pacienteId=${id}`} className="btn-be-verde">
            <i className="bi bi-calendar-plus" /> <span className="d-none d-sm-inline">Nueva cita</span>
          </Link>
          <Link to={`/pacientes/${id}/editar`} className="btn-be-outline">
            <i className="bi bi-pencil" /> <span className="d-none d-sm-inline">Editar</span>
          </Link>
        </div>
      </div>

      {/* Contacto rápido */}
      <div className="card-be mb-4">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { icon: 'bi-telephone', val: paciente.telefono },
            { icon: 'bi-envelope',  val: paciente.email },
            { icon: 'bi-geo-alt',   val: paciente.direccion },
            { icon: 'bi-briefcase', val: paciente.profesion },
          ].map((item, i) => item.val && (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className={`bi ${item.icon}`} style={{ color: 'var(--color-verde)' }} />
              <span style={{ fontSize: '0.88rem', color: 'var(--color-taupe-dark)' }}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem', borderBottom: '2px solid var(--color-crema-dark)' }}>
        {[['citas', 'bi-calendar3', 'Citas'], ['expediente', 'bi-clipboard2-pulse', 'Expediente clínico']].map(([key, icon, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            background: 'none', border: 'none', padding: '0.7rem 1.4rem', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: tab === key ? 'var(--color-verde-dark)' : 'var(--color-taupe)',
            borderBottom: tab === key ? '2px solid var(--color-verde)' : '2px solid transparent',
            marginBottom: -2, transition: 'color 0.2s',
          }}>
            <i className={`bi ${icon} me-2`} />{label}
          </button>
        ))}
      </div>

      {/* Tab: Citas */}
      {tab === 'citas' && (
        <div>
          {citas.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-calendar3" />
              <p>Este paciente no tiene citas todavía</p>
              <Link to={`/citas/nueva?pacienteId=${id}`} className="btn-be-verde mt-3">
                <i className="bi bi-plus-lg" /> Crear primera cita
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {citas.map(cita => {
                const nota = notaDeCita(cita.id)
                const abierta = citaAbierta === cita.id
                return (
                  <div key={cita.id} className="card-be" style={{ padding: '1.25rem' }}>
                    {/* Cabecera cita */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-taupe-dark)' }}>
                            {formatFecha(cita.fecha)} · {cita.hora}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-taupe)' }}>
                            {cita.tipo} · {cita.duracion} min
                          </p>
                        </div>
                        <span className={`badge badge-${cita.estado}`} style={{
                          padding: '0.25rem 0.7rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
                        }}>
                          {cita.estado}
                        </span>
                        {nota && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-verde)', fontWeight: 700 }}>
                            <i className="bi bi-journal-check me-1" />Nota guardada
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {cita.estado === 'pendiente' && (
                          <button className="btn-be-verde" style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }}
                            onClick={() => cambiarEstadoCita(cita, 'completada')}>
                            <i className="bi bi-check-lg" /> Completar
                          </button>
                        )}
                        <button className="btn-be-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }}
                          onClick={() => abrirModalNota(cita.id, nota)}>
                          <i className={`bi ${nota ? 'bi-pencil' : 'bi-journal-plus'}`} />
                          {nota ? ' Editar nota' : ' Agregar nota'}
                        </button>
                        <button className="btn-be-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }}
                          onClick={() => setCitaAbierta(abierta ? null : cita.id)}>
                          <i className={`bi bi-chevron-${abierta ? 'up' : 'down'}`} />
                        </button>
                        <button className="btn-be-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }}
                          onClick={() => eliminarCita(cita.id)}>
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </div>

                    {/* Nota expandida */}
                    {abierta && nota && (
                      <div style={{
                        marginTop: '1.2rem', paddingTop: '1.2rem',
                        borderTop: '1px solid var(--color-crema-dark)',
                        display: 'flex', flexDirection: 'column', gap: '0.85rem',
                      }}>
                        {[
                          ['Evolución / Valoración', nota.evolucion],
                          ['Tratamiento aplicado', nota.tratamiento],
                          ['Observaciones', nota.observaciones],
                        ].map(([label, val]) => val && (
                          <div key={label}>
                            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
                              textTransform: 'uppercase', color: 'var(--color-taupe)', marginBottom: '0.3rem' }}>
                              {label}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-taupe-dark)', lineHeight: 1.7 }}>{val}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {abierta && !nota && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-crema-dark)',
                        color: 'var(--color-taupe)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                        No hay notas para esta cita.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Expediente */}
      {tab === 'expediente' && (
        <div className="card-be">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <Link to={`/pacientes/${id}/editar`} className="btn-be-outline">
              <i className="bi bi-pencil" /> Editar expediente
            </Link>
          </div>
          <InfoRow label="Fecha de nacimiento" value={`${formatFecha(paciente.fechaNacimiento)} (${calcEdad(paciente.fechaNacimiento)} años)`} />
          <InfoRow label="Género" value={paciente.genero} />
          <InfoRow label="Profesión" value={paciente.profesion} />
          <InfoRow label="Teléfono" value={paciente.telefono} />
          <InfoRow label="Email" value={paciente.email} />
          <InfoRow label="Dirección" value={paciente.direccion} />
          <InfoRow label="Motivo de consulta" value={paciente.motivoConsulta} />
          <InfoRow label="Antecedentes" value={paciente.antecedentes} />
          <InfoRow label="Alergias" value={paciente.alergias} />
          <InfoRow label="Medicación" value={paciente.medicacion} />
          <InfoRow label="Observaciones" value={paciente.observaciones} />
        </div>
      )}

      {/* Modal nota */}
      {modalNota && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem',
        }}>
          <div className="card-be" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>
              {editandoNota ? 'Editar nota clínica' : 'Nota de la sesión'}
            </h3>
            <form onSubmit={guardarNota}>
              {[
                { name: 'evolucion', label: 'Evolución / Valoración', placeholder: 'Describe la evolución del paciente, cambios en el dolor, movilidad…' },
                { name: 'tratamiento', label: 'Tratamiento aplicado', placeholder: 'Técnicas usadas, ejercicios, duración…' },
                { name: 'observaciones', label: 'Observaciones y próximos pasos', placeholder: 'Recomendaciones, próxima sesión…' },
              ].map(f => (
                <div key={f.name} className="mb-3">
                  <label className="form-label-be" htmlFor={f.name}>{f.label}</label>
                  <textarea id={f.name} rows={3} className="form-control-be"
                    placeholder={f.placeholder}
                    value={formNota[f.name]}
                    onChange={e => setFormNota(fn => ({ ...fn, [f.name]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-be-outline" onClick={() => setModalNota(null)}>Cancelar</button>
                <button type="submit" className="btn-be-verde">
                  <i className="bi bi-check-lg" /> Guardar nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
