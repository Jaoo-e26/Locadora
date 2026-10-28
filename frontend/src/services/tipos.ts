export interface Veiculo {
  id: number
  placa: string
  marca: string
  modelo: string
  ano: number
  valorDiaria: string
  status: 'DISPONIVEL' | 'ALUGADO'
}

export interface Locacao {
  id: number
  usuarioId: number
  veiculoId: number
  dataRetirada: string
  dataPrevistaDevolucao: string
  dataDevolucao: string | null
  valorTotal: string | null
  veiculo: Veiculo
}
