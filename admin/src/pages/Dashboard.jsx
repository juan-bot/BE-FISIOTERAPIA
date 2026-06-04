import { Link } from 'react-router-dom'
import { useApp, formatFecha } from '../context/AppContext'

export default function Dashboard() {
  const { state } = useApp()
  const { pacientes, citas, notas } = state

  const hoy = new Date().toISOString().slice(0, 10)
  const citasHoy      = citas.filter(c => c.fecha === hoy)
  const citasPendientes = citas.filter(c => c.estado === 'pendiente')
  const citasCompletadas = citas.filter(c => c.estado === 'completada')

  // Próximas citas (fecha >= hoy, ordenadas)
  const proximas = [...citas]
    .filter(c => c.fecha >= hoy && c.estado === 'pendiente')
    .sort((a, b) => `${a.fecha}${a.hora}` < `${b.fecha}${b.hora}` ? -1 : 1)
    .slice(0, 5)

  // Últimas notas
  const ultimasNotas = [...notas]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4)

  function nombrePaciente(id) {
    const p = pacientes.find(p => p.id === id)
    return p ? `${p.nombre} ${p.apellidos}` : 'Desconocido'
  }

  return (
    <div>
      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Pacientes', num: pacientes.length, icon: 'bi-people', color: 'verde', to: '/pacientes' },
          { label: 'Citas hoy', num: citasHoy.length, icon: 'bi-calendar-check', color: 'terracota', to: '/citas' },
          { label: 'Citas pendientes', num: citasPendientes.length, icon: 'bi-clock', color: 'taupe', to: '/citas' },
          { label: 'Sesiones completadas', num: citasCompletadas.length, icon: 'bi-check-circle', color: 'verde', to: '/citas' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-xl-3">
            <Link to={s.to} style={{ textDecoration: 'none' }}>
              <div className={`stat-card ${s.color}`}>
                <i className={`bi ${s.icon} stat-icon`} />
                <p className="stat-num">{s.num}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Próximas citas */}
        <div className="col-lg-7">
          <div className="card-be h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-taupe-dark)', margin: 0 }}>
                Próximas citas
              </h3>
              <Link to="/citas/nueva" className="btn-be-verde" style={{ fontSize: '0.7rem', padding: '0.4rem 0.9rem' }}>
                <i className="bi bi-plus-lg" /> Nueva cita
              </Link>
            </div>

            {proximas.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-calendar3" />
                <p>No hay citas próximas</p>
              </div>
            ) : (
              <div className="table-responsive-be">
                <table className="table-be">
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Servicio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proximas.map(c => (
                      <tr key={c.id} onClick={() => {}}>
                        <td style={{ fontWeight: 700 }}>{nombrePaciente(c.pacienteId)}</td>
                        <td>{formatFecha(c.fecha)}</td>
                        <td>{c.hora}</td>
                        <td style={{ color: 'var(--color-taupe)', fontSize: '0.85rem' }}>{c.tipo}</td>
                        <td>
                          <span className={`badge rounded-pill badge-${c.estado}`}
                            style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                            {c.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Últimas notas clínicas */}
        <div className="col-lg-5">
          <div className="card-be h-100">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-taupe-dark)', margin: '0 0 1rem' }}>
              Últimas notas clínicas
            </h3>

            {ultimasNotas.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-journal-text" />
                <p>Sin notas todavía</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {ultimasNotas.map(n => {
                  const cita = citas.find(c => c.id === n.citaId)
                  return (
                    <div key={n.id} style={{
                      padding: '0.9rem',
                      background: 'var(--color-crema)',
                      borderLeft: '3px solid var(--color-verde)',
                    }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 0.2rem', color: 'var(--color-taupe-dark)' }}>
                        {nombrePaciente(n.pacienteId)}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-taupe)', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>
                        {cita ? `${formatFecha(cita.fecha)} · ${cita.tipo}` : '—'}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-taupe-dark)', margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {n.evolucion}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
