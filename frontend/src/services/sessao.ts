export interface Usuario {
  id: number
  nome: string
  email: string
}

export function salvarSessao(token: string, usuario: Usuario): void {
  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(usuario))
}

export function limparSessao(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function estaLogado(): boolean {
  return Boolean(localStorage.getItem('token'))
}
