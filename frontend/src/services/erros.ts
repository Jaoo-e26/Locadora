import axios from 'axios'

export function mensagemDeErro(erro: unknown): string {
  if (axios.isAxiosError(erro) && erro.response?.data?.erro) {
    return erro.response.data.erro
  }

  return 'Não foi possível conectar ao servidor'
}
