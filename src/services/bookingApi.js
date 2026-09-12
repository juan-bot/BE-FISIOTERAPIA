const baseUrl = import.meta.env.VITE_BOOKING_API_URL?.replace(/\/$/, '')

function requireApiUrl() {
  if (!baseUrl) throw new Error('El calendario se está configurando. Vuelve a intentarlo más tarde.')
}

async function request(path, options = {}) {
  requireApiUrl()
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'No fue posible procesar la solicitud.')
  return payload
}

export const getAvailability = ({ from, to }) => request(`/public/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
export const createBookingRequest = data => request('/public/booking-requests', { method: 'POST', body: JSON.stringify(data) })
