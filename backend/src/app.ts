import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import veiculoRoutes from './routes/veiculoRoutes.js'
import locacaoRoutes from './routes/locacaoRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/saude', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/auth', authRoutes)
app.use('/veiculos', veiculoRoutes)
app.use('/locacoes', locacaoRoutes)

export default app
