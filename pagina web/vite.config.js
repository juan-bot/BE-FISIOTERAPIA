import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cambia '/be-fisioterapia/' por el nombre de tu repositorio en GitHub
// Ejemplo: si tu repo se llama "mi-web", pon base: '/mi-web/'
export default defineConfig({
  plugins: [react()],
  base: '/be-fisioterapia/',
})
