import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp, formatFecha } from '../context/AppContext'

const ESTADOS = ['todos', 'pendiente', 'completada', 'cancelada']

export default function Citas() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroPaciente, setFiltroPaciente] = useState('')

  function nombrePaciente(id) {
    const p = state.pacientes.find(p => p.id === id)
    return p ? `${p.nombre} ${p.apellidos}` : 'Desconocido'
  }

  const citasFiltradas = [...state.citas]
    .filter(c => {
      if (filtroEstado !== 'todos' && c.estado !== filtroEstado) return false
      if (filtroPaciente && c.pacienteId !== filtroPaciente) return false
      return true
    })
    .sort((a, b) => `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`))

  function cambiarEstado(cita, estado) {
    dispatch({ type: 'UPDATE_CITA', payload: { ...cita, estado } })
  }

  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Citas</h1>
          <p className="page-subtitle">{state.citas.length} cita{state.citas.length !== 1 ? 's' : ''} en total</p>
        </div>
        <Link to="/citas/nueva" className="btn-be-verde">
          <i className="bi bi-calendar-plus" /> Nueva cita
        </Link>
      </div>

      {/* Filtros */}
      <div className="card-be mb-3">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div>
            <label className="form-label-be" style={{ marginBottom: '0.3rem' }}>Estado</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {ESTADOS.map(e => (
                <button key={e} onClick={() => setFiltroEstado(e)} style={{
                  padding: '0.3rem 0.85rem', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'capitalize',
                  background: filtroEstado === e ? 'var(--color-verde)' : 'var(--color-crema-dark)',
                  color: filtroEstado === e ? '#fff' : 'var(--color-taupe-dark)',
                  transition: 'background 0.2s',
                }}>
                  {e === 'todos' ? 'Todas' : e}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
            <label className="form-label-be" style={{ marginBottom: '0.3rem' }}>Paciente</label>
            <select className="form-select-be" value={filtroPaciente} onChange={e => setFiltroPaciente(e.target.value)}>
              <option value="">Todos los pacientes</option>
              {[...state.pacientes].sort((a,b) => a.apellidos.localeCompare(b.apellidos)).map(p => (
                <option key={p.id} value={p.id}>{p.apellidos}, {p.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="card-be" style={{ padding: 0, overflow: 'hidden' }}>
        {citasFiltradas.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-calendar3" />
            <p>No hay citas con esos filtros</p>
          </div>
        ) : (
          <div className="table-responsive-be">
            <table className="table-be">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Duración</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {citasFiltradas.map(c => (
                  <tr key={c.id} onClick={() => navigate(`/pacientes/${c.pacienteId}`)}>
                    <td style={{ fontWeight: 700 }}>{nombrePaciente(c.pacienteId)}</td>
                    <td>
                      <span style={{ fontWeight: c.fecha === hoy ? 700 : 400,
                        color: c.fecha === hoy ? 'var(--color-verde-dark)' : undefined }}>
                        {formatFecha(c.fecha)}
                        {c.fecha === hoy && <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem',
                          background: 'rgba(122,158,135,0.15)', color: 'var(--color-verde-dark)',
                          padding: '0.1rem 0.4rem', borderRadius: 999, fontWeight: 700 }}>Hoy</span>}
                      </span>
                    </td>
                    <td>{c.hora}</td>
                    <td>{c.duracion} min</td>
                    <td style={{ color: 'var(--color-taupe)', fontSize: '0.85rem' }}>{c.tipo}</td>
                    <td>
                      <span className={`badge badge-${c.estado}`} style={{
                        padding: '0.25rem 0.7rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
                      }}>
                        {c.estado}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {c.estado === 'pendiente' && (
                          <button className="btn-be-verde" style={{ padding: '0.28rem 0.6rem', fontSize: '0.7rem' }}
                            title="Marcar completada"
                            onClick={() => cambiarEstado(c, 'completada')}>
                            <i className="bi bi-check-lg" />
                          </button>
                        )}
                        {c.estado === 'pendiente' && (
                          <button className="btn-be-outline" style={{ padding: '0.28rem 0.6rem', fontSize: '0.7rem' }}
                            title="Cancelar cita"
                            onClick={() => cambiarEstado(c, 'cancelada')}>
                            <i className="bi bi-x-lg" />
                          </button>
                        )}
                        <button className="btn-be-danger" style={{ padding: '0.28rem 0.6rem', fontSize: '0.7rem' }}
                          title="Eliminar cita"
                          onClick={() => dispatch({ type: 'DELETE_CITA', payload: c.id })}>
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
