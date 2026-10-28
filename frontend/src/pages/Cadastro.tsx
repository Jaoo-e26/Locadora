import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { mensagemDeErro } from '../services/erros'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault()
    setErro('')

    try {
      await api.post('/auth/registro', { nome, email, senha })
      navigate('/login')
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={cadastrar}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      {erro && <p>{erro}</p>}
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}

export default Cadastro
