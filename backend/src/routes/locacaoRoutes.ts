import { Router } from 'express'
import { autenticacao } from '../middlewares/autenticacao.js'
import {
  registrarLocacao,
  registrarDevolucao,
  listarLocacoes
} from '../controllers/locacaoController.js'

const router = Router()

router.use(autenticacao)

router.post('/', registrarLocacao)
router.get('/', listarLocacoes)
router.patch('/:id/devolucao', registrarDevolucao)

export default router
