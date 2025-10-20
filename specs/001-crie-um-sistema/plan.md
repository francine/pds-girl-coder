# Implementation Plan: International Job Search Management System

**Branch**: `001-crie-um-sistema` | **Date**: 2025-10-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-crie-um-sistema/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A comprehensive job search management system to help users organize their international job search process. The system provides LinkedIn content management with AI-powered post generation and scheduling (5 posts/week target), job application pipeline tracking through a multi-stage kanban (from initial contact to closed deal), and calendar integration for interview and study session management. Key features include automated LinkedIn posting, SSI score tracking, iCalendar integration, multi-channel notifications, and a centralized dashboard for visibility into all job search activities. All UI will be in English.

## Technical Context

**Language/Version**: NEEDS CLARIFICATION (Web application - JavaScript/TypeScript ecosystem likely, but specific runtime needs confirmation)
**Primary Dependencies**: NEEDS CLARIFICATION (AI/LLM service for content generation, LinkedIn API, notification service, calendar integration library)
**Storage**: NEEDS CLARIFICATION (Relational database likely needed for entities: posts, opportunities, appointments, user profiles). Use local mongodb as database
**Testing**: NEEDS CLARIFICATION (Web testing framework based on chosen stack)
**Target Platform**: Web browser (desktop primary, mobile responsive), notification targets include email (minimum viable), desktop notifications (nice-to-have), mobile push (stretch goal)
**Project Type**: web (frontend + backend architecture)
**Performance Goals**: Dashboard load <5 seconds, post generation <2 minutes, LinkedIn posting within 5 minutes of scheduled time, notification delivery within 1 minute of trigger
**Constraints**: LinkedIn API rate limits, timezone handling for international scheduling, 95% notification reliability, support for concurrent job opportunity tracking (10+ active)
**Scale/Scope**: Single-user system, ~10 primary screens/views (dashboard, content kanban, post ideas, pipeline kanban, calendar, settings), ~5 entities with CRUD operations, external integrations (LinkedIn, iCalendar, notification services)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ⚠️ CANNOT EVALUATE - Constitution template not populated

The constitution file (`.specify/memory/constitution.md`) contains only placeholder content with no actual project principles defined. Once the constitution is populated with real project principles, this gate check will verify:

- Architectural principles compliance
- Testing requirements adherence
- Technology stack alignment
- Development workflow conformance
- Any domain-specific constraints

**Action Required**: Populate constitution file with project principles before proceeding, OR acknowledge that no constitution exists for this project and mark this gate as N/A.

## Project Structure

### Documentation (this feature)

```
specs/001-crie-um-sistema/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
backend/
├── src/
│   ├── models/              # MongoDB schemas (Post, PostIdea, JobOpportunity, Appointment, User)
│   ├── services/            # Business logic (content generation, LinkedIn integration, calendar sync, notifications)
│   ├── api/                 # REST API endpoints
│   │   ├── posts.js         # Post and PostIdea CRUD + generation
│   │   ├── pipeline.js      # JobOpportunity CRUD + stage transitions
│   │   ├── calendar.js      # Appointment CRUD + iCalendar import
│   │   ├── dashboard.js     # Aggregated metrics and summaries
│   │   └── auth.js          # User authentication
│   ├── integrations/        # External service clients
│   │   ├── linkedin.js      # LinkedIn API (posting, SSI retrieval)
│   │   ├── llm.js           # AI content generation service
│   │   └── notifications.js # Email/desktop/mobile notification service
│   └── jobs/                # Scheduled tasks (post publishing, notifications)
└── tests/
    ├── contract/            # API contract tests
    ├── integration/         # External integration tests (LinkedIn, LLM, notifications)
    └── unit/                # Service and model unit tests

frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Kanban/          # Generic kanban board component
│   │   ├── Calendar/        # Calendar view component
│   │   └── Dashboard/       # Dashboard widgets
│   ├── pages/               # Main application views
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── ContentKanban.jsx    # Post management kanban
│   │   ├── PostIdeas.jsx    # Post idea management
│   │   ├── PipelineKanban.jsx   # Job opportunity pipeline
│   │   ├── Calendar.jsx     # Calendar view
│   │   └── Settings.jsx     # User settings and integrations
│   ├── services/            # Frontend API clients
│   │   └── api.js           # Backend API communication
│   └── lib/                 # Utilities (date formatting, timezone handling)
└── tests/
    ├── e2e/                 # End-to-end user flow tests
    └── unit/                # Component unit tests
```

**Structure Decision**: Web application architecture with separate backend and frontend. Backend uses Node.js with MongoDB for data persistence, exposes REST APIs for all operations, and manages external integrations (LinkedIn, AI content generation, notifications). Frontend is a React-based SPA that communicates with the backend API. This separation allows independent scaling and deployment of frontend/backend, clear API contracts, and easier testing of business logic.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
