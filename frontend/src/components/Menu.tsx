import { Link, useNavigate } from 'react-router-dom'
import { limparSessao } from '../services/sessao'

function Menu() {
  const navigate = useNavigate()

  function sair() {
    limparSessao()
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/veiculos">Veículos</Link>
      <Link to="/locacoes">Locações</Link>
      <button onClick={sair}>Sair</button>
    </nav>
  )
}

export default Menu
