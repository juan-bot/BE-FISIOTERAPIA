import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

// ── Datos iniciales de ejemplo ──────────────────────────────────────
const DEMO = {
  pacientes: [
    {
      id: '1',
      nombre: 'Ana', apellidos: 'García López',
      fechaNacimiento: '1985-03-12', genero: 'femenino',
      telefono: '612 345 678', email: 'ana@email.com',
      direccion: 'Calle Mayor 5, Madrid',
      motivoConsulta: 'Dolor lumbar crónico',
      antecedentes: 'Hernia discal L4-L5 (2019)',
      alergias: 'Ninguna', medicacion: 'Ibuprofeno ocasional',
      profesion: 'Administrativa',
      createdAt: '2026-01-10T09:00:00',
    },
    {
      id: '2',
      nombre: 'Carlos', apellidos: 'Ruiz Martín',
      fechaNacimiento: '1992-07-25', genero: 'masculino',
      telefono: '698 765 432', email: 'carlos@email.com',
      direccion: 'Av. Libertad 22, Madrid',
      motivoConsulta: 'Lesión de rodilla post-quirúrgica',
      antecedentes: 'Rotura LCA (2025)', alergias: 'Penicilina',
      medicacion: 'Ninguna', profesion: 'Futbolista amateur',
      createdAt: '2026-02-03T10:30:00',
    },
  ],
  citas: [
    {
      id: 'c1', pacienteId: '1',
      fecha: '2026-06-03', hora: '10:00', duracion: 60,
      tipo: 'Fisioterapia manual', estado: 'pendiente',
      createdAt: '2026-05-20T08:00:00',
    },
    {
      id: 'c2', pacienteId: '2',
      fecha: '2026-06-03', hora: '11:30', duracion: 45,
      tipo: 'Rehabilitación deportiva', estado: 'pendiente',
      createdAt: '2026-05-21T09:00:00',
    },
    {
      id: 'c3', pacienteId: '1',
      fecha: '2026-05-27', hora: '10:00', duracion: 60,
      tipo: 'Fisioterapia manual', estado: 'completada',
      createdAt: '2026-05-15T08:00:00',
    },
  ],
  notas: [
    {
      id: 'n1', citaId: 'c3', pacienteId: '1',
      evolucion: 'Mejora notable en la movilidad lumbar. Reducción del dolor del 7/10 a 4/10.',
      tratamiento: 'Movilización L4-L5, masaje descontracturante zona lumbar, ejercicios de estabilización core.',
      observaciones: 'Paciente muy colaboradora. Continuar con el protocolo.',
      createdAt: '2026-05-27T11:00:00',
    },
  ],
}

// ── Reducer ──────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    // Pacientes
    case 'ADD_PACIENTE':
      return { ...state, pacientes: [...state.pacientes, action.payload] }
    case 'UPDATE_PACIENTE':
      return {
        ...state,
        pacientes: state.pacientes.map(p => p.id === action.payload.id ? action.payload : p),
      }
    case 'DELETE_PACIENTE':
      return {
        ...state,
        pacientes: state.pacientes.filter(p => p.id !== action.payload),
        citas: state.citas.filter(c => c.pacienteId !== action.payload),
        notas: state.notas.filter(n => n.pacienteId !== action.payload),
      }
    // Citas
    case 'ADD_CITA':
      return { ...state, citas: [...state.citas, action.payload] }
    case 'UPDATE_CITA':
      return {
        ...state,
        citas: state.citas.map(c => c.id === action.payload.id ? action.payload : c),
      }
    case 'DELETE_CITA':
      return {
        ...state,
        citas: state.citas.filter(c => c.id !== action.payload),
        notas: state.notas.filter(n => n.citaId !== action.payload),
      }
    // Notas
    case 'ADD_NOTA':
      return { ...state, notas: [...state.notas, action.payload] }
    case 'UPDATE_NOTA':
      return {
        ...state,
        notas: state.notas.map(n => n.id === action.payload.id ? action.payload : n),
      }
    case 'DELETE_NOTA':
      return { ...state, notas: state.notas.filter(n => n.id !== action.payload) }
    default:
      return state
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem('be_fisio_data')
    return raw ? JSON.parse(raw) : DEMO
  } catch {
    return DEMO
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  useEffect(() => {
    localStorage.setItem('be_fisio_data', JSON.stringify(state))
  }, [state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}

// ── Helpers de ID ─────────────────────────────────────────────────
export function newId() {
  return crypto.randomUUID()
}

// ── Helpers de formato ────────────────────────────────────────────
export function formatFecha(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function calcEdad(fechaNac) {
  if (!fechaNac) return '—'
  const hoy = new Date()
  const nac = new Date(fechaNac)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}
