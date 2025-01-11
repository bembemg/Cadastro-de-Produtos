# 📦 Sistema de Cadastro de Produtos  

## 📝 Descrição do Projeto  
Sistema web fullstack para gerenciamento de inventário de produtos. A aplicação permite que usuários realizem operações CRUD (Criar, Ler, Atualizar e Deletar) em produtos, com informações detalhadas e status de disponibilidade.  

---

## ✨ Funcionalidades  
- ➕ Adicionar novos produtos  
- 📝 Editar produtos existentes  
- 🔍 Visualizar detalhes dos produtos  
- 🗑️ Excluir produtos  
- 💰 Formatação automática de preços em BRL  
- ✅ Controle de disponibilidade  
- 🔄 Ordenação automática por preço  
- ⚡ Validações em tempo real  
- 🎨 Interface moderna e responsiva  

---

## 🛠️ Tecnologias Utilizadas  

### **Frontend**  
- React.js  
- SCSS/CSS  
- React Icons  
- Vite  

### **Backend**  
- Node.js  
- Express.js  
- PostgreSQL  
- Cors  
- Dotenv  

---

## 📦 Instalação  

### **Pré-requisitos**  
- [Node.js](https://nodejs.org/)  
- [PostgreSQL](https://www.postgresql.org/)  

### **Passos de Instalação**  

1. Clone o repositório:  
```bash
  git clone https://github.com/seu-usuario/cadastro-produtos.git
  cd cadastro-produtos
```

2. Instale as dependências:
```bash
  # No frontend
  cd frontend
  npm install
  
  # No backend
  cd ../backend
  npm install
```

  3. Configure as variáveis de ambiente:
    Crie um arquivo .env na pasta backend com as seguintes variáveis:
  ```bash
 PORT=3001
 DATABASE_URL=seu-banco-de-dados
  ```
  
  4.Inicie os servidores:
  ```bash
  # No backend
  npm start
  
  # No frontend
  cd ../frontend
  npm run dev
  ```
  5. Acessar a Aplicação
  Abra o navegador e acesse o endereço fornecido pelo terminal para começar a usar a aplicação.

  ## 🚀 Como Usar
  1. Acesse a aplicação pelo navegador.
  2. Clique em "Cadastrar Novo Produto" para adicionar um produto.
  3. Preencha os dados do produto:
  - Nome
  - Descrição
  - Preço
  - Disponibilidade
  4. Gerencie os produtos através dos botões de ação:
  - 📝 Editar
  - 🔍 Visualizar detalhes
  - 🗑️ Excluir
  ---
  ## 🔧 Funcionalidades Técnicas
  - Validação de produtos duplicados
  - Formatação automática de moeda
  - Animações suaves
  - Modal com animações
  - Mensagens de erro personalizadas
  - Scrollbar customizada
  ---
  ## 📋 Próximas Melhorias
  - Sistema de busca
  - Filtros por categoria
  - Paginação
  - Histórico de alterações
  - Modo escuro
  - Upload de imagens
  📞 Contato
  Gabriel B. - gabrielbembemc@gmail.com
  
  Link do Projeto: https://github.com/bembemg/Cadastro-de-Produtos
