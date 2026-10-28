# Sistema de Locação de Veículos

Projeto da disciplina Programação com Frameworks Web.

## Integrantes

- João Emanuel C O do Nascimento

## Tecnologias

- Backend: Node.js, Express, TypeScript, Prisma, MySQL, JWT (jsonwebtoken) e bcryptjs
- Frontend: React, TypeScript, Vite, React Router e Axios

## Funcionalidades

- Cadastro e login de usuários com autenticação JWT
- Cadastro e consulta de veículos
- Registro de locações e devoluções, com cálculo do valor total

## Pré-requisitos

- Node.js 20.19 ou superior
- MySQL 8 em execução

## Como executar

### 1. Banco de dados

Crie um banco chamado locadora no MySQL:

    CREATE DATABASE locadora;

### 2. Backend

    cd backend
    npm install
    cp .env.example .env

Edite o arquivo `.env` com os dados do seu MySQL e uma chave para o JWT:

    PORT=3333
    JWT_SECRET="defina-uma-chave"
    DATABASE_URL="mysql://usuario:senha@localhost:3306/locadora"

Em seguida, gere o client do Prisma, aplique as migrações e inicie o servidor:

    npx prisma generate
    npx prisma migrate deploy
    npm run dev

A API fica disponível em http://localhost:3333.

### 3. Frontend

Em outro terminal:

    cd frontend
    npm install
    npm run dev

A aplicação fica disponível em http://localhost:5173. O frontend espera a API em http://localhost:3333, endereço definido em `frontend/src/services/api.ts`.

## Rotas da API

As rotas marcadas como autenticadas exigem o cabeçalho `Authorization: Bearer <token>`, com o token devolvido no login.

| Método | Rota | Descrição | Autenticada |
|---|---|---|---|
| GET | /saude | Verifica se a API está no ar | Não |
| POST | /auth/registro | Cadastra um usuário | Não |
| POST | /auth/login | Autentica e devolve o token JWT | Não |
| POST | /veiculos | Cadastra um veículo | Sim |
| GET | /veiculos | Lista os veículos, com filtro opcional ?status=DISPONIVEL ou ?status=ALUGADO | Sim |
| GET | /veiculos/:id | Consulta um veículo | Sim |
| POST | /locacoes | Registra uma locação | Sim |
| GET | /locacoes | Lista as locações do usuário logado | Sim |
| PATCH | /locacoes/:id/devolucao | Registra a devolução e calcula o total | Sim |

## Regras de negócio

- Só é possível alugar um veículo com status DISPONIVEL. Ao alugar, ele passa para ALUGADO, e a devolução o libera novamente.
- A data prevista de devolução deve ser futura.
- O valor total é o número de diárias, arredondado para cima e com mínimo de 1, multiplicado pelo valor da diária.
- Apenas o usuário que alugou o veículo pode registrar a devolução, e uma locação não pode ser devolvida duas vezes.

## Estrutura do projeto

    locadora/
      backend/
        prisma/
        src/
          controllers/
          lib/
          middlewares/
          routes/
      frontend/
        src/
          components/
          pages/
          services/
