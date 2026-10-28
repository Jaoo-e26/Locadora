import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface RequisicaoAutenticada extends Request {
  usuarioId?: number
}

export function autenticacao(
  req: RequisicaoAutenticada,
  res: Response,
  next: NextFunction
): void {
  const cabecalho = req.headers.authorization

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    res.status(401).json({ erro: 'Token não informado' })
    return
  }

  const token = cabecalho.slice(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number }
    req.usuarioId = payload.id
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado' })
  }
}
