import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

export async function registrar(req: Request, res: Response): Promise<void> {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' })
    return
  }

  const existente = await prisma.usuario.findUnique({ where: { email } })

  if (existente) {
    res.status(409).json({ erro: 'Email já cadastrado' })
    return
  }

  const senhaHash = await bcrypt.hash(senha, 10)

  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: senhaHash },
    select: { id: true, nome: true, email: true }
  })

  res.status(201).json(usuario)
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, senha } = req.body

  if (!email || !senha) {
    res.status(400).json({ erro: 'Email e senha são obrigatórios' })
    return
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } })

  if (!usuario) {
    res.status(401).json({ erro: 'Credenciais inválidas' })
    return
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha)

  if (!senhaValida) {
    res.status(401).json({ erro: 'Credenciais inválidas' })
    return
  }

  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1d'
  })

  res.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  })
}
