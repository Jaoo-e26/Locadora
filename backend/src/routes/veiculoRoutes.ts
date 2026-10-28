import { Router } from 'express'
import { autenticacao } from '../middlewares/autenticacao.js'
import {
  cadastrarVeiculo,
  listarVeiculos,
  buscarVeiculo
} from '../controllers/veiculoController.js'

const router = Router()

router.use(autenticacao)

router.post('/', cadastrarVeiculo)
router.get('/', listarVeiculos)
router.get('/:id', buscarVeiculo)

export default router
