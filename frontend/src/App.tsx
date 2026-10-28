import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Veiculos from './pages/Veiculos'
import Locacoes from './pages/Locacoes'
import RotaPrivada from './components/RotaPrivada'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/veiculos"
          element={
            <RotaPrivada>
              <Veiculos />
            </RotaPrivada>
          }
        />
        <Route
          path="/locacoes"
          element={
            <RotaPrivada>
              <Locacoes />
            </RotaPrivada>
          }
        />
        <Route path="*" element={<Navigate to="/veiculos" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
