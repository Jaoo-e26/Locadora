import { Response } from 'express'
import prisma from '../lib/prisma.js'
import { RequisicaoAutenticada } from '../middlewares/autenticacao.js'

export async function registrarLocacao(req: RequisicaoAutenticada, res: Response): Promise<void> {
  const { veiculoId, dataPrevistaDevolucao } = req.body
  const idVeiculo = Number(veiculoId)
  const dataPrevista = new Date(dataPrevistaDevolucao)

  if (!veiculoId || Number.isNaN(idVeiculo) || !dataPrevistaDevolucao || Number.isNaN(dataPrevista.getTime())) {
    res.status(400).json({ erro: 'Informe veiculoId e dataPrevistaDevolucao válidos' })
    return
  }

  if (dataPrevista <= new Date()) {
    res.status(400).json({ erro: 'A data prevista de devolução deve ser futura' })
    return
  }

  const veiculo = await prisma.veiculo.findUnique({ where: { id: idVeiculo } })

  if (!veiculo) {
    res.status(404).json({ erro: 'Veículo não encontrado' })
    return
  }

  const locacao = await prisma.$transaction(async (tx) => {
    const reservado = await tx.veiculo.updateMany({
      where: { id: idVeiculo, status: 'DISPONIVEL' },
      data: { status: 'ALUGADO' }
    })

    if (reservado.count === 0) {
      return null
    }

    return tx.locacao.create({
      data: {
        usuarioId: req.usuarioId as number,
        veiculoId: idVeiculo,
        dataPrevistaDevolucao: dataPrevista
      }
    })
  })

  if (!locacao) {
    res.status(409).json({ erro: 'Veículo indisponível' })
    return
  }

  res.status(201).json(locacao)
}
export async function registrarDevolucao(req: RequisicaoAutenticada, res: Response): Promise<void> {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    res.status(400).json({ erro: 'Id inválido' })
    return
  }

  const locacao = await prisma.locacao.findUnique({
    where: { id },
    include: { veiculo: true }
  })

  if (!locacao) {
    res.status(404).json({ erro: 'Locação não encontrada' })
    return
  }

  if (locacao.usuarioId !== req.usuarioId) {
    res.status(403).json({ erro: 'Esta locação pertence a outro usuário' })
    return
  }

  if (locacao.dataDevolucao) {
    res.status(409).json({ erro: 'Locação já devolvida' })
    return
  }

  const agora = new Date()
  const milissegundosPorDia = 1000 * 60 * 60 * 24
  const dias = Math.max(1, Math.ceil((agora.getTime() - locacao.dataRetirada.getTime()) / milissegundosPorDia))
  const valorTotal = locacao.veiculo.valorDiaria.mul(dias)

  const [locacaoAtualizada] = await prisma.$transaction([
    prisma.locacao.update({
      where: { id },
      data: { dataDevolucao: agora, valorTotal }
    }),
    prisma.veiculo.update({
      where: { id: locacao.veiculoId },
      data: { status: 'DISPONIVEL' }
    })
  ])

  res.json(locacaoAtualizada)
}
export async function listarLocacoes(req: RequisicaoAutenticada, res: Response): Promise<void> {
  const locacoes = await prisma.locacao.findMany({
    where: { usuarioId: req.usuarioId },
    include: { veiculo: true },
    orderBy: { id: 'desc' }
  })

  res.json(locacoes)
}