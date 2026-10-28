import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { estaLogado } from '../services/sessao'

function RotaPrivada({ children }: { children: ReactNode }) {
  if (!estaLogado()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default RotaPrivada
