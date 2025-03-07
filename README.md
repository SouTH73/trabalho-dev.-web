# Sistema de Registro de Atividades

Bem-vindo ao sistema de registro de atividades acadêmicas!  Este projeto permite cadastrar e acompanhar atividades de ensino, pesquisa e extensão, utilizando o Firebase para armazenamento de dados.

# - Tecnologias Utilizadas

- HTML, CSS e JavaScript

- Firebase (Firestore)

- Google Fonts (Poppins)

- Vercel (Hosting)

## - O que você precisa antes de começar?

- Para rodar o sistema, certifique-se de ter instalado:

[Node.js](https://nodejs.org/)

[Firebase CLI](https://firebase.google.com/docs/cli) (Instale com `npm install -g firebase-tools`)

## Como Rodar o Sistema Localmente

1. Baixe o projeto

   Se recebeu um arquivo `.zip`, extraia os arquivos em uma pasta.

   - Se estiver em um repositório Git, use:
     
     git clone https://github.com/seu-repositorio.git
     cd nome-do-projeto
     

2. Instale as dependências (se houver)

   
   npm install
  

3. Inicie o sistema

   Se for apenas HTML, CSS e JavaScript, basta abrir o `index.html` no navegador.

   - Para rodar um servidor local:
     
     npm install -g live-server
     live-server
   
   - Se estiver usando Firebase:
     
     firebase login
     firebase init
     firebase serve
     
   - O sistema estará disponível no navegador em `http://localhost:5000`.

## Como Usar o Sistema

1. Acesse o sistema pelo navegador (`http://localhost:5000`).
2. Registre uma atividade preenchendo o formulário e clicando em "Registrar Atividade".
3. Visualize as atividades cadastradas no resumo.
4. Exclua atividades clicando no botão "Excluir" ao lado de cada uma.
5. Limpe os dados da tela clicando em "Limpar Dados" (não remove do banco de dados).

## Como Acessar o Banco de Dados Firebase

Se precisar visualizar os registros diretamente no banco de dados:

1. Acesse o console do Firebase: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Faça login com sua conta.
3. Selecione o projeto correspondente.
4. No menu lateral, clique em **Firestore Database** para visualizar e gerenciar os dados.

