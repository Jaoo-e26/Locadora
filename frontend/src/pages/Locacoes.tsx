import { useEffect, useState, type FormEvent } from 'react'
import api from '../services/api'
import { mensagemDeErro } from '../services/erros'
import type { Locacao, Veiculo } from '../services/tipos'
import Menu from '../components/Menu'

function formatarData(data: string, utc = false): string {
  return new Date(data).toLocaleDateString('pt-BR', utc ? { timeZone: 'UTC' } : undefined)
}

function Locacoes() {
  const [locacoes, setLocacoes] = useState<Locacao[]>([])
  const [disponiveis, setDisponiveis] = useState<Veiculo[]>([])
  const [veiculoId, setVeiculoId] = useState('')
  const [dataPrevista, setDataPrevista] = useState('')
  const [erro, setErro] = useState('')

  const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  async function carregar() {
    try {
      const [respostaLocacoes, respostaVeiculos] = await Promise.all([
        api.get<Locacao[]>('/locacoes'),
        api.get<Veiculo[]>('/veiculos', { params: { status: 'DISPONIVEL' } })
      ])
      setLocacoes(respostaLocacoes.data)
      setDisponiveis(respostaVeiculos.data)
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function alugar(evento: FormEvent) {
    evento.preventDefault()
    setErro('')

    try {
      await api.post('/locacoes', {
        veiculoId: Number(veiculoId),
        dataPrevistaDevolucao: dataPrevista
      })
      setVeiculoId('')
      setDataPrevista('')
      await carregar()
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  async function devolver(id: number) {
    setErro('')

    try {
      await api.patch(`/locacoes/${id}/devolucao`)
      await carregar()
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  return (
    <div>
      <Menu />
      <h1>Locações</h1>

      <form onSubmit={alugar}>
        <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} required>
          <option value="">Selecione um veículo</option>
          {disponiveis.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
            </option>
          ))}
        </select>
        <input
          type="date"
          min={amanha}
          value={dataPrevista}
          onChange={(e) => setDataPrevista(e.target.value)}
          required
        />
        <button type="submit">Alugar</button>
      </form>

      {erro && <p>{erro}</p>}

      <table>
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Retirada</th>
            <th>Devolução prevista</th>
            <th>Devolvido em</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {locacoes.map((locacao) => (
            <tr key={locacao.id}>
              <td>
                {locacao.veiculo.marca} {locacao.veiculo.modelo} ({locacao.veiculo.placa})
              </td>
              <td>{formatarData(locacao.dataRetirada)}</td>
              <td>{formatarData(locacao.dataPrevistaDevolucao, true)}</td>
              <td>{locacao.dataDevolucao ? formatarData(locacao.dataDevolucao) : 'Em aberto'}</td>
              <td>{locacao.valorTotal ? `R$ ${Number(locacao.valorTotal).toFixed(2)}` : '-'}</td>
              <td>
                {!locacao.dataDevolucao && (
                  <button onClick={() => devolver(locacao.id)}>Devolver</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Locacoes
