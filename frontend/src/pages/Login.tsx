import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { salvarSessao } from '../services/sessao'
import { mensagemDeErro } from '../services/erros'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function entrar(evento: FormEvent) {
    evento.preventDefault()
    setErro('')

    try {
      const resposta = await api.post('/auth/login', { email, senha })
      salvarSessao(resposta.data.token, resposta.data.usuario)
      navigate('/veiculos')
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  return (
    <div>
      <h1>Entrar</h1>
      <form onSubmit={entrar}>
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
        <button type="submit">Entrar</button>
      </form>
      {erro && <p>{erro}</p>}
      <p>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}

export default Login
