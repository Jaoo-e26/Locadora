import { Request, Response } from 'express'
import prisma from '../lib/prisma.js'

export async function cadastrarVeiculo(req: Request, res: Response): Promise<void> {
  const { placa, marca, modelo, ano, valorDiaria } = req.body

  if (!placa || !marca || !modelo || !ano || !valorDiaria) {
    res.status(400).json({ erro: 'Placa, marca, modelo, ano e valor da diária são obrigatórios' })
    return
  }

  const existente = await prisma.veiculo.findUnique({ where: { placa } })

  if (existente) {
    res.status(409).json({ erro: 'Placa já cadastrada' })
    return
  }

  const veiculo = await prisma.veiculo.create({
    data: { placa, marca, modelo, ano: Number(ano), valorDiaria }
  })

  res.status(201).json(veiculo)
}

export async function listarVeiculos(req: Request, res: Response): Promise<void> {
  const { status } = req.query

  const veiculos = await prisma.veiculo.findMany({
    where: status === 'DISPONIVEL' || status === 'ALUGADO' ? { status } : {},
    orderBy: { id: 'asc' }
  })

  res.json(veiculos)
}

export async function buscarVeiculo(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    res.status(400).json({ erro: 'Id inválido' })
    return
  }

  const veiculo = await prisma.veiculo.findUnique({ where: { id } })

  if (!veiculo) {
    res.status(404).json({ erro: 'Veículo não encontrado' })
    return
  }

  res.json(veiculo)
}
