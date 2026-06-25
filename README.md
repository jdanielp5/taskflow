# TaskFlow - Gestor completo de tarefas

**Integrantes:** Maria Eduarda e José Daniel

Aplicação acadêmica desenvolvida com Next.js App Router, TypeScript, Tailwind CSS, Firebase Authentication e Firestore. A entrega final reúne autenticação, CRUD completo, dashboard com dois gráficos, subtarefas, progresso, calendário, Kanban com drag and drop, página de detalhes, acessibilidade e deploy no Vercel.

## Funcionalidades implementadas

- Landing page responsiva com menu, footer, call to action, mockup e componentes inspirados no Aceternity UI.
- Cadastro com nome, e-mail, senha forte, confirmação de senha, React Hook Form e `zodResolver`.
- Confirmação de e-mail antes do primeiro login.
- Login por e-mail/senha, Google e GitHub usando Firebase Authentication.
- Rotas autenticadas protegidas por Proxy do Next.js e validação adicional no cliente.
- Firestore protegido por regras que isolam os dados de cada usuário.
- Dashboard com tarefas pendentes, concluídas na semana e vencidas.
- Dois gráficos em componentes Tremor-style baseados no modelo open source copy-and-paste do Tremor: barras por status e rosca por prioridade.
- CRUD completo de tarefas com título, descrição, vencimento, prioridade e status.
- Subtarefas com inclusão, remoção, conclusão e barra de progresso automática.
- Página dedicada de detalhes com edição completa e log de trabalho.
- Quadro Kanban com colunas A Fazer, Fazendo e Concluído.
- Drag and drop acessível com Dnd Kit e atualização imediata no Firestore.
- Inclusão e remoção de tarefas do Kanban a partir da lista geral.
- Calendário FullCalendar com eventos automáticos e modal de detalhes.
- Toasts com Sonner.
- Tema claro, escuro e alto contraste com Next Themes.
- VLibras obrigatório.
- Ajuste do tamanho do texto, redução de animações, sublinhado de links, foco visível e link para pular conteúdo.
- Route Handler em `/api/health` para demonstrar API no App Router.
- Exclusão completa da conta e das tarefas do usuário.

## Tecnologias

- Next.js 16 - App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Firebase Authentication e Cloud Firestore
- React Hook Form + Zod
- FullCalendar
- Dnd Kit
- Recharts em componentes Tremor-style
- Framer Motion
- Lucide React
- Next Themes
- Sonner

## Estrutura principal

```text
src/
├── app/
│   ├── api/health/route.ts
│   ├── calendar/page.tsx
│   ├── dashboard/page.tsx
│   ├── kanban/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── tasks/
│   │   ├── [id]/page.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── tremor/
│   ├── ui/aceternity/
│   ├── AccessibilityPanel.tsx
│   ├── CalendarTaskModal.tsx
│   ├── DashboardCharts.tsx
│   ├── KanbanBoard.tsx
│   ├── Navbar.tsx
│   ├── SubtaskManager.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   ├── VLibras.tsx
│   └── WorkLogSection.tsx
├── contexts/AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useTasks.ts
├── lib/
│   ├── firebase.ts
│   └── utils.ts
├── services/
│   ├── auth.service.ts
│   ├── dashboard.service.ts
│   └── task.service.ts
├── types/
│   ├── task.ts
│   └── user.ts
└── proxy.ts
```

## Modelagem resumida

```ts
type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

type WorkLog = {
  id: string;
  text: string;
  createdAt: string;
};

type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "baixa" | "media" | "alta";
  status: "a-fazer" | "fazendo" | "concluido";
  showOnKanban: boolean;
  subtasks: Subtask[];
  workLogs: WorkLog[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};
```

## Instalação local

### 1. Requisitos

- Node.js 20 ou superior.
- npm.
- Projeto criado no Firebase.

### 2. Instalar dependências

```bash
npm install
```

### 3. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com as credenciais do aplicativo Web do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

O arquivo `.env.local` está no `.gitignore` e não deve ser enviado ao GitHub.

### 4. Rodar o projeto

```bash
npm run dev
```

Abra `http://localhost:3000`.

### 5. Validar antes do commit

```bash
npm run lint
npm run typecheck
npm run build
```

Ou execute tudo de uma vez:

```bash
npm run check
```

## Configuração do Firebase Authentication

No Firebase Console, abra **Authentication > Sign-in method** e habilite:

1. E-mail/senha.
2. Google.
3. GitHub.

Para o GitHub, crie um OAuth App na conta do GitHub e informe no Firebase o Client ID e Client Secret. Use a URL de callback exibida pelo próprio Firebase.

Em **Authentication > Settings > Authorized domains**, adicione:

- `localhost` para testes locais.
- O domínio final da Vercel.

## Configuração do Firestore

1. Abra **Firestore Database**.
2. Crie o banco.
3. Abra a aba **Rules**.
4. Copie o conteúdo de `firestore.rules`.
5. Clique em **Publish**.

As regras garantem que um usuário só leia e altere tarefas cujo `userId` seja o próprio UID.

## Deploy na Vercel

1. Envie a branch final para o GitHub e faça merge na `main`.
2. Na Vercel, importe o repositório.
3. Em **Environment Variables**, cadastre todas as variáveis do `.env.local`.
4. Faça o deploy.
5. Adicione o domínio da Vercel em **Firebase Authentication > Authorized domains**.
6. Teste login social, Firestore, Kanban e calendário no endereço publicado.

## Roteiro de teste da entrega

1. Mostrar a landing page e a responsividade.
2. Abrir o painel de acessibilidade e o VLibras.
3. Criar uma conta e mostrar a validação de senha.
4. Confirmar o e-mail e realizar login.
5. Mostrar o dashboard, as três métricas e os dois gráficos.
6. Criar uma tarefa e editar seus campos.
7. Abrir os detalhes, adicionar subtarefas e mostrar a barra de progresso.
8. Adicionar um registro no log de trabalho.
9. Mover a tarefa no Kanban e confirmar a mudança de status.
10. Abrir o calendário e clicar no evento para mostrar o modal.
11. Excluir uma tarefa.
12. Mostrar os documentos no Firestore.
13. Fazer logout e tentar acessar uma rota protegida.

## Arquitetura em camadas

```text
Interface (App Router + componentes)
          ↓
Contexts e Hooks (autenticação e tempo real)
          ↓
Services (regras de negócio)
          ↓
Firebase SDK / Route Handler
          ↓
Authentication + Firestore
```

## Desafios técnicos e soluções

### Estado do Kanban

O drag and drop precisa atualizar a interface e persistir o status. O projeto usa Dnd Kit para identificar a coluna de destino e `updateTaskStatus` para salvar no Firestore. O listener `onSnapshot` sincroniza todas as telas.

### Calendário com dados em tempo real

As tarefas são transformadas em eventos somente quando possuem data de vencimento. O ID original fica em `extendedProps`, permitindo localizar a tarefa e abrir o modal correto.

### Progresso das subtarefas

A porcentagem é calculada em tempo de renderização pela quantidade concluída dividida pelo total. Assim, não existe um valor duplicado no banco que possa ficar inconsistente.

## Observações de segurança

O cookie usado pelo Proxy serve como indicação de navegação para redirecionar usuários não autenticados. A autorização real dos dados é feita pelas regras do Firestore, baseadas em `request.auth.uid`.
