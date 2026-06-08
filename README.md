# Dupla: Maria Eduarda e José Daniel
# TaskFlow - Entrega parcial 1

Projeto em Next.js com TypeScript, Tailwind CSS e Firebase Authentication para a entrega parcial do sistema TaskFlow.

## O que foi implementado

- Landing page responsiva
- Cadastro com nome, e-mail, senha e confirmar senha
- Validação com React Hook Form e zodResolver
- Criação de conta no Firebase Authentication
- Envio de confirmação de e-mail
- Login com e-mail e senha
- Login com Google
- Login com GitHub
- Dashboard protegido
- Menu completo após login
- Botões das próximas telas clicáveis com aviso
- Exclusão de conta do usuário autenticado
- Estrutura modular seguindo a sugestão do trabalho

## Tecnologias

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore configurado para as próximas etapas
- React Hook Form
- Zod
- Sonner
- Lucide React
- Next Themes

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` na raiz do projeto usando o `.env.example` como modelo:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

Rode o projeto:

```bash
npm run dev
```

Abra no navegador:

```bash
http://localhost:3000
```

## Configuração do Firebase

1. Acesse o Firebase Console.
2. Crie um projeto.
3. Adicione um app Web.
4. Copie as configurações do Firebase para o `.env.local`.
5. Acesse Authentication.
6. Em Sign-in method, habilite Email/Password.
7. Habilite Google.
8. Habilite GitHub.
9. No GitHub, crie um OAuth App e use a URL de callback informada pelo Firebase.
10. Cole o Client ID e o Client Secret do GitHub no provedor GitHub do Firebase.

## Deploy no Vercel

1. Suba o projeto para o GitHub.
2. Acesse o Vercel.
3. Clique em Add New Project.
4. Importe o repositório.
5. Em Environment Variables, adicione as mesmas variáveis do `.env.local`.
6. Faça o deploy.
7. Copie o link gerado pelo Vercel.
8. No Firebase Authentication, adicione o domínio do Vercel em Authorized domains.
9. Faça um novo deploy se alterar variáveis de ambiente.

## Estrutura

```txt
src/
├── app/
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── tasks/
│   ├── kanban/
│   └── calendar/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   ├── DashboardCharts.tsx
│   └── KanbanBoard.tsx
├── services/
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── dashboard.service.ts
├── lib/
│   └── firebase.ts
├── hooks/
│   ├── useAuth.ts
│   └── useTasks.ts
├── types/
│   ├── task.ts
│   └── user.ts
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
└── middleware.ts
```
