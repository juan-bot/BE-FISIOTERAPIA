import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp, calcEdad } from '../context/AppContext'

export default function Pacientes() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)

  const pacientesFiltrados = state.pacientes.filter(p => {
    const q = busqueda.toLowerCase()
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellidos.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.telefono?.includes(q)
    )
  }).sort((a, b) => a.apellidos.localeCompare(b.apellidos))

  function eliminar(id) {
    dispatch({ type: 'DELETE_PACIENTE', payload: id })
    setConfirmarEliminar(null)
  }

  function citasCount(id) {
    return state.citas.filter(c => c.pacienteId === id).length
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pacientes</h1>
          <p className="page-subtitle">{state.pacientes.length} paciente{state.pacientes.length !== 1 ? 's' : ''} registrado{state.pacientes.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/pacientes/nuevo" className="btn-be-verde">
          <i className="bi bi-person-plus-fill" /> Nuevo paciente
        </Link>
      </div>

      {/* Buscador */}
      <div className="card-be mb-3">
        <div style={{ position: 'relative', maxWidth: 380 }}>
          <i className="bi bi-search" style={{
            position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-taupe)', fontSize: '0.9rem',
          }} />
          <input
            className="form-control-be"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Buscar por nombre, email o teléfono…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="card-be" style={{ padding: 0, overflow: 'hidden' }}>
        {pacientesFiltrados.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-people" />
            <p>{busqueda ? 'No se encontraron pacientes con esa búsqueda' : 'Todavía no hay pacientes registrados'}</p>
            {!busqueda && (
              <Link to="/pacientes/nuevo" className="btn-be-verde mt-3">
                <i className="bi bi-plus-lg" /> Crear primer paciente
              </Link>
            )}
          </div>
        ) : (
          <div className="table-responsive-be">
            <table className="table-be">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Motivo</th>
                  <th>Citas</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map(p => (
                  <tr key={p.id} onClick={() => navigate(`/pacientes/${p.id}`)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'var(--color-verde)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600,
                          flexShrink: 0,
                        }}>
                          {p.nombre.charAt(0)}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-taupe-dark)' }}>
                            {p.nombre} {p.apellidos}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-taupe)' }}>
                            {p.genero}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{calcEdad(p.fechaNacimiento)} años</td>
                    <td>{p.telefono || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{p.email || '—'}</td>
                    <td style={{ fontSize: '0.83rem', color: 'var(--color-taupe)', maxWidth: 200,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.motivoConsulta || '—'}
                    </td>
                    <td>
                      <span style={{
                        background: 'rgba(122,158,135,0.15)', color: 'var(--color-verde-dark)',
                        borderRadius: '999px', padding: '0.2rem 0.6rem',
                        fontSize: '0.75rem', fontWeight: 700,
                      }}>
                        {citasCount(p.id)}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link to={`/pacientes/${p.id}/editar`} className="btn-be-outline"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                          title="Editar">
                          <i className="bi bi-pencil" />
                        </Link>
                        <button className="btn-be-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                          title="Eliminar"
                          onClick={() => setConfirmarEliminar(p)}>
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

      {/* Modal confirmar eliminar */}
      {confirmarEliminar && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}>
          <div className="card-be" style={{ maxWidth: 420, width: '90%' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>¿Eliminar paciente?</h3>
            <p style={{ color: 'var(--color-taupe)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Se eliminará a <strong>{confirmarEliminar.nombre} {confirmarEliminar.apellidos}</strong> junto
              con todas sus citas y notas clínicas. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn-be-outline" onClick={() => setConfirmarEliminar(null)}>Cancelar</button>
              <button className="btn-be-danger" onClick={() => eliminar(confirmarEliminar.id)}>
                <i className="bi bi-trash" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
