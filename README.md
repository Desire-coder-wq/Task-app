TaskPilot - Full Stack Task Management Application
      Overview
TaskPilot is a comprehensive task management dashboard built with modern web technologies. It allows teams to collaborate efficiently by managing tasks, tracking progress, and organizing work through a intuitive interface.

Live Demo: https://task-flow-frontend-0t16.onrender.com/
API Documentation: https://taskflow-backend-yh8o.onrender.com/api/docs

   Features
Core Features
User Authentication - Register, login, and JWT-based authentication

Task Management - Create, read, update, and delete tasks

Team Collaboration - Create teams and invite members

Role-Based Access - Assign roles (OWNER, ADMIN, MEMBER) to team members

Task Status Tracking - TODO, IN_PROGRESS, COMPLETED

Priority Levels - LOW, MEDIUM, HIGH

Search & Filter - Search tasks by title, filter by status and priority

Responsive Design - Works on desktop, tablet, and mobile devices

Bonus Features
 JWT Authentication - Secure API access

 Email Invitations - Send team invitations via email


Dashboard Analytics - Visual task statistics and distribution

 Custom Roles - Create custom team roles

        Tech Stack
Frontend
Technology	Description
Next.js 14	React framework with App Router
TypeScript	Type-safe JavaScript
Tailwind CSS	Utility-first CSS framework
React Query	Data fetching and caching
Zustand	State management
React Hook Form	Form handling with Zod validation
Lucide React	Icon library


      Backend
Technology	Description
NestJS	Progressive Node.js framework
Prisma ORM	Database ORM with type safety
PostgreSQL	Relational database (Neon)
JWT	Authentication and authorization
Swagger	API documentation
Nodemailer	Email sending (SendGrid/Brevo)

      DevOps
Technology	Description
Render	Hosting platform
GitHub Actions	CI/CD pipeline
Codecov	Test coverage tracking
Neon	PostgreSQL database hosting
 
           Getting Started
Prerequisites
Node.js 20.0

PostgreSQL database (Neon )

Git

Installation
Clone the repository

bash
git clone https://github.com/Desire-coder-wq/Task-app.git
cd Task-app
Install Backend Dependencies

bash
cd task-flow-backend
npm install --legacy-peer-deps
Setup Backend Environment Variables

bash
cp .env.example .env
Edit .env with your configuration:

env
DATABASE_URL="postgresql://user:password@host/database"
JWT_SECRET="your-secret-key"
PORT=3002
FRONTEND_URL="http://localhost:3000"

    Email Configuration (Resend)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS="your-resend-api-key"
SMTP_FROM="your-email@example.com"
SMTP_FROM_NAME="TaskPilot"
Run Database Migrations

bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
Install Frontend Dependencies

bash
cd ../task-flow-frontend
npm install
Setup Frontend Environment Variables

bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3002/api" > .env.local
Start Development Servers

Backend:

bash
cd task-flow-backend
npm run start:dev
Frontend:

bash
cd task-flow-frontend
npm run dev
Access the Application

Frontend: http://localhost:3000

Backend API: http://localhost:3002/api

Swagger Docs: http://localhost:3002/api/docs

      Testing
Backend Tests
bash
cd task-flow-backend
npm run test           Run unit tests
npm run test:cov      Run tests with coverage
Frontend Tests
bash
cd task-flow-frontend
npm run test          Run unit tests
npm run test:cov       Run tests with coverage
  Deployment
Backend (Render)
The backend is automatically deployed via GitHub Actions when changes are pushed to the main branch.

Manual Deployment:

bash
cd task-flow-backend
npm run build
npm run start:prod
Frontend (Render)
The frontend is automatically deployed via GitHub Actions.

Manual Deployment:

bash
cd task-flow-frontend
npm run build
npm run start
       API Documentation
Once the backend is running, access Swagger documentation at:

text
http://localhost:3002/api/docs
Key Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
POST	/api/auth/forgot-password	Request password reset
POST	/api/auth/reset-password	Reset password
Tasks
Method	Endpoint	Description
GET	/api/tasks	Get all tasks
POST	/api/tasks	Create task
GET	/api/tasks/:id	Get task by ID
PATCH	/api/tasks/:id	Update task
DELETE	/api/tasks/:id	Delete task
PATCH	/api/tasks/:id/status	Update task status
Teams
Method	Endpoint	Description
GET	/api/teams	Get user's teams
POST	/api/teams	Create team
GET	/api/teams/:id	Get team details
DELETE	/api/teams/:id	Delete team




All open-source contributors

   Links
Frontend: https://task-flow-frontend-0t16.onrender.com/

Backend API: https://taskflow-backend-yh8o.onrender.com/api

Swagger Docs: https://taskflow-backend-yh8o.onrender.com/api/docs

GitHub: https://github.com/Desire-coder-wq/Task-app

 

Built with   using Next.js, NestJS, and TypeScript

