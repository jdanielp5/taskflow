# Dupla: Maria Eduarda e José Daniel
# TaskFlow - Login, cadastro e CRUD de tarefas

Projeto em Next.js com TypeScript, Tailwind CSS, Firebase Authentication e Firestore.

## O que foi implementado nesta versão

- Landing page responsiva
- Cadastro com nome, e-mail, senha e confirmar senha
- Validação com React Hook Form e zodResolver
- Criação de conta no Firebase Authentication
- Envio de confirmação de e-mail
- Login com e-mail e senha
- Login com Google
- Login com GitHub
- Dashboard protegido para usuário autenticado
- Menu completo após login
- Lista de tarefas protegida por login
- Cadastro de tarefas no Firestore
- Edição de tarefas no Firestore
- Exclusão de tarefas no Firestore
- Métricas do dashboard usando tarefas reais
- Exclusão de conta do usuário autenticado
- Exclusão das tarefas do usuário ao excluir a conta
- Estrutura modular seguindo a sugestão do trabalho

## Escopo propositalmente deixado para próxima etapa

- Kanban com drag and drop
- Calendário com FullCalendar
- Subtarefas e barra de progresso
- Página dedicada de detalhes da tarefa
- Dashboard com biblioteca Tremor
- VLibras e recursos completos de acessibilidade

## Tecnologias

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
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
2. Crie ou abra o projeto usado no `.env.local`.
3. Em Authentication > Sign-in method, habilite Email/Password.
4. Habilite Google, se for usar login com Gmail.
5. Habilite GitHub, se for usar login com GitHub.
6. Em Firestore Database, crie o banco de dados.
7. Use regras permitindo que cada usuário acesse apenas as próprias tarefas.

Exemplo de regra para desenvolvimento/entrega acadêmica:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

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

## O que testar para mostrar no vídeo ou na entrega

1. Abrir a landing page.
2. Criar uma conta.
3. Confirmar o e-mail.
4. Fazer login.
5. Abrir o dashboard protegido.
6. Abrir a página Tarefas.
7. Cadastrar uma tarefa.
8. Editar a tarefa.
9. Excluir a tarefa.
10. Mostrar que os dados aparecem no Firestore.
11. Fazer logout.
12. Tentar acessar `/tasks` sem login e ver que redireciona para `/login`.

## Estrutura principal

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
