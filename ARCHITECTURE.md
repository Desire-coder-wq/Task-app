# TaskPilot - Architecture & Codebase Overview

## Project Overview

TaskPilot is a full-stack team collaboration platform for task and project management. Built as a monorepo with separate frontend and backend packages, it supports user authentication, team management, task assignment, invitation workflows, and email notifications.

---

## Tech Stack

### Frontend
| Category | Technology |
|----------|-----------|
| Framework | **Next.js 16** (App Router) |
| UI Library | **React 19** |
| State Management | **React Query (TanStack)** + **Zustand** |
| Styling | **Tailwind CSS** + `clsx` + `tailwind-merge` |
| Forms | **React Hook Form** + **Zod** (schema validation) |
| HTTP Client | **Axios** (with auth interceptors) |
| Icons | **lucide-react** |
| Notifications | **react-hot-toast** |
| Testing | **Vitest** + React Testing Library |
| Deployment | **Render** |

### Backend
| Category | Technology |
|----------|-----------|
| Framework | **NestJS 11** (Node.js 20) |
| ORM | **Prisma 7** |
| Database | **PostgreSQL** (Neon DB) |
| Auth | **JWT** (7-day expiry) + **Passport.js** |
| Password Hashing | **bcrypt** |
| Email | **Resend HTTP API** (Node `https` module) |
| API Docs | **Swagger/OpenAPI** |
| Testing | **Jest** (unit + e2e with supertest) |
| Deployment | **Render** |

---

## Directory Structure

```
task-flow/
├── task-flow-backend/          # NestJS backend
│   ├── src/
│   │   ├── app.module.ts       # Root module
│   │   ├── main.ts             # Bootstrap (CORS, guards, interceptors, Swagger)
│   │   ├── prisma/             # Prisma service + module
│   │   ├── modules/
│   │   │   ├── auth/           # JWT auth, register, login, OTP password reset
│   │   │   ├── tasks/          # CRUD tasks, status updates
│   │   │   ├── teams/          # Team CRUD, membership, roles
│   │   │   ├── invitations/    # Team invitation flow (token-based)
│   │   │   ├── mail/           # Email service (Resend HTTP API)
│   │   │   ├── dashboard/      # Dashboard statistics endpoints
│   │   │   └── users/          # User management
│   │   └── common/             # Filters, interceptors, DTOs
│   ├── prisma/
│   │   ├── schema.prisma       # Data model
│   │   └── seed.ts             # Database seed (4 users, 5 tasks)
│   └── render.yaml             # Render deployment config
├── task-flow-frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/                # Next.js 16 App Router (pages/)
│   │   ├── components/         # Shared React components
│   │   ├── hooks/              # Custom hooks (useTasks, useUsers, useInvitations)
│   │   ├── services/           # API service classes (axios instances)
│   │   ├── store/              # Zustand stores (TaskStore)
│   │   ├── contexts/           # React contexts (TeamContext)
│   │   ├── lib/                # Shared utilities (axios config)
│   │   └── types/              # TypeScript interfaces
│   └── render.yaml             # Render deployment config
├── .github/workflows/
│   └── ci-cd.yml               # GitHub Actions pipeline
└── README.md
```

---

## Architecture Patterns

### Backend (NestJS)

**Module-based architecture** — Each feature is a self-contained NestJS module (Auth, Tasks, Teams, Invitations, Mail, Dashboard, Users) with its own controller, service, and DTOs. Modules import shared dependencies (PrismaModule, ConfigModule, MailModule) via dependency injection.

**Key patterns:**
- **Global prefix**: All routes are prefixed with `/api`
- **Global pipes**: `ValidationPipe` with `whitelist` and `transform` for DTO validation
- **Global filters**: `HttpExceptionFilter` for consistent error responses
- **Global interceptors**: `TransformInterceptor` wraps all responses in `{ success, data, message, statusCode, timestamp }`
- **Authentication**: JWT strategy via Passport.js — `@UseGuards(AuthGuard('jwt'))` on protected routes
- **Authorization**: `req.user.id` extracted from JWT payload, passed to services for data isolation

**Flow for a typical API call:**
```
Client Request → JWT Middleware → AuthGuard → Controller → Service → Prisma → Database
               ← TransformInterceptor ← ApiResponse ← Service ← Prisma
```

### Frontend (Next.js)

**App Router architecture** — Pages use the Next.js 16 App Router with client components (`'use client'`). State is managed via:
- **React Query**: Server state (API data fetching, caching, mutations)
- **Zustand**: Client state (modal state, selected task)
- **Context (TeamContext)**: Cross-component team state (current team, team list)

**Axios layer pattern** — Two axios configurations exist:
1. **`@/lib/axios`**: Shared instance with auth interceptor (adds JWT from localStorage) and 401 redirect interceptor
2. **Service-specific instances** (`TaskService`, `InvitationService`, `AuthApiService`): Each creates its own axios instance with auth interceptor — provides isolation and service-specific error handling

**Data flow pattern:**
```
React Component → Custom Hook (useTasks) → Service Class (taskService) → Axios → Backend API
               ← React Query Response ← Service Returns Data ← Axios Response
               ← Toast Notifications ← Mutation Callbacks
```

---

## Key Code Explanations

### 1. Authentication Flow (`auth.service.ts:27`)
```typescript
async register(registerDto: RegisterDto) {
  // 1. Check for duplicate email
  // 2. Hash password with bcrypt (10 rounds)
  // 3. Create user in Prisma
  // 4. Auto-create personal team (Team + TeamMember)
  // 5. Generate JWT token (7-day expiry)
  // 6. Return user + token
}
```
**Key insight**: Registration automatically creates a personal team, so new users can immediately invite members. The JWT token is stored in localStorage and sent via Axios interceptor on every request.

### 2. JWT Strategy (`jwt.strategy.ts`)
```typescript
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
}
```
JWT is extracted from the `Authorization` header. The `req.user` object (containing `sub` and `email`) is available in all guarded controllers via `@Req() req`.

### 3. Data Isolation (`tasks.controller.ts:30`)
```typescript
async findAll(@Query() filters: TaskFiltersDto, @Req() req: any) {
  const userId = req.user?.id;
  return this.tasksService.findAll(filters, userId);
}
```
Every task query is scoped to the authenticated user — tasks are filtered by the user's team membership, ensuring data isolation between teams.

### 4. Invitation Flow (`invitations.service.ts:18`)
```typescript
async createInvitation(invitedById: string, dto: CreateInvitationDto) {
  // 1. Check if user already exists (reject if so)
  // 2. Check for existing pending invitation (reject if so)
  // 3. Generate crypto token (32 bytes hex)
  // 4. Set 48-hour expiry
  // 5. Create invitation with teamId
  // 6. Send email via Resend HTTP API with acceptUrl
  // 7. Return invitation + acceptUrl
}
```
**Key insight**: The `acceptUrl` uses `process.env.FRONTEND_URL` to construct the link. The invitation token is a 32-byte hex string used in the URL query parameter.

### 5. Email Service (`mail.service.ts`)
Uses the **Resend HTTP API** (`https://api.resend.com/email`) directly via Node's `https` module with the Resend API key as a Bearer token. This was switched from SMTP because Render blocks outbound SMTP connections on ports 25/465/587.

```typescript
private async sendViaResend(to: string, subject: string, html: string) {
  // POST to https://api.resend.com/email
  // Headers: Authorization: Bearer <API_KEY>
  // Body: { from: "TaskPilot <onboarding@resend.dev>", to, subject, html }
}
```

### 6. Task State Management (`store/TaskStore.ts`)
Using **Zustand** for modal state:
```typescript
isModalOpen: modalMode: 'create' | 'edit' | 'delete'
selectedTask: Task | null
```
This keeps modal state global so any component can open/close the task modal without prop drilling.

### 7. Frontend API Services
Each service (`TaskService`, `InvitationService`, `AuthApiService`) creates its own Axios instance with:
- Base URL from `NEXT_PUBLIC_API_URL` (defaults to Render backend)
- Auth interceptor that adds JWT from localStorage
- Response interceptor that redirects to `/login` on 401

### 8. CI/CD Pipeline (`ci-cd.yml`)
Multi-stage pipeline:
1. **test-backend**: Lint → Unit tests with coverage → Build
2. **test-frontend**: Lint → Unit tests with coverage → Build
3. **test-e2e**: Backend e2e tests (register, login)
4. **deploy-backend**: Build → Deploy to Render
5. **deploy-frontend**: Build → Deploy to Render (only after backend is deployed)

---

## Interview Talking Points

### Architecture & Design Decisions
1. **"I architected this as a monorepo with separate Next.js frontend and NestJS backend, each deployable independently on Render."**

2. **"I chose NestJS for the backend because its module-based architecture and dependency injection pattern make the code highly organized and testable. Each feature—auth, tasks, teams, invitations—is a self-contained module."**

3. **"For the frontend, I used Next.js 16 App Router with React Query for server state management and Zustand for client-side state like modal visibility. This separation of concerns keeps the data-fetching logic clean."**

4. **"I implemented data isolation at the controller level—every task query is scoped to the authenticated user's team, ensuring users can only see their own tasks."**

### Problem-Solving & Debugging
5. **"During development, I encountered a critical issue where emails weren't being sent on Render. The root cause was that Render blocks outbound SMTP connections on ports 25/465/587. I diagnosed this by adding a config debug endpoint, then switched the email service to use the Resend HTTP API directly via Node's `https` module—inheriting the same Resend API key."**

6. **"Another issue was database schema drift on Render—when I added the `isActive` column to the User model, the Render database wasn't migrated. I added `prisma db push` to both the build and startup commands to ensure the schema is always synced."**

7. **"I also discovered that the `${SMTP_PASS}` reference in Render's `render.yaml` was resolving to the literal string `${SMTP_PASS}` instead of the actual secret value. I removed it from the yaml and relied on the Render dashboard secret directly."**

### Technical Patterns
8. **"I used NestJS global pipes and interceptors to enforce consistent request validation and response formatting across all endpoints. The `ValidationPipe` with `whitelist` and `transform` automatically validates and strips unknown properties from incoming DTOs."**

9. **"For authentication, I implemented JWT with Passport.js. The JWT strategy extracts the token from the Authorization header, verifies it against the secret, and attaches the user payload to the request object."**

10. **"On the frontend, I used Zod schemas with React Hook Form for type-safe form validation—the password requirements checklist on the register page is driven entirely by the Zod schema rules."**

11. **"I implemented an invitation-based team onboarding flow: users register, auto-create a personal team, then invite members via tokenized email links. The invitation system uses crypto-generated tokens with 48-hour expiry."**

12. **"For testing, I have Jest unit tests for the backend services and Vitest tests for the frontend components, plus e2e tests that test the full auth flow against a real backend."**

13. **"The CI/CD pipeline in GitHub Actions runs tests on every push, deploys to Render on merge to main, and the frontend deployment depends on the backend being ready first."**

### Scaling & Future Improvements
14. **"If I were scaling this further, I'd extract the invitation token validation into a dedicated endpoint, add Redis for the OTP store (currently in-memory), and set up a custom verified domain with Resend for better email deliverability instead of using the default `onboarding@resend.dev` address."**

15. **"The current email system uses the Resend HTTP API with a hardcoded API key in the `.env` file. For production at scale, I'd move this to a secrets manager and use environment-specific keys."**

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register user + auto-create team |
| POST | `/login` | Login + JWT token |
| POST | `/forgot-password` | Send OTP email |
| POST | `/verify-otp` | Verify OTP |
| POST | `/reset-password` | Reset password with OTP |
| POST | `/logout` | Logout |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List tasks (filtered by team) |
| POST | `/` | Create task |
| GET | `/:id` | Get task by ID |
| PATCH | `/:id` | Update task |
| PATCH | `/:id/status` | Update status |
| DELETE | `/:id` | Delete task |

### Teams (`/api/teams`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's teams |
| POST | `/` | Create team |
| GET | `/:id` | Get team details |
| GET | `/:id/members` | Get team members |
| PATCH | `/:id` | Update team |
| DELETE | `/:id` | Delete team |

### Invitations (`/api/invitations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get invitations |
| POST | `/` | Send invitation |
| POST | `/accept` | Accept invitation |
| POST | `/:id/resend` | Resend invitation |
| DELETE | `/:id` | Cancel invitation |

### Mail (`/api/mail`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/config` | Debug: check SMTP config |
| POST | `/test` | Send test email |

---

## Data Model (Prisma Schema)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  name          String
  avatar        String?
  role          String   @default("USER")
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  assignedTasks  Task[]        @relation("AssignedTasks")
  createdTasks   Task[]        @relation("CreatedTasks")
  sentInvites    Invitation[]  @relation("SentInvites")
  receivedInvite Invitation?   @relation("ReceivedInvite")
  createdTeams   Team[]        @relation("TeamsCreated")
  teamMemberships TeamMember[]
}

model Team {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  createdBy   User         @relation("TeamsCreated", fields: [createdById], references: [id])
  members     TeamMember[]
  tasks       Task[]
  invitations Invitation[]
}

model TeamMember {
  id       String   @id @default(cuid())
  teamId   String
  userId   String
  role     String   @default("MEMBER")
  joinedAt DateTime @default(now())

  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([teamId, userId])
}

model Task {
  id              String   @id @default(cuid())
  title           String
  description     String
  status          String   @default("TODO")
  priority        String   @default("MEDIUM")
  dueDate         DateTime
  assignedUserId  String
  createdById     String
  teamId          String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  assignedUser User  @relation("AssignedTasks", fields: [assignedUserId], references: [id])
  createdBy    User  @relation("CreatedTasks", fields: [createdById], references: [id])
  team         Team? @relation(fields: [teamId], references: [id])
}

model Invitation {
  id             String   @id @default(cuid())
  email          String
  token          String   @unique
  status         String   @default("PENDING")
  expiresAt      DateTime
  teamId         String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  invitedById    String
  invitedBy      User       @relation("SentInvites", fields: [invitedById], references: [id])
  invitedUserId  String?    @unique
  invitedUser    User?      @relation("ReceivedInvite", fields: [invitedUserId], references: [id])
  team           Team?      @relation(fields: [teamId], references: [id])
}
```

---

## Key Lessons Learned

1. **Render blocks outbound SMTP** — Cloud platforms often restrict SMTP ports. Using HTTP-based email APIs (like Resend's HTTP API) avoids this issue entirely.

2. **`render.yaml` env var references** — The `${VAR_NAME}` syntax in Render's `render.yaml` can resolve to literal strings if the secret doesn't exist. When in doubt, set secrets directly in the Render dashboard.

3. **Database schema sync on deploy** — For apps with frequent schema changes, adding `prisma db push` to the startup command ensures the database schema is always in sync with the Prisma schema.

4. **Frontend-backend contract alignment** — When the backend creates teams during registration, the frontend needs to be aware of this to fetch teams correctly. The `TeamContext` handles this with auto-loading.

5. **Invitation flow edge cases** — The `createInvitation` method checks for existing pending invitations and rejects duplicates. The frontend needs to handle this 400 error and show an appropriate message.
