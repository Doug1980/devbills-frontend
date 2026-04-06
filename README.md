# 💸 DevBills — Frontend

Interface web para gerenciamento de finanças pessoais, construída com **React 19**, **TypeScript** e **Tailwind CSS v4**. Conecta-se a uma API REST própria e utiliza **Firebase** para autenticação.

---

## 🖥️ Preview

![Landing Page](https://github.com/user-attachments/assets/7814da98-cf7e-43c4-b8f1-762e2a6664a8)

![Transações](https://github.com/user-attachments/assets/2afaf30f-6910-4828-b412-f65a55c2dc74)

![Nova Transação](https://github.com/user-attachments/assets/f734d418-c22e-4a2a-989e-bc74871ea461)

![Dashboard 1](https://github.com/user-attachments/assets/4d244285-607e-478b-8a82-4443bcbee8ee)

![Dashboard 2](https://github.com/user-attachments/assets/3c5b1782-722e-4880-9841-4a795419ae72)

---

## 🚀 Tecnologias

| Camada | Tecnologia |
|---|---|
| UI | React 19 + TypeScript |
| Estilo | Tailwind CSS v4 |
| Roteamento | React Router v7 |
| HTTP | Axios |
| Autenticação | Firebase v12 |
| Gráficos | Recharts |
| Exportação | jsPDF + jsPDF-AutoTable + xlsx |
| Bundler | Vite 8 |
| Linter/Formatter | Biome + ESLint |

---

## 📋 Pré-requisitos

- **Node.js** >= 18
- **Yarn** (gerenciador de pacotes)
- Uma instância da [API DevBills](https://github.com/Doug1980) rodando localmente ou em produção
- Projeto criado no [Firebase Console](https://console.firebase.google.com/)

---

## ⚙️ Instalação e configuração

### 1. Clone o repositório

```bash
git clone https://github.com/Doug1980/devbills-frontend.git
cd devbills-frontend
```

### 2. Instale as dependências

```bash
yarn install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env` com os dados do seu projeto Firebase e a URL da API:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_API_URL=http://localhost:3333
```

> **Como obter as credenciais do Firebase:** acesse o [Firebase Console](https://console.firebase.google.com/), selecione seu projeto → Configurações do Projeto → Seus apps → Configuração do SDK.

---

## ▶️ Rodando o projeto

### Desenvolvimento

```bash
yarn dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

### Build de produção

```bash
yarn build
```

### Preview do build

```bash
yarn preview
```

---

## 🗂️ Estrutura do projeto

```
src/
├── assets/         # Imagens e arquivos estáticos
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── services/       # Configuração do Axios e chamadas à API
├── contexts/       # Contextos React (auth, etc.)
├── hooks/          # Custom hooks
├── types/          # Tipos e interfaces TypeScript
└── main.tsx        # Entry point da aplicação
```

---

## ✨ Funcionalidades

- 🔐 Autenticação com Firebase (login/logout)
- 📊 Dashboard com gráficos de receitas e despesas (Recharts)
- ➕ Cadastro e listagem de transações financeiras
- 🗂️ Organização por categorias
- 📄 Exportação de relatórios em **PDF** e **Excel**
- 📱 Layout responsivo com Tailwind CSS

---

## 🔧 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `yarn dev` | Inicia o servidor de desenvolvimento |
| `yarn build` | Gera o build de produção |
| `yarn preview` | Faz preview do build gerado |
| `yarn lint` | Executa o ESLint no projeto |

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">Desenvolvido por <a href="https://github.com/Doug1980">Doug1980</a></p>
