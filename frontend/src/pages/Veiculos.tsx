import { useEffect, useState, type FormEvent } from 'react'
import api from '../services/api'
import { mensagemDeErro } from '../services/erros'
import type { Veiculo } from '../services/tipos'
import Menu from '../components/Menu'

function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [placa, setPlaca] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [ano, setAno] = useState('')
  const [valorDiaria, setValorDiaria] = useState('')
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      const resposta = await api.get<Veiculo[]>('/veiculos')
      setVeiculos(resposta.data)
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault()
    setErro('')

    try {
      await api.post('/veiculos', {
        placa,
        marca,
        modelo,
        ano: Number(ano),
        valorDiaria: Number(valorDiaria)
      })
      setPlaca('')
      setMarca('')
      setModelo('')
      setAno('')
      setValorDiaria('')
      await carregar()
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  return (
    <div>
      <Menu />
      <h1>Veículos</h1>

      <form onSubmit={cadastrar}>
        <input
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          required
        />
        <input
          placeholder="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          required
        />
        <input
          placeholder="Modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Valor da diária"
          value={valorDiaria}
          onChange={(e) => setValorDiaria(e.target.value)}
          required
        />
        <button type="submit">Cadastrar veículo</button>
      </form>

      {erro && <p>{erro}</p>}

      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Ano</th>
            <th>Diária</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>{veiculo.placa}</td>
              <td>{veiculo.marca}</td>
              <td>{veiculo.modelo}</td>
              <td>{veiculo.ano}</td>
              <td>R$ {Number(veiculo.valorDiaria).toFixed(2)}</td>
              <td>{veiculo.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Veiculos
