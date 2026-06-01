import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // O build vai para ../static, servido pelo FastAPI
    outDir: '../static',
    emptyOutDir: true,
  },
  server: {
    // Em desenvolvimento, proxy as chamadas de API para o FastAPI
    proxy: {
      '/auth': 'http://localhost:8000',
      '/clientes': 'http://localhost:8000',
      '/produtos': 'http://localhost:8000',
      '/ordens': 'http://localhost:8000',
      '/vendas': 'http://localhost:8000',
      '/funcionarios': 'http://localhost:8000',
      '/relatorios': 'http://localhost:8000',
    }
  }
})
