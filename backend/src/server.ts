import 'dotenv/config'
import app from './app.js'

const porta = Number(process.env.PORT) || 3333

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`)
})
