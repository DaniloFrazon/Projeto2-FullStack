import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  // REMOVA ou COMENTE a linha 'base' para o desenvolvimento local:
  // base: '/Projeto1FullStack/', 
})