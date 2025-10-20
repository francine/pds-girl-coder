# International Job Search Management System

A comprehensive web application to organize your international job search process with LinkedIn content management, job pipeline tracking, recruiter discovery, and interview scheduling.

## Features

- **LinkedIn Content Management** (P1 - MVP)
  - AI-powered post generation with Claude
  - Content scheduling and auto-publishing
  - Kanban board for content organization
  - Weekly posting goals (5 posts/week)
  - SSI score tracking

- **Job Application Pipeline** (P2)
  - 7-stage kanban for opportunity tracking
  - Stage history and notes
  - Company and position details

- **Recruiter Discovery** (P2)
  - Search LATAM recruiters
  - AI-generated connection messages
  - Weekly connection limit tracking

- **Calendar Management** (P3)
  - Manual appointment creation
  - iCalendar integration
  - Notification system

- **Dashboard** (P4)
  - Aggregated metrics
  - Weekly progress tracking
  - Upcoming events overview

## Tech Stack

- **Backend**: Node.js 22 + Express + TypeScript + MongoDB
- **Frontend**: React 18 + Vite + Ant Design + TypeScript
- **AI**: Anthropic Claude API
- **Scheduling**: Agenda (MongoDB-native job queue)
- **Authentication**: JWT tokens

## Prerequisites

- Node.js 22 LTS
- MongoDB 7.x
- npm or yarn

## Getting Started

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories and fill in your values:

**Backend `.env`**:
```env
MONGODB_URI=mongodb://localhost:27017/jobsearch
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=your-claude-api-key
```

**Frontend `.env`**:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 4. Run Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

- Backend API: http://localhost:3000
- Frontend UI: http://localhost:5173

## Project Structure

```
.
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── services/     # Business logic
│   │   ├── api/          # REST endpoints
│   │   ├── middleware/   # Express middleware
│   │   ├── integrations/ # External services
│   │   ├── jobs/         # Scheduled tasks
│   │   └── config/       # Configuration
│   └── package.json
│
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main views
│   │   ├── services/     # API clients
│   │   ├── hooks/        # Custom React hooks
│   │   └── context/      # React context
│   └── package.json
│
└── specs/                # Feature specifications
    └── 001-crie-um-sistema/
        ├── spec.md       # Feature specification
        ├── plan.md       # Implementation plan
        ├── tasks.md      # Task breakdown
        ├── data-model.md # Database schema
        └── contracts/    # API contracts
```

## Development

### Backend Commands

```bash
npm run dev        # Start dev server with hot reload
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Lint code
npm run type-check # TypeScript validation
```

### Frontend Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
```

## Documentation

- [Feature Specification](specs/001-crie-um-sistema/spec.md)
- [Implementation Plan](specs/001-crie-um-sistema/plan.md)
- [Task Breakdown](specs/001-crie-um-sistema/tasks.md)
- [Data Model](specs/001-crie-um-sistema/data-model.md)
- [API Contracts](specs/001-crie-um-sistema/contracts/openapi.yaml)
- [Quickstart Guide](specs/001-crie-um-sistema/quickstart.md)

## License

MIT
