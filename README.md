<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/logo.svg">
  <img alt="Controle Fácil" src="/logo.svg" width="120" height="auto">
</picture>

# Controle Fácil

> Gerenciamento financeiro pessoal — um livro-razão orquestrado para o seu dinheiro.

O Controle Fácil é um sistema operacional financeiro full-stack que ajuda você a acompanhar contas, transações, orçamentos, contas recorrentes e metas financeiras. Construído com uma estética **editorial premium** (o "Livro-Razão Orquestrado"), ele rejeita dashboards poluídos em favor de assimetria intencional, camadas tonais e tipografia refinada.

## Funcionalidades

- **Dashboard** — saldo total, valor disponível, progresso de economia, gráfico de receitas vs. despesas (6 meses), contas futuras, transações recentes
- **Contas** — conta corrente, poupança, cartão de crédito, investimentos, dinheiro físico e outras, com arquivamento
- **Transações** — receitas, despesas e transferências com categorias, status pendente/conciliado/cancelado e vínculo entre transferências
- **Categorias** — hierarquia de categorias pai/filho com valores padrão (Moradia, Alimentação, Transporte, Saúde, etc.) e categorias personalizadas
- **Orçamentos** — limites mensais por categoria com progresso em tempo real e indicadores de segurança/perigo/estouro
- **Metas** — valores alvo com prazos, datas estimadas de conclusão e rastreamento de contribuições
- **Contas Recorrentes** — assinaturas e pagamentos recorrentes com frequência (diária a anual), controle de dia de vencimento e gerenciamento de ocorrências
- **Notificações** — alertas no aplicativo para vencimentos, limites de orçamento e marcos de metas
- **Guia de Estilos** — documentação viva do sistema de design com 13 subpáginas exibindo todos os componentes

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework** | React 19 + React Router 7.14 (SSR full-stack) |
| **Linguagem** | TypeScript 5.9 (strict) |
| **Build** | Vite 8 |
| **Estilização** | Tailwind CSS 4.2 + metodologia CUBE CSS |
| **Banco de Dados** | Turso (banco edge compatível com SQLite via libSQL) |
| **ORM** | Drizzle ORM 0.45 + Drizzle Kit 0.31 |
| **Validação** | Zod 4.4 + Conform-to 1.19 |
| **Ícones** | Lucide React |
| **Autenticação** | bcryptjs + cookies de sessão |
| **Testes** | Vitest 4.1 |
| **Linting** | Biome 2.4 |
| **Container** | Docker (multi-stage Node 20 Alpine) |

## Começando

### Pré-requisitos

- Node.js 20+
- pnpm
- Um banco de dados [Turso](https://turso.tech) (ou SQLite local)

### Configuração

```bash
# Instalar dependências
pnpm install

# Configurar ambiente
cp .env.example .env
```

Edite o `.env` com suas credenciais do Turso:

```env
TURSO_CONNECTION_URL=libsql://seu-db.turso.io
TURSO_AUTH_TOKEN=seu-token-de-autenticacao
```

### Banco de Dados

```bash
# Gerar migrations
pnpm db:generate

# Aplicar migrations
pnpm db:migrate

# (Opcional) Semear categorias padrão
pnpm db:seed

# (Opcional) Abrir Drizzle Studio para navegar nos dados
pnpm db:studio
```

```bash
# Iniciar servidor de desenvolvimento (HMR em http://localhost:5173)
pnpm dev

# Verificar tipos
pnpm typecheck

# Executar testes
pnpm test

# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start
```

## Estrutura do Projeto

```
app/
├── lib/db/          # Cliente do banco, schema, seed
├── routes/          # Componentes de rota baseados em arquivos
├── features/        # Módulos de funcionalidade orientados a domínio
│   ├── auth/        # Autenticação (login, cadastro, sessão)
│   ├── transactions/# Contas e transações (CRUD, transferências)
│   ├── categories/  # Gerenciamento de categorias
│   ├── budget/      # Orçamentos mensais
│   ├── goals/       # Metas financeiras
│   ├── dashboard/   # Dados e componentes do dashboard
│   ├── recurrences/ # Contas recorrentes e assinaturas
│   └── notification/# Notificações no aplicativo
├── ui/              # Componentes de UI reutilizáveis
│   ├── form/        # Input, Select, CurrencyInput, etc.
│   ├── card/        # Sistema de cards
│   ├── chart/       # Sistema de gráficos SVG
│   ├── nav/         # Navegação lateral
│   ├── table/       # Sistema de tabelas
│   └── panel/       # Componente de painel
├── css/             # Arquitetura CUBE CSS
│   ├── global/      # Reset, tokens, variáveis, estilos base
│   ├── compositions/# Padrões de layout (cluster, grid, flow, etc.)
│   ├── blocks/      # Estilos específicos de componentes
│   └── utilities/   # Classes utilitárias
└── tests/           # Fábricas de teste e repositórios em memória
```

Cada funcionalidade segue o padrão de **arquitetura limpa**:

```
features/{funcionalidade}/
├── core/          # Tipos de domínio e value objects
├── application/   # Casos de uso e interfaces (ports)
├── services/      # Infraestrutura (repositórios Drizzle)
├── http/          # Loaders e actions da API
└── presentation/  # Componentes React
```

## Scripts

| Script | Finalidade |
|---|---|
| `pnpm dev` | Iniciar servidor de desenvolvimento com HMR |
| `pnpm build` | Criar build de produção |
| `pnpm start` | Executar servidor de produção |
| `pnpm typecheck` | Verificar tipos TypeScript |
| `pnpm test` | Executar testes |
| `pnpm db:generate` | Gerar migrations do Drizzle |
| `pnpm db:migrate` | Aplicar migrations no banco |
| `pnpm db:studio` | Abrir Drizzle Studio |
| `pnpm db:seed` | Semear categorias padrão |

## Deploy

### Docker

```bash
docker build -t controle-facil .
docker run -p 3000:3000 --env-file .env controle-facil
```

A imagem Docker usa uma build multi-stage Node 20 Alpine e serve o aplicativo via `react-router-serve` na porta 3000.
