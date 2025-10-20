# Implementation Tasks: International Job Search Management System

**Branch**: `001-crie-um-sistema`
**Date**: 2025-10-12
**Total Tasks**: 157

## Task Organization Strategy

Tasks are organized by user story to enable independent implementation and incremental delivery:

- **Phase 1**: Project Setup
- **Phase 2**: Foundational Infrastructure (blocking prerequisites)
- **Phase 3**: US1 - LinkedIn Content Creation (P1) - **MVP SCOPE**
- **Phase 4**: US2 - Job Pipeline Tracking (P2)
- **Phase 5**: US5 - Recruiter Discovery (P2)
- **Phase 6**: US3 - Calendar Management (P3)
- **Phase 7**: US4 - Dashboard (P4)
- **Phase 8**: Polish & Integration

Each user story can be completed and tested independently.

---

## Phase 1: Project Setup

**Goal**: Initialize project structure, configure tooling, establish development environment

### Backend Setup

**T001** [Setup] [P] Initialize backend Node.js project
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/package.json`
- **Task**: Create package.json with Node.js 22, Express, TypeScript, MongoDB driver, dotenv, cors, bcrypt, jsonwebtoken, agenda (job scheduler)
- **Dependencies**: express@^4.18.0, mongodb@^6.0.0, dotenv@^16.0.0, cors@^2.8.0, bcrypt@^5.1.0, jsonwebtoken@^9.0.0, agenda@^5.0.0
- **Dev Dependencies**: typescript@^5.3.0, @types/node@^20.0.0, @types/express@^4.17.0, tsx@^4.0.0, nodemon@^3.0.0

**T002** [Setup] [P] Configure TypeScript for backend
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/tsconfig.json`
- **Task**: Configure strict TypeScript with ES modules, target ES2022, moduleResolution node, outDir dist, include src/**/*
- **Settings**: strict: true, esModuleInterop: true, skipLibCheck: true, forceConsistentCasingInFileNames: true

**T003** [Setup] [P] Create backend environment template
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/.env.example`
- **Task**: Define environment variables: PORT, MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, CLAUDE_API_KEY, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI, NODE_ENV
- **Note**: Actual .env file should be gitignored

**T004** [Setup] [P] Configure backend ESLint
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/.eslintrc.json`
- **Task**: Setup ESLint with TypeScript parser, recommended rules, no-unused-vars, no-console warnings
- **Dependencies**: eslint@^8.0.0, @typescript-eslint/parser@^6.0.0, @typescript-eslint/eslint-plugin@^6.0.0

**T005** [Setup] [P] Create backend directory structure
- **Directories**:
  - `/Users/francine/My Repositories/pds-girl-coder/backend/src/models`
  - `/Users/francine/My Repositories/pds-girl-coder/backend/src/services`
  - `/Users/francine/My Repositories/pds-girl-coder/backend/src/api`
  - `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware`
  - `/Users/francine/My Repositories/pds-girl-coder/backend/src/integrations`
  - `/Users/francine/My Repositories/pds-girl-coder/backend/src/jobs`
  - `/Users/francine/My Repositories/pds-girl-coder/backend/src/config`
  - `/Users/francine/My Repositories/pds-girl-coder/backend/src/utils`
- **Task**: Create all required directories for backend source code

**T006** [Setup] [P] Add backend npm scripts
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/package.json`
- **Task**: Add scripts: "dev" (nodemon with tsx), "build" (tsc), "start" (node dist/index.js), "lint" (eslint), "type-check" (tsc --noEmit)

### Frontend Setup

**T007** [Setup] [P] Initialize frontend React + Vite project
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/package.json`
- **Task**: Create Vite React TypeScript project with React 18, Ant Design, axios, @dnd-kit (drag-and-drop), dayjs, react-router-dom
- **Dependencies**: react@^18.2.0, react-dom@^18.2.0, antd@^5.12.0, axios@^1.6.0, @dnd-kit/core@^6.1.0, @dnd-kit/sortable@^8.0.0, dayjs@^1.11.0, react-router-dom@^6.20.0
- **Dev Dependencies**: vite@^5.0.0, @vitejs/plugin-react@^4.2.0, typescript@^5.3.0

**T008** [Setup] [P] Configure TypeScript for frontend
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/tsconfig.json`
- **Task**: Configure TypeScript with React JSX support, strict mode, target ES2020, lib DOM/ES2020, moduleResolution bundler
- **Settings**: jsx: react-jsx, strict: true, esModuleInterop: true, skipLibCheck: true

**T009** [Setup] [P] Configure Vite
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/vite.config.ts`
- **Task**: Setup Vite with React plugin, define API proxy to backend (localhost:3000), configure build output
- **Proxy**: /api/v1 -> http://localhost:3000/api/v1

**T010** [Setup] [P] Configure frontend ESLint
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/.eslintrc.json`
- **Task**: Setup ESLint with React hooks plugin, TypeScript parser, recommended rules
- **Dependencies**: eslint@^8.0.0, eslint-plugin-react-hooks@^4.6.0, @typescript-eslint/parser@^6.0.0

**T011** [Setup] [P] Create frontend directory structure
- **Directories**:
  - `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components`
  - `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages`
  - `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services`
  - `/Users/francine/My Repositories/pds-girl-coder/frontend/src/hooks`
  - `/Users/francine/My Repositories/pds-girl-coder/frontend/src/utils`
  - `/Users/francine/My Repositories/pds-girl-coder/frontend/src/types`
  - `/Users/francine/My Repositories/pds-girl-coder/frontend/src/context`
- **Task**: Create all required directories for frontend source code

**T012** [Setup] [P] Configure Ant Design theme
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/theme.ts`
- **Task**: Configure Ant Design theme with custom colors, token overrides for professional appearance
- **Theme**: Primary color matching job search context, clean typography, proper spacing

**T013** [Setup] [P] Add frontend npm scripts
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/package.json`
- **Task**: Add scripts: "dev" (vite), "build" (vite build), "preview" (vite preview), "lint" (eslint), "type-check" (tsc --noEmit)

### Repository Configuration

**T014** [Setup] [P] Create root .gitignore
- **File**: `/Users/francine/My Repositories/pds-girl-coder/.gitignore`
- **Task**: Ignore node_modules, .env files, dist/build folders, IDE configs, OS files (.DS_Store)

**T015** [Setup] [P] Create root README
- **File**: `/Users/francine/My Repositories/pds-girl-coder/README.md`
- **Task**: Document project overview, tech stack, setup instructions, development workflow
- **Sections**: Project description, prerequisites (Node.js 22, MongoDB), installation steps, running locally, API documentation link

**T016** [Setup] Create docker-compose for local development
- **File**: `/Users/francine/My Repositories/pds-girl-coder/docker-compose.yml`
- **Task**: Define MongoDB container with persistent volume, expose on port 27017
- **Services**: mongodb (image: mongo:7, ports: 27017:27017, volumes for data persistence)

---

## Phase 2: Foundational Infrastructure

**Goal**: Implement blocking prerequisites required by ALL user stories

**⚠️ CHECKPOINT**: These tasks MUST complete before any user story implementation begins

### Database & Connection

**T017** [Foundation] [P] Implement MongoDB connection manager
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/config/database.ts`
- **Task**: Create MongoDB connection with retry logic, connection pooling, error handling, graceful shutdown
- **Exports**: connectDB() function, getDB() accessor, closeConnection() for cleanup
- **Features**: Retry on connection failure (max 5 attempts), connection timeout, event logging

**T018** [Foundation] [P] Create database initialization script
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/config/initDb.ts`
- **Task**: Create indexes for all collections as defined in data-model.md, ensure unique constraints
- **Indexes**: User (email unique), PostIdea (userId+status, userId+createdAt), Post (userId+status, scheduledAt), JobOpportunity (userId+stage), Appointment (userId+startTime), Recruiter (userId+linkedinProfileUrl unique composite)

### Core Utilities

**T019** [Foundation] [P] Implement error types and error handler utility
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/utils/errors.ts`
- **Task**: Define custom error classes (ValidationError, NotFoundError, AuthError, ExternalServiceError) extending Error with status codes
- **Classes**: AppError (base), ValidationError (400), NotFoundError (404), UnauthorizedError (401), ForbiddenError (403), ConflictError (409), ExternalServiceError (502)

**T020** [Foundation] [P] Implement logger utility
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/utils/logger.ts`
- **Task**: Create structured logger with levels (debug, info, warn, error), JSON formatting, timestamp
- **Library**: Consider pino or winston, output to console in development, file/stream in production

**T021** [Foundation] [P] Implement validation utility
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/utils/validation.ts`
- **Task**: Create common validation functions (email, URL, date, enum, string length, ObjectId)
- **Functions**: isValidEmail, isValidUrl, isValidObjectId, isValidEnum, validateStringLength, validateDateRange

**T022** [Foundation] [P] Implement date/timezone utility
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/utils/dateUtils.ts`
- **Task**: Create timezone conversion helpers, start/end of week/day calculators, date formatting
- **Library**: Use dayjs with timezone plugin
- **Functions**: toUserTimezone, toUTC, startOfWeek, endOfWeek, startOfDay, endOfDay, isToday, isTomorrow

### Authentication System

**T023** [Foundation] Implement User model
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/models/User.ts`
- **Task**: Create User schema matching data-model.md with all fields, validation rules, indexes
- **Fields**: email, passwordHash, name, linkedinIntegration, timezone, skills, targetIndustries, targetRegions, weeklyConnectionLimit, currentWeekConnectionCount, weekStartDate, notifications, createdAt, updatedAt
- **Methods**: Instance method to compare password, instance method to sanitize (remove sensitive fields)
- **Indexes**: email (unique), weekStartDate

**T024** [Foundation] Implement password hashing utility
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/utils/passwordUtils.ts`
- **Task**: Create bcrypt wrapper for hashing and comparing passwords
- **Functions**: hashPassword(password: string): Promise<string>, comparePassword(password: string, hash: string): Promise<boolean>
- **Settings**: bcrypt rounds: 10

**T025** [Foundation] Implement JWT service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/jwtService.ts`
- **Task**: Create JWT token generation, validation, and refresh logic
- **Functions**: generateAccessToken(userId), generateRefreshToken(userId), verifyAccessToken(token), verifyRefreshToken(token)
- **Settings**: Access token expires in 15 minutes, refresh token expires in 7 days, include userId in payload

**T026** [Foundation] Implement authentication service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/authService.ts`
- **Task**: Create business logic for register, login, refresh token, get user profile
- **Functions**: register(email, password, name), login(email, password), refreshAccessToken(refreshToken), getUserProfile(userId)
- **Validation**: Email format, password minimum 8 chars, duplicate email check, invalid credentials handling

**T027** [Foundation] Implement authentication middleware
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/auth.ts`
- **Task**: Create Express middleware to validate JWT tokens from Authorization header, attach userId to request
- **Flow**: Extract Bearer token → verify token → attach req.userId → next() or error
- **Errors**: Return 401 if no token, invalid token, or expired token

**T028** [Foundation] Implement auth API endpoints
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/auth.ts`
- **Task**: Create Express router with POST /register, POST /login, POST /refresh, GET /me endpoints
- **Routes**:
  - POST /auth/register: Create user, return user + tokens
  - POST /auth/login: Validate credentials, return user + tokens
  - POST /auth/refresh: Validate refresh token, return new access token
  - GET /auth/me: Return current user profile (requires auth middleware)

### HTTP Server Setup

**T029** [Foundation] Implement request validation middleware
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/validateRequest.ts`
- **Task**: Create generic middleware to validate request body/query against schema, return 400 on validation errors
- **Function**: validateRequest(schema) - returns middleware function
- **Library**: Consider using Joi or Zod for schema validation

**T030** [Foundation] Implement error handling middleware
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/errorHandler.ts`
- **Task**: Create Express error handling middleware to catch all errors, format responses, log errors
- **Response Format**: { error: string, message: string, details?: object }
- **Logging**: Log stack trace for 500 errors, log validation details for 400 errors

**T031** [Foundation] Implement CORS middleware configuration
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/cors.ts`
- **Task**: Configure CORS to allow frontend origin (localhost:5173 in dev), credentials: true
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization

**T032** [Foundation] Create main Express application
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/app.ts`
- **Task**: Create Express app, apply middleware (cors, json parser, request logging), mount API routes
- **Middleware Order**: CORS → JSON parser → request logging → routes → error handler
- **Route Mounting**: /api/v1/auth, /api/v1/posts, /api/v1/post-ideas, /api/v1/opportunities, /api/v1/appointments, /api/v1/recruiters, /api/v1/dashboard

**T033** [Foundation] Create server entry point
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/index.ts`
- **Task**: Initialize database connection, start Express server, handle graceful shutdown
- **Flow**: Load env vars → connect to DB → start server → listen on PORT → handle SIGTERM/SIGINT for graceful shutdown
- **Logging**: Log server start, database connection status, shutdown events

### Frontend Authentication Setup

**T034** [Foundation] [P] Define TypeScript types for API models
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/types/api.ts`
- **Task**: Create TypeScript interfaces matching API schemas (User, PostIdea, Post, JobOpportunity, Appointment, Recruiter, Dashboard)
- **Types**: User, PostIdea, Post, JobOpportunity, Appointment, Recruiter, Dashboard, ErrorResponse, PaginatedResponse

**T035** [Foundation] Implement axios client with interceptors
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/api.ts`
- **Task**: Create axios instance with base URL, request interceptor to attach auth token, response interceptor to handle 401 errors
- **Interceptors**:
  - Request: Add Authorization: Bearer token from localStorage
  - Response: Catch 401 → refresh token → retry request OR redirect to login
- **Base URL**: /api/v1 (proxied by Vite in dev)

**T036** [Foundation] Implement token storage utility
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/utils/tokenStorage.ts`
- **Task**: Create localStorage wrappers for storing/retrieving access token and refresh token
- **Functions**: getAccessToken(), setAccessToken(token), getRefreshToken(), setRefreshToken(token), clearTokens()
- **Security**: Consider httpOnly cookies in production for refresh token

**T037** [Foundation] Implement auth API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/authApi.ts`
- **Task**: Create functions to call auth endpoints: register, login, refreshToken, getCurrentUser, logout
- **Functions**:
  - register(email, password, name): Promise<{user, accessToken, refreshToken}>
  - login(email, password): Promise<{user, accessToken, refreshToken}>
  - refreshToken(refreshToken): Promise<{accessToken}>
  - getCurrentUser(): Promise<User>
  - logout(): void (clear tokens)

**T038** [Foundation] Create auth context provider
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/context/AuthContext.tsx`
- **Task**: Create React context for authentication state (user, loading, isAuthenticated), provide login/logout/register methods
- **State**: { user: User | null, isAuthenticated: boolean, loading: boolean }
- **Methods**: login, register, logout, checkAuth (verify token on mount)
- **Provider**: Wrap app with AuthProvider, check token validity on mount

**T039** [Foundation] [P] Create login page component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/Login.tsx`
- **Task**: Create login form with email/password fields using Ant Design Form, handle submission, redirect to dashboard on success
- **UI**: Ant Design Form, Card layout, email input (validation), password input, submit button, loading state, error message display, link to register

**T040** [Foundation] [P] Create register page component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/Register.tsx`
- **Task**: Create registration form with email/password/name fields, handle submission, redirect to dashboard on success
- **UI**: Ant Design Form, email/password/name inputs, validation (email format, password min length), submit button, loading state, error display, link to login

**T041** [Foundation] Implement protected route wrapper
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/ProtectedRoute.tsx`
- **Task**: Create route wrapper component that redirects to login if not authenticated
- **Logic**: Check isAuthenticated from AuthContext → render children if true → redirect to /login if false
- **Loading**: Show loading spinner while checking auth status

**T042** [Foundation] Configure React Router
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/App.tsx`
- **Task**: Setup React Router with routes for login, register, dashboard, and all feature pages, wrap protected routes
- **Routes**:
  - /login (public)
  - /register (public)
  - / → redirect to /dashboard
  - /dashboard (protected)
  - /content (protected)
  - /post-ideas (protected)
  - /pipeline (protected)
  - /calendar (protected)
  - /recruiters (protected)
  - /settings (protected)

**T043** [Foundation] [P] Create main layout component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Layout/MainLayout.tsx`
- **Task**: Create layout with Ant Design Layout (Sider for navigation, Header for user info, Content for page)
- **UI**: Ant Design Layout, Sider with Menu (links to all pages), Header with user name and logout button, Content renders children
- **Navigation**: Dashboard, Content Kanban, Post Ideas, Job Pipeline, Calendar, Recruiters, Settings

---

## Phase 3: US1 - LinkedIn Content Creation and Publishing (P1)

**Goal**: Enable users to create post ideas, generate content with AI, schedule posts, and track in a kanban

**Why MVP**: This is the primary visibility driver for job search success

**Independent Test**: User can create a post idea → generate content → schedule → see in kanban → auto-publish to LinkedIn

### Backend - Data Models

**T044** [US1] [P] Implement PostIdea model
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/models/PostIdea.ts`
- **Task**: Create PostIdea schema with fields: userId, title, description, tags, status, usedInPostIds, createdAt, updatedAt
- **Validation**: title 1-200 chars required, description max 2000 chars, status enum [active, used, archived], tags max 10 elements
- **Indexes**: userId+status, userId+createdAt (descending)

**T045** [US1] [P] Implement Post model
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/models/Post.ts`
- **Task**: Create Post schema with fields: userId, postIdeaId, content, status, scheduledAt, publishedAt, linkedinPostId, linkedinUrl, metrics (likes, comments, shares, lastUpdated), errorMessage, retryCount, createdAt, updatedAt
- **Validation**: content 1-3000 chars required, status enum [draft, scheduled, published, failed], retryCount 0-3, metrics >= 0
- **Indexes**: userId+status, userId+scheduledAt, userId+createdAt (descending), scheduledAt (for job scheduler)

### Backend - External Integrations

**T046** [US1] Implement Claude AI integration
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/integrations/claude.ts`
- **Task**: Create Claude API client for content generation, handle 500 word limit, professional tone
- **Library**: @anthropic-ai/sdk
- **Function**: generatePostContent(postIdeaTitle, postIdeaDescription, userSkills, tone, maxWords): Promise<string>
- **Prompt**: Generate LinkedIn post about [topic], targeting [skills], in [tone] tone, max [maxWords] words, professional format
- **Error Handling**: Catch API errors, rate limiting, timeout, return ExternalServiceError

**T047** [US1] Implement LinkedIn OAuth integration
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/integrations/linkedin/oauth.ts`
- **Task**: Create LinkedIn OAuth flow to obtain access/refresh tokens, store encrypted in user record
- **Functions**: getAuthorizationUrl(userId), handleCallback(code, state), refreshAccessToken(refreshToken)
- **Scopes**: w_member_social (posting), r_liteprofile (profile), r_basicprofile
- **Storage**: Encrypt tokens before storing in User.linkedinIntegration

**T048** [US1] Implement LinkedIn posting integration
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/integrations/linkedin/posting.ts`
- **Task**: Create LinkedIn API client to publish posts, retrieve SSI score, fetch engagement metrics
- **Functions**:
  - publishPost(accessToken, content): Promise<{linkedinPostId, linkedinUrl}>
  - getSSIScore(accessToken): Promise<number>
  - getPostMetrics(accessToken, linkedinPostId): Promise<{likes, comments, shares}>
- **API**: LinkedIn Share API v2, SSI API (if available, otherwise mock), UGC Posts API for metrics
- **Error Handling**: Handle LinkedIn rate limits, token expiration, API errors

**T049** [US1] Implement token encryption utility
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/utils/encryption.ts`
- **Task**: Create AES-256 encryption/decryption for LinkedIn tokens
- **Functions**: encrypt(text: string): string, decrypt(encrypted: string): string
- **Library**: Node.js crypto module, key from environment variable
- **Key Management**: Use ENCRYPTION_KEY from .env, generate secure key for production

### Backend - Business Logic Services

**T050** [US1] Implement post idea service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/postIdeaService.ts`
- **Task**: Create business logic for PostIdea CRUD operations, ensure user isolation
- **Functions**:
  - createPostIdea(userId, data): Promise<PostIdea>
  - getPostIdeas(userId, filters): Promise<PostIdea[]>
  - getPostIdeaById(userId, postIdeaId): Promise<PostIdea>
  - updatePostIdea(userId, postIdeaId, data): Promise<PostIdea>
  - deletePostIdea(userId, postIdeaId): Promise<void>
  - markPostIdeaAsUsed(userId, postIdeaId, postId): Promise<PostIdea>
- **Validation**: Validate all inputs, check ownership (userId), throw NotFoundError if not found

**T051** [US1] Implement post service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/postService.ts`
- **Task**: Create business logic for Post CRUD, content generation, scheduling, publishing
- **Functions**:
  - createPost(userId, data): Promise<Post>
  - getPosts(userId, filters): Promise<Post[]>
  - getPostById(userId, postId): Promise<Post>
  - updatePost(userId, postId, data): Promise<Post>
  - deletePost(userId, postId): Promise<void>
  - generatePostContent(userId, postIdeaId, options): Promise<string>
  - schedulePost(userId, postId, scheduledAt): Promise<Post>
  - publishPostToLinkedIn(postId): Promise<Post>
  - retryFailedPost(userId, postId): Promise<Post>
  - getWeeklyPostCount(userId): Promise<number>
- **Business Logic**:
  - When generating content, call Claude integration with post idea details + user skills
  - When scheduling, validate scheduledAt is in future, update status to 'scheduled'
  - When publishing, call LinkedIn integration, update status to 'published' or 'failed', increment retryCount on failure
  - Weekly post count: count posts with status 'scheduled' or 'published' where createdAt >= start of week

**T052** [US1] Implement topic suggestion service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/topicSuggestionService.ts`
- **Task**: Use Claude AI to suggest post topics when user has less than 5 posts scheduled for the week
- **Function**: suggestTopics(userId, count): Promise<{title, description, reason}[]>
- **Logic**:
  - Get user skills and existing post ideas
  - Calculate how many topics needed to reach 5 posts for the week
  - Call Claude API to generate [count] topic suggestions based on user skills and gap
  - Return structured suggestions
- **Prompt**: Generate [count] LinkedIn post topic suggestions for a professional with skills: [skills]. Topics should be relevant to international job search, showcase expertise, and be engaging. Return as JSON array with title, description, reason fields.

**T053** [US1] Implement LinkedIn SSI update service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/ssiService.ts`
- **Task**: Fetch and update user's LinkedIn SSI score periodically
- **Function**: updateSSIScore(userId): Promise<number>
- **Logic**:
  - Get user's LinkedIn access token
  - Call LinkedIn integration to fetch SSI score
  - Update User.linkedinIntegration.ssiScore and lastSsiUpdate
  - Return score
- **Error Handling**: Log errors but don't fail user operations, mark integration as disconnected if token expired

### Backend - API Endpoints

**T054** [US1] Implement post ideas API router
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/postIdeas.ts`
- **Task**: Create Express router with endpoints: GET /, POST /, GET /:id, PUT /:id, DELETE /:id
- **Routes**:
  - GET /post-ideas: Get all post ideas with optional filters (status, tag)
  - POST /post-ideas: Create new post idea
  - GET /post-ideas/:id: Get single post idea
  - PUT /post-ideas/:id: Update post idea (title, description, tags, status)
  - DELETE /post-ideas/:id: Delete post idea
- **Middleware**: All routes require auth middleware
- **Validation**: Validate request body with schemas

**T055** [US1] Implement posts API router
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/posts.ts`
- **Task**: Create Express router with endpoints: GET /, POST /, GET /:id, PUT /:id, DELETE /:id, POST /generate, GET /suggest-topics, POST /:id/retry
- **Routes**:
  - GET /posts: Get all posts with filters (status, startDate, endDate)
  - POST /posts: Create new post
  - GET /posts/:id: Get single post
  - PUT /posts/:id: Update post (content, status, scheduledAt)
  - DELETE /posts/:id: Delete post
  - POST /posts/generate: Generate content from post idea
  - GET /posts/suggest-topics: Get AI-generated topic suggestions
  - POST /posts/:id/retry: Retry publishing failed post
- **Middleware**: All routes require auth middleware
- **Validation**: Validate all inputs, check ownership

**T056** [US1] Implement LinkedIn OAuth callback endpoint
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/linkedin.ts`
- **Task**: Create Express router with OAuth callback and disconnect endpoints
- **Routes**:
  - GET /linkedin/auth: Start OAuth flow, redirect to LinkedIn
  - GET /linkedin/callback: Handle OAuth callback, store tokens
  - POST /linkedin/disconnect: Remove LinkedIn integration
  - GET /linkedin/ssi: Manually trigger SSI update
- **Middleware**: Require auth for disconnect and ssi endpoints
- **Flow**: Generate state parameter → redirect to LinkedIn → callback validates state → exchange code for tokens → encrypt and store → redirect to frontend settings page

### Backend - Scheduled Jobs

**T057** [US1] Implement Agenda job scheduler setup
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/jobs/agenda.ts`
- **Task**: Initialize Agenda with MongoDB connection, define job processing, start scheduler
- **Configuration**: Use same MongoDB connection, collection: 'agendaJobs', processEvery: '1 minute'
- **Exports**: agenda instance, defineJob(name, handler), scheduleJob(name, interval, data)

**T058** [US1] Implement post publisher job
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/jobs/postPublisher.ts`
- **Task**: Create Agenda job to find and publish scheduled posts every 5 minutes
- **Job Name**: 'publish-scheduled-posts'
- **Schedule**: Every 5 minutes
- **Logic**:
  - Query posts with status 'scheduled' and scheduledAt <= now + 5 minutes
  - For each post: call postService.publishPostToLinkedIn(postId)
  - Handle errors gracefully, update post status to 'failed' on error
  - Log success/failure for monitoring
- **Concurrency**: Process one post at a time to avoid rate limits

**T059** [US1] Implement post metrics update job
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/jobs/metricsUpdater.ts`
- **Task**: Create Agenda job to update engagement metrics for published posts hourly
- **Job Name**: 'update-post-metrics'
- **Schedule**: Every 1 hour
- **Logic**:
  - Query posts with status 'published' and publishedAt within last 30 days
  - For each post: fetch metrics from LinkedIn API
  - Update Post.metrics (likes, comments, shares, lastUpdated)
  - Log errors but don't fail entire job
- **Optimization**: Batch process posts per user to reuse access tokens

**T060** [US1] Implement SSI score update job
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/jobs/ssiUpdater.ts`
- **Task**: Create Agenda job to update LinkedIn SSI scores daily
- **Job Name**: 'update-ssi-scores'
- **Schedule**: Daily at 8:00 AM UTC
- **Logic**:
  - Query users with linkedinIntegration.connected = true
  - For each user: call ssiService.updateSSIScore(userId)
  - Log success/failure per user
- **Rate Limiting**: Add delay between users to avoid LinkedIn rate limits

### Frontend - API Client

**T061** [US1] [P] Implement post ideas API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/postIdeasApi.ts`
- **Task**: Create functions for all post ideas endpoints
- **Functions**:
  - getPostIdeas(filters?): Promise<PostIdea[]>
  - getPostIdeaById(id): Promise<PostIdea>
  - createPostIdea(data): Promise<PostIdea>
  - updatePostIdea(id, data): Promise<PostIdea>
  - deletePostIdea(id): Promise<void>
- **Error Handling**: Throw errors for non-2xx responses, include error message from API

**T062** [US1] [P] Implement posts API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/postsApi.ts`
- **Task**: Create functions for all posts endpoints
- **Functions**:
  - getPosts(filters?): Promise<Post[]>
  - getPostById(id): Promise<Post>
  - createPost(data): Promise<Post>
  - updatePost(id, data): Promise<Post>
  - deletePost(id): Promise<void>
  - generateContent(postIdeaId, options?): Promise<{content: string}>
  - suggestTopics(): Promise<{suggestions: {title, description, reason}[]}>
  - retryPost(id): Promise<Post>
- **Error Handling**: Handle API errors, display user-friendly messages

**T063** [US1] [P] Implement LinkedIn API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/linkedinApi.ts`
- **Task**: Create functions for LinkedIn integration endpoints
- **Functions**:
  - getLinkedInAuthUrl(): Promise<string>
  - disconnectLinkedIn(): Promise<void>
  - updateSSI(): Promise<number>
- **Usage**: Call getLinkedInAuthUrl to get OAuth URL, open in new window, handle callback redirect

### Frontend - Shared Components

**T064** [US1] [P] Implement reusable Kanban board component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Kanban/KanbanBoard.tsx`
- **Task**: Create generic drag-and-drop kanban board using @dnd-kit and Ant Design
- **Props**: columns: {id, title, items}[], onDragEnd(itemId, sourceColumn, destColumn), renderCard(item), loading
- **UI**: Horizontal columns with Ant Design Card, drag handles, drop zones, empty state
- **Library**: Use @dnd-kit/core for DnD, @dnd-kit/sortable for column items
- **Styling**: Responsive, scrollable columns, visual feedback on drag

**T065** [US1] [P] Implement Post card component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Kanban/PostCard.tsx`
- **Task**: Create card to display post in kanban with content preview, status badge, actions
- **Props**: post: Post, onEdit, onDelete, onView
- **UI**: Ant Design Card with title (first line of content), status badge (Tag), scheduled time, engagement metrics (if published), action buttons (Edit, Delete, View)
- **Content Preview**: Show first 100 chars of content with ellipsis
- **Badges**: Color-coded status tags (draft: blue, scheduled: orange, published: green, failed: red)

**T066** [US1] [P] Implement Post form modal component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Posts/PostFormModal.tsx`
- **Task**: Create modal with form to create/edit posts
- **Props**: visible, post (null for create), onCancel, onSubmit
- **UI**: Ant Design Modal with Form, fields: content (textarea, max 3000 chars), status (select), scheduledAt (datetime picker if status = scheduled), postIdeaId (optional select)
- **Validation**: Content required, scheduledAt required if status = scheduled, future date validation
- **Features**: Character counter for content, datetime picker respects user timezone

**T067** [US1] [P] Implement Post detail drawer component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Posts/PostDetailDrawer.tsx`
- **Task**: Create drawer to show full post details including metrics, history
- **Props**: visible, post, onClose
- **UI**: Ant Design Drawer, display full content, status, created/updated dates, scheduled/published dates, metrics (likes, comments, shares), LinkedIn URL (if published), error message (if failed)
- **Actions**: Edit button, Delete button, Retry button (if failed), Copy content button

### Frontend - Post Ideas Page

**T068** [US1] Implement Post Ideas list view
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/PostIdeas.tsx`
- **Task**: Create page to list, create, edit, delete post ideas with Ant Design Table
- **UI**:
  - Page header with title "Post Ideas", Create button
  - Filters: status select, tag select
  - Ant Design Table with columns: title, description (truncated), tags, status, created date, actions (Edit, Delete, Generate Post)
  - Pagination if > 50 ideas
- **Features**:
  - Click Create → open modal to create new idea
  - Click Edit → open modal to edit existing idea
  - Click Delete → show confirmation modal → delete
  - Click Generate Post → redirect to Content Kanban with generated content modal
- **State**: Load post ideas on mount, refresh after create/edit/delete

**T069** [US1] [P] Implement Post Idea form modal component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/PostIdeas/PostIdeaFormModal.tsx`
- **Task**: Create modal with form to create/edit post ideas
- **Props**: visible, postIdea (null for create), onCancel, onSubmit
- **UI**: Ant Design Modal with Form, fields: title (required, max 200 chars), description (textarea, max 2000 chars), tags (select mode=tags, max 10)
- **Validation**: Title required, length limits
- **Features**: Tag creation on-the-fly, character counters

### Frontend - Content Kanban Page

**T070** [US1] Implement Content Kanban page
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/ContentKanban.tsx`
- **Task**: Create kanban page to manage posts through lifecycle (draft → scheduled → published)
- **UI**:
  - Page header with title "Content Management", Create Post button, Generate from Idea button
  - Filters: date range picker
  - KanbanBoard with columns: Draft, Scheduled, Published, Failed
  - PostCard component for each item
  - Weekly progress indicator (X of 5 posts this week)
  - Topic suggestions button (if < 5 posts scheduled)
- **Columns**:
  - Draft: status = 'draft'
  - Scheduled: status = 'scheduled', sorted by scheduledAt
  - Published: status = 'published', sorted by publishedAt (descending)
  - Failed: status = 'failed'
- **Drag & Drop**: Allow moving posts between Draft and Scheduled columns (updates status), disable drag for Published/Failed
- **State**: Load posts on mount, filter by current week by default, refresh after operations
- **Actions**: Click card → open detail drawer, click edit → open form modal, drag to Scheduled → prompt for schedule time

**T071** [US1] Implement content generation flow
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Posts/GenerateContentModal.tsx`
- **Task**: Create modal to generate post content from idea
- **Props**: visible, onCancel, onGenerated(content)
- **UI**:
  - Step 1: Select post idea (dropdown with all active ideas) or enter custom topic
  - Step 2: Select tone (professional, casual, technical, storytelling)
  - Step 3: Show loading while generating, display generated content
  - Step 4: Edit content if needed, save as draft or schedule
- **Flow**: Select idea → click Generate → API call → show content → allow edit → save
- **Features**: Loading spinner during generation, error handling, textarea to edit generated content

**T072** [US1] Implement topic suggestions feature
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Posts/TopicSuggestionsModal.tsx`
- **Task**: Create modal to show AI-generated topic suggestions
- **Props**: visible, onCancel, onSelectTopic(topic)
- **UI**:
  - Show loading while fetching suggestions
  - Display list of suggestions with title, description, reason
  - Each suggestion has "Create Idea" button
- **Flow**: Click suggestion → create post idea → refresh post ideas list → notify user
- **Features**: Batch create multiple ideas, loading state, empty state

**T073** [US1] Implement weekly progress widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Posts/WeeklyProgressWidget.tsx`
- **Task**: Create widget to show weekly posting progress
- **Props**: currentCount: number, target: number (default 5)
- **UI**: Ant Design Progress (circle or bar), show X/5 posts this week, color-coded (red if < 3, yellow if 3-4, green if >= 5)
- **Position**: Display in Content Kanban page header or as fixed widget
- **Features**: Click widget → show breakdown of posts by status

### Frontend - LinkedIn Integration Settings

**T074** [US1] Implement LinkedIn connection settings component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Settings/LinkedInSettings.tsx`
- **Task**: Create settings panel for LinkedIn integration
- **UI**:
  - If not connected: "Connect LinkedIn" button, explanation text
  - If connected: Display connected status, SSI score, last updated, "Disconnect" button, "Refresh SSI" button
- **Actions**:
  - Connect: Open OAuth flow in popup window, handle callback, refresh user data
  - Disconnect: Confirm → call disconnect API → update user state
  - Refresh SSI: Call update SSI endpoint → display new score
- **Features**: Show loading states, error handling, success notifications

**⚠️ CHECKPOINT US1**: MVP feature complete - user can manage LinkedIn content end-to-end

---

## Phase 4: US2 - Job Application Pipeline Tracking (P2)

**Goal**: Track job opportunities through 7-stage pipeline

**Independent Test**: User can create opportunity → move through stages → view history

### Backend - Data Model

**T075** [US2] Implement JobOpportunity model
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/models/JobOpportunity.ts`
- **Task**: Create JobOpportunity schema with fields: userId, company, position, description, stage, stageHistory, contactEmail, contactName, contactPhone, recruiterId, jobPostingUrl, companyWebsite, notes, attachments, salary (min, max, currency), location, remoteType, createdAt, updatedAt
- **Validation**: company/position required (1-200 chars), stage enum [initial_contacts, in_progress, interview, proposal, negotiation, deal_closed, archived], stageHistory min 1 entry, salary.currency ISO 4217
- **Indexes**: userId+stage, userId+createdAt (descending), recruiterId

### Backend - Business Logic

**T076** [US2] Implement job opportunity service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/jobOpportunityService.ts`
- **Task**: Create business logic for JobOpportunity CRUD and stage management
- **Functions**:
  - createOpportunity(userId, data): Promise<JobOpportunity>
  - getOpportunities(userId, filters): Promise<JobOpportunity[]>
  - getOpportunityById(userId, opportunityId): Promise<JobOpportunity>
  - updateOpportunity(userId, opportunityId, data): Promise<JobOpportunity>
  - deleteOpportunity(userId, opportunityId): Promise<void>
  - moveToStage(userId, opportunityId, newStage, notes?): Promise<JobOpportunity>
  - getStageHistory(userId, opportunityId): Promise<{stage, timestamp, notes}[]>
  - getStageCounts(userId): Promise<{stage: string, count: number}[]>
- **Stage Transition Logic**:
  - When moving to new stage, append to stageHistory with timestamp and optional notes
  - Update stage field
  - Return updated opportunity
- **Validation**: Validate stage is valid enum value, check ownership

### Backend - API Endpoints

**T077** [US2] Implement pipeline API router
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/pipeline.ts`
- **Task**: Create Express router with endpoints: GET /, POST /, GET /:id, PUT /:id, DELETE /:id, PUT /:id/stage
- **Routes**:
  - GET /opportunities: Get all opportunities with optional filter by stage
  - POST /opportunities: Create new opportunity
  - GET /opportunities/:id: Get single opportunity
  - PUT /opportunities/:id: Update opportunity (company, position, description, notes, salary, etc.)
  - DELETE /opportunities/:id: Delete opportunity
  - PUT /opportunities/:id/stage: Move opportunity to different stage with optional notes
- **Middleware**: All routes require auth middleware
- **Validation**: Validate inputs, check ownership, validate stage transitions

### Frontend - API Client

**T078** [US2] [P] Implement opportunities API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/pipelineApi.ts`
- **Task**: Create functions for all pipeline endpoints
- **Functions**:
  - getOpportunities(filters?): Promise<JobOpportunity[]>
  - getOpportunityById(id): Promise<JobOpportunity>
  - createOpportunity(data): Promise<JobOpportunity>
  - updateOpportunity(id, data): Promise<JobOpportunity>
  - deleteOpportunity(id): Promise<void>
  - moveToStage(id, stage, notes?): Promise<JobOpportunity>
- **Error Handling**: Handle API errors, display messages

### Frontend - Components

**T079** [US2] [P] Implement Opportunity card component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Pipeline/OpportunityCard.tsx`
- **Task**: Create card to display opportunity in kanban
- **Props**: opportunity: JobOpportunity, onEdit, onDelete, onView
- **UI**: Ant Design Card with company name (title), position (subtitle), location, remote type badge, salary range (if available), action buttons (Edit, Delete, View)
- **Features**: Color-coded by stage, show days in current stage, display contact info icon if available

**T080** [US2] [P] Implement Opportunity form modal component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Pipeline/OpportunityFormModal.tsx`
- **Task**: Create modal with form to create/edit opportunities
- **Props**: visible, opportunity (null for create), onCancel, onSubmit
- **UI**: Ant Design Modal with Form, fields: company (required), position (required), description (textarea), stage (select), contactEmail, contactName, contactPhone, jobPostingUrl, companyWebsite, salary (min/max/currency), location, remoteType (radio), notes (textarea)
- **Validation**: Required fields, email format, URL format, salary max >= min
- **Features**: Auto-fill company website from domain if URL provided, currency dropdown with common options (USD, EUR, BRL, etc.)

**T081** [US2] [P] Implement Opportunity detail drawer component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Pipeline/OpportunityDetailDrawer.tsx`
- **Task**: Create drawer to show full opportunity details and stage history
- **Props**: visible, opportunity, onClose
- **UI**: Ant Design Drawer, display all opportunity fields, stage history timeline (Ant Design Timeline), show transition dates and notes, attachments list (future), contact information, links
- **Actions**: Edit button, Delete button, Move to Stage dropdown, Add Note button
- **Timeline**: Visual timeline of stage transitions with dates and notes

### Frontend - Pipeline Kanban Page

**T082** [US2] Implement Pipeline Kanban page
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/PipelineKanban.tsx`
- **Task**: Create kanban page with 7 columns for opportunity stages
- **UI**:
  - Page header with title "Job Pipeline", Create Opportunity button
  - Filters: search by company/position, date range
  - KanbanBoard with columns: Initial Contacts, In Progress, Interview, Proposal, Negotiation, Deal Closed, Archived
  - OpportunityCard component for each item
  - Stage counts in column headers
- **Columns**: One column per stage enum value
- **Drag & Drop**: Allow moving opportunities between stages, prompt for notes on drop
- **State**: Load opportunities on mount, group by stage, refresh after operations
- **Features**: Archive toggle (show/hide archived column), search filter, sort by created date

**T083** [US2] Implement stage transition confirmation modal
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Pipeline/StageTransitionModal.tsx`
- **Task**: Create modal to add notes when moving opportunity to new stage
- **Props**: visible, opportunity, newStage, onCancel, onConfirm(notes)
- **UI**: Ant Design Modal, show current stage → new stage, textarea for optional notes, Cancel and Confirm buttons
- **Features**: Auto-save to history with timestamp

**⚠️ CHECKPOINT US2**: Job pipeline tracking complete

---

## Phase 5: US5 - LinkedIn Recruiter Discovery and Connection Management (P2)

**Goal**: Search LATAM recruiters, generate connection messages, track weekly limits

**Independent Test**: User can search recruiters → view messages → mark connections → track weekly count

### Backend - Data Model

**T084** [US5] Implement Recruiter model
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/models/Recruiter.ts`
- **Task**: Create Recruiter schema with fields: userId, name, company, location, industry, linkedinProfileUrl, status, discoveredAt, connectionSentAt, connectedAt, rejectedAt, connectionWeek, generatedMessages (message, generatedAt, used), notes, searchCriteria (region, industry, keywords), createdAt, updatedAt
- **Validation**: name/company required (1-200 chars), linkedinProfileUrl required (valid URL), status enum [discovered, connection_sent, connected, rejected], generatedMessages max 10
- **Indexes**: userId+status, userId+linkedinProfileUrl (unique composite), userId+connectionWeek, userId+discoveredAt (descending)

### Backend - External Integration

**T085** [US5] Implement LinkedIn recruiter search integration
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/integrations/linkedin/recruiterSearch.ts`
- **Task**: Create LinkedIn API client or web scraper to search for recruiters (NOTE: LinkedIn API limitations may require alternative approach)
- **Function**: searchRecruiters(criteria: {regions, industries, keywords}, limit): Promise<{name, company, location, industry, linkedinProfileUrl}[]>
- **Approach Options**:
  1. LinkedIn Recruiter API (if available)
  2. LinkedIn People Search API (limited)
  3. Web scraping LinkedIn search results (requires careful implementation to avoid ToS violations)
  4. Manual CSV import as fallback
- **Note**: Document API limitations and recommend manual discovery + system for tracking
- **Error Handling**: Handle rate limits, captchas, API errors gracefully

**T086** [US5] Implement connection message generation service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/messageGenerationService.ts`
- **Task**: Use Claude API to generate personalized connection messages
- **Function**: generateConnectionMessages(recruiter: {name, company, industry, location}, userProfile: {skills, targetIndustries}, count: number): Promise<string[]>
- **Logic**:
  - Call Claude API with recruiter details and user profile
  - Request [count] variations of connection messages (default 5)
  - Messages should be professional, personalized, mention mutual interests/industries, max 300 characters (LinkedIn limit)
  - Return array of message strings
- **Prompt Template**: Generate [count] professional LinkedIn connection request messages for connecting with [recruiter.name], a recruiter at [recruiter.company] in [recruiter.industry]. I am a [user.skills] professional targeting [user.targetIndustries] opportunities. Messages should be concise (<300 chars), personalized, and highlight relevant mutual interests. Return as JSON array of strings.

### Backend - Business Logic

**T087** [US5] Implement recruiter service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/recruiterService.ts`
- **Task**: Create business logic for recruiter CRUD, search, connection tracking, weekly limits
- **Functions**:
  - createRecruiter(userId, data): Promise<Recruiter>
  - getRecruiters(userId, filters): Promise<Recruiter[]>
  - getRecruiterById(userId, recruiterId): Promise<Recruiter>
  - updateRecruiter(userId, recruiterId, data): Promise<Recruiter>
  - deleteRecruiter(userId, recruiterId): Promise<void>
  - searchRecruiters(userId, criteria): Promise<Recruiter[]>
  - generateMessages(userId, recruiterId, count): Promise<string[]>
  - markConnectionSent(userId, recruiterId): Promise<Recruiter>
  - markConnected(userId, recruiterId): Promise<Recruiter>
  - markRejected(userId, recruiterId): Promise<Recruiter>
  - getWeeklyConnectionStatus(userId): Promise<{currentCount, limit, remaining, weekStartDate}>
  - checkWeeklyLimit(userId): Promise<boolean>
- **Weekly Limit Logic**:
  - When marking connection sent, check if user.currentWeekConnectionCount < user.weeklyConnectionLimit
  - If yes: increment count, set recruiter.connectionWeek to current week start, update status to 'connection_sent', set connectionSentAt
  - If no: throw error "Weekly connection limit reached"
- **Search Logic**: Call LinkedIn search integration, save results as recruiters with status 'discovered', deduplicate by linkedinProfileUrl
- **Message Generation**: Call messageGenerationService, save messages to recruiter.generatedMessages array

**T088** [US5] Implement weekly connection reset job
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/jobs/connectionReset.ts`
- **Task**: Create Agenda job to reset weekly connection counts every Monday
- **Job Name**: 'reset-weekly-connections'
- **Schedule**: Every Monday at 00:00 UTC
- **Logic**:
  - Calculate start of current week (Monday)
  - Update all users where weekStartDate < start of current week
  - Set currentWeekConnectionCount = 0, weekStartDate = start of current week
  - Log count of users reset
- **Note**: This aligns with weekly posting cycle

### Backend - API Endpoints

**T089** [US5] Implement recruiters API router
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/recruiters.ts`
- **Task**: Create Express router with endpoints: GET /, POST /, GET /:id, PUT /:id, DELETE /:id, POST /search, POST /:id/generate-messages, POST /:id/mark-sent, GET /connection-status
- **Routes**:
  - GET /recruiters: Get all recruiters with optional filter by status
  - POST /recruiters: Manually add recruiter
  - GET /recruiters/:id: Get single recruiter
  - PUT /recruiters/:id: Update recruiter (status, notes)
  - DELETE /recruiters/:id: Delete recruiter
  - POST /recruiters/search: Search for recruiters with criteria (regions, industries, keywords, limit)
  - POST /recruiters/:id/generate-messages: Generate connection messages for recruiter
  - POST /recruiters/:id/mark-sent: Mark connection request as sent (checks weekly limit)
  - GET /recruiters/connection-status: Get current weekly connection status
- **Middleware**: All routes require auth middleware
- **Validation**: Validate inputs, check weekly limit before marking sent

### Frontend - API Client

**T090** [US5] [P] Implement recruiters API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/recruitersApi.ts`
- **Task**: Create functions for all recruiter endpoints
- **Functions**:
  - getRecruiters(filters?): Promise<Recruiter[]>
  - getRecruiterById(id): Promise<Recruiter>
  - createRecruiter(data): Promise<Recruiter>
  - updateRecruiter(id, data): Promise<Recruiter>
  - deleteRecruiter(id): Promise<void>
  - searchRecruiters(criteria): Promise<Recruiter[]>
  - generateMessages(id, count?): Promise<{messages: string[]}>
  - markConnectionSent(id): Promise<Recruiter>
  - getConnectionStatus(): Promise<{currentCount, limit, remaining, weekStartDate}>
- **Error Handling**: Handle weekly limit errors, display messages

### Frontend - Components

**T091** [US5] [P] Implement Recruiter card component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Recruiters/RecruiterCard.tsx`
- **Task**: Create card to display recruiter with connection status and actions
- **Props**: recruiter: Recruiter, onGenerateMessages, onMarkSent, onMarkConnected, onView
- **UI**: Ant Design Card with name (title), company (subtitle), location, industry, status badge, LinkedIn profile link (external), action buttons based on status
- **Actions by Status**:
  - discovered: Generate Messages, Mark as Sent, View Profile
  - connection_sent: Mark as Connected, Mark as Rejected, View Profile
  - connected: View Profile, Add to Opportunity
  - rejected: Remove
- **Badges**: Color-coded status tags (discovered: blue, connection_sent: orange, connected: green, rejected: red)

**T092** [US5] [P] Implement Connection messages modal component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Recruiters/ConnectionMessagesModal.tsx`
- **Task**: Create modal to display generated connection messages with copy button
- **Props**: visible, recruiter, messages: string[], onCancel, onMarkSent
- **UI**: Ant Design Modal, display recruiter name and company, list messages with copy button for each, Mark as Sent button at bottom
- **Features**: Click copy → copy to clipboard → show notification, Click Mark as Sent → call API → update recruiter status → close modal
- **Loading**: Show loading while generating messages

**T093** [US5] [P] Implement Recruiter search modal component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Recruiters/RecruiterSearchModal.tsx`
- **Task**: Create modal with search form for finding recruiters
- **Props**: visible, onCancel, onSearchComplete(results)
- **UI**: Ant Design Modal with Form, fields: regions (select multiple from LATAM countries), industries (select multiple), keywords (tags input), limit (number, default 20)
- **Features**: Submit → call search API → show loading → display results count → close modal
- **Note**: May show disclaimer about LinkedIn API limitations and suggest manual discovery

**T094** [US5] [P] Implement Recruiter detail drawer component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Recruiters/RecruiterDetailDrawer.tsx`
- **Task**: Create drawer to show full recruiter details, messages, and notes
- **Props**: visible, recruiter, onClose
- **UI**: Ant Design Drawer, display all recruiter fields, generated messages with used status, status timeline (discovered → sent → connected), notes textarea, LinkedIn profile link
- **Actions**: Edit notes, View messages, Change status, Link to opportunity (if connected)

**T095** [US5] Implement weekly connection limit widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Recruiters/ConnectionLimitWidget.tsx`
- **Task**: Create widget to display weekly connection status
- **Props**: currentCount: number, limit: number, weekStartDate: string
- **UI**: Ant Design Progress (circle or bar), show X/100 connections this week, color-coded (green if < 80%, yellow if 80-95%, red if >= 95%)
- **Features**: Show week start date, show days until reset, warning if near limit

### Frontend - Recruiters Page

**T096** [US5] Implement Recruiters page
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/Recruiters.tsx`
- **Task**: Create page to search recruiters, view profiles, display messages, track connections
- **UI**:
  - Page header with title "Recruiter Discovery", Search button, Add Manually button, Connection limit widget
  - Filters: status select, company search, location search
  - Grid view of RecruiterCard components (Ant Design Row/Col)
  - Pagination if > 50 recruiters
- **Features**:
  - Click Search → open search modal → show results → add to list
  - Click card → open detail drawer
  - Click Generate Messages → generate → show messages modal
  - Click Mark as Sent → check limit → update status → refresh list
  - Click Add Manually → open form modal → create recruiter
- **State**: Load recruiters on mount, load connection status, refresh after operations
- **Warnings**: Show alert if weekly limit reached, show alert if LinkedIn integration not connected

**⚠️ CHECKPOINT US5**: Recruiter discovery complete

---

## Phase 6: US3 - Interview and Study Schedule Management (P3)

**Goal**: Manual appointments, iCalendar import, notifications

**Independent Test**: User can add appointment → import calendar → receive notifications

### Backend - Data Models

**T097** [US3] [P] Implement Appointment model
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/models/Appointment.ts`
- **Task**: Create Appointment schema with fields: userId, title, description, type, startTime, endTime, allDay, source, externalEventId, icalendarUrl, jobOpportunityId, company, notificationSent, notificationSentAt, location, attendees, createdAt, updatedAt
- **Validation**: title required (1-200 chars), type enum [interview, study_session], startTime < endTime, source enum [manual, icalendar], notificationSent default false
- **Indexes**: userId+startTime, userId+type+startTime, startTime (for notification queries), externalEventId+icalendarUrl (unique composite for deduplication)

**T098** [US3] [P] Implement ICalendarSync model
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/models/ICalendarSync.ts`
- **Task**: Create ICalendarSync schema with fields: userId, name, icalendarUrl, enabled, lastSyncAt, lastSuccessfulSyncAt, syncStatus, errorMessage, eventCount, createdAt, updatedAt
- **Validation**: name required (1-100 chars), icalendarUrl required (valid URL), syncStatus enum [pending, success, error], eventCount >= 0
- **Indexes**: userId, userId+enabled+lastSyncAt (for sync job queries)

### Backend - External Integration

**T099** [US3] Implement iCalendar parser integration
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/integrations/icalendar.ts`
- **Task**: Create iCalendar parser to fetch and parse .ics files
- **Library**: node-ical
- **Functions**:
  - fetchICalendar(url: string): Promise<string> - HTTP GET to fetch .ics file
  - parseICalendar(icsContent: string): Promise<{uid, title, description, startTime, endTime, location, attendees}[]> - Parse VEVENT entries
- **Features**: Handle recurring events (expand or skip), handle timezones, deduplicate by UID
- **Error Handling**: Handle network errors, invalid URLs, malformed .ics files

**T100** [US3] Implement email notification service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/integrations/notifications/email.ts`
- **Task**: Create email sender for appointment notifications
- **Library**: nodemailer
- **Function**: sendAppointmentReminder(to: string, appointment: {title, startTime, location, company}): Promise<void>
- **Configuration**: Use SMTP settings from env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- **Template**: Professional HTML email with appointment details, calendar .ics attachment (optional)
- **Error Handling**: Log errors, retry once, mark as failed if still errors

**T101** [US3] Implement desktop notification service (optional)
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/integrations/notifications/desktop.ts`
- **Task**: Create Web Push notification sender for desktop/mobile notifications
- **Library**: web-push
- **Function**: sendDesktopNotification(subscription: object, appointment: {title, startTime}): Promise<void>
- **Configuration**: Use VAPID keys from env vars
- **Note**: Requires user to grant notification permission in frontend and send subscription to backend
- **Error Handling**: Handle expired subscriptions, remove invalid subscriptions from user record

### Backend - Business Logic

**T102** [US3] Implement appointment service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/appointmentService.ts`
- **Task**: Create business logic for Appointment CRUD and notification management
- **Functions**:
  - createAppointment(userId, data): Promise<Appointment>
  - getAppointments(userId, filters): Promise<Appointment[]>
  - getAppointmentById(userId, appointmentId): Promise<Appointment>
  - updateAppointment(userId, appointmentId, data): Promise<Appointment>
  - deleteAppointment(userId, appointmentId): Promise<void>
  - getUpcomingAppointments(userId, days: number): Promise<Appointment[]>
  - getTodayAppointments(userId): Promise<Appointment[]>
  - getTomorrowAppointments(userId): Promise<Appointment[]>
- **Validation**: Validate startTime < endTime, type is valid enum, check ownership
- **Timezone**: Convert user timezone to UTC for storage, convert back to user timezone for display

**T103** [US3] Implement calendar sync service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/calendarSyncService.ts`
- **Task**: Create business logic for iCalendar sync management
- **Functions**:
  - createSync(userId, name, icalendarUrl): Promise<ICalendarSync>
  - getSyncs(userId): Promise<ICalendarSync[]>
  - updateSync(userId, syncId, data): Promise<ICalendarSync>
  - deleteSync(userId, syncId): Promise<void>
  - syncCalendar(syncId): Promise<{eventCount, status, errorMessage?}>
  - syncAllCalendars(userId): Promise<void>
- **Sync Logic**:
  - Fetch iCalendar from URL
  - Parse events
  - For each event: check if exists by externalEventId+icalendarUrl → create or update appointment
  - Update ICalendarSync with lastSyncAt, syncStatus, eventCount
  - Mark source as 'icalendar' for imported appointments
- **Deduplication**: Use externalEventId (UID from .ics) + icalendarUrl to avoid duplicates
- **Error Handling**: Catch errors, update syncStatus to 'error', store errorMessage

**T104** [US3] Implement notification service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/notificationService.ts`
- **Task**: Create unified notification service to send appointment reminders via multiple channels
- **Functions**:
  - sendAppointmentNotification(userId, appointmentId): Promise<void>
  - getNotificationPreferences(userId): Promise<{email, desktop}>
- **Logic**:
  - Get user notification preferences
  - Get appointment details
  - If email enabled: call email notification service
  - If desktop enabled and subscription exists: call desktop notification service
  - Mark appointment.notificationSent = true, notificationSentAt = now
- **Error Handling**: Log failures but don't fail entire operation if one channel fails

### Backend - Scheduled Jobs

**T105** [US3] Implement calendar sync job
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/jobs/calendarSync.ts`
- **Task**: Create Agenda job to sync external calendars every 6 hours
- **Job Name**: 'sync-calendars'
- **Schedule**: Every 6 hours
- **Logic**:
  - Query all ICalendarSync with enabled = true
  - For each sync: call calendarSyncService.syncCalendar(syncId)
  - Log success/failure per sync
- **Concurrency**: Process one sync at a time to avoid rate limits

**T106** [US3] Implement appointment notification job
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/jobs/appointmentNotifications.ts`
- **Task**: Create Agenda job to send appointment reminders 1 hour before
- **Job Name**: 'send-appointment-notifications'
- **Schedule**: Every 5 minutes
- **Logic**:
  - Query appointments where notificationSent = false and startTime is between now+55min and now+65min
  - For each appointment: call notificationService.sendAppointmentNotification(userId, appointmentId)
  - Log success/failure per notification
- **User Preferences**: Check user notification preferences before sending
- **Timezone Handling**: Query uses UTC, compare to current time

### Backend - API Endpoints

**T107** [US3] Implement calendar API router
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/calendar.ts`
- **Task**: Create Express router with endpoints for appointments and iCalendar sync
- **Routes**:
  - GET /appointments: Get appointments with filters (startDate, endDate, type)
  - POST /appointments: Create new appointment
  - GET /appointments/:id: Get single appointment
  - PUT /appointments/:id: Update appointment
  - DELETE /appointments/:id: Delete appointment
  - GET /icalendar: Get all calendar syncs
  - POST /icalendar: Add new calendar sync
  - PUT /icalendar/:id: Update calendar sync (enable/disable)
  - DELETE /icalendar/:id: Delete calendar sync
  - POST /icalendar/:id/sync: Manually trigger sync
- **Middleware**: All routes require auth middleware
- **Validation**: Validate dates, types, URLs

### Frontend - API Client

**T108** [US3] [P] Implement calendar API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/calendarApi.ts`
- **Task**: Create functions for all calendar endpoints
- **Functions**:
  - getAppointments(filters?): Promise<Appointment[]>
  - getAppointmentById(id): Promise<Appointment>
  - createAppointment(data): Promise<Appointment>
  - updateAppointment(id, data): Promise<Appointment>
  - deleteAppointment(id): Promise<void>
  - getCalendarSyncs(): Promise<ICalendarSync[]>
  - createCalendarSync(name, url): Promise<ICalendarSync>
  - updateCalendarSync(id, data): Promise<ICalendarSync>
  - deleteCalendarSync(id): Promise<void>
  - triggerSync(id): Promise<{syncStatus, eventCount}>
- **Error Handling**: Handle API errors, display messages

### Frontend - Components

**T109** [US3] [P] Implement Calendar view component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Calendar/CalendarView.tsx`
- **Task**: Create calendar view using Ant Design Calendar to display appointments
- **Props**: appointments: Appointment[], onDateSelect(date), onAppointmentClick(appointment)
- **UI**: Ant Design Calendar in month view, render appointment dots/badges on dates with appointments, show appointment titles on hover
- **Features**: Color-code by type (interview: blue, study_session: green), click date → show day view with appointment list, click appointment → open detail drawer

**T110** [US3] [P] Implement Appointment list component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Calendar/AppointmentList.tsx`
- **Task**: Create list view of appointments for selected date
- **Props**: appointments: Appointment[], date: Date, onAppointmentClick(appointment)
- **UI**: Ant Design List with appointment cards sorted by startTime, show time, title, type badge, company (if interview)
- **Empty State**: "No appointments scheduled for this date"

**T111** [US3] [P] Implement Appointment form modal component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Calendar/AppointmentFormModal.tsx`
- **Task**: Create modal with form to create/edit appointments
- **Props**: visible, appointment (null for create), onCancel, onSubmit
- **UI**: Ant Design Modal with Form, fields: title (required), description (textarea), type (radio: interview/study_session), startTime (datetime picker), endTime (datetime picker), allDay (checkbox), company (text, show if type=interview), location (text), attendees (tags input for emails), jobOpportunityId (select from opportunities)
- **Validation**: Title required, startTime < endTime, future date validation
- **Features**: If type=interview, show company and jobOpportunityId fields; datetime pickers respect user timezone

**T112** [US3] [P] Implement Appointment detail drawer component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Calendar/AppointmentDetailDrawer.tsx`
- **Task**: Create drawer to show full appointment details
- **Props**: visible, appointment, onClose
- **UI**: Ant Design Drawer, display all appointment fields, show linked job opportunity (if exists), show source (manual/icalendar), show notification status
- **Actions**: Edit button, Delete button, Add to Calendar button (download .ics), Join Link button (if location is URL)

**T113** [US3] [P] Implement Calendar sync settings component
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Calendar/CalendarSyncSettings.tsx`
- **Task**: Create settings panel to manage iCalendar syncs
- **Props**: syncs: ICalendarSync[], onAdd, onEdit, onDelete, onSync
- **UI**: Ant Design List with sync entries, show name, URL, last sync time, status badge, event count, enable/disable switch, Sync Now button, Delete button
- **Actions**: Add New Sync button → open form modal with name and URL → create sync → refresh list
- **Status Indicators**: Color-coded badges (pending: blue, success: green, error: red)

### Frontend - Calendar Page

**T114** [US3] Implement Calendar page
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/Calendar.tsx`
- **Task**: Create page to view appointments in calendar, add manually, configure iCalendar sync
- **UI**:
  - Page header with title "Calendar", Create Appointment button, Configure Sync button
  - Main area: CalendarView component showing current month
  - Side panel: AppointmentList for selected date (default today)
  - Bottom drawer/modal: CalendarSyncSettings
- **State**: Load appointments on mount, filter by selected date range, refresh after operations
- **Features**:
  - Click date in calendar → show appointments for that date in side panel
  - Click Create → open appointment form modal
  - Click Configure Sync → open sync settings drawer
  - Click appointment → open detail drawer
  - Auto-refresh every 5 minutes to show newly synced appointments

**⚠️ CHECKPOINT US3**: Calendar management complete

---

## Phase 7: US4 - Centralized Dashboard (P4)

**Goal**: Aggregate metrics from all features

**Independent Test**: User sees weekly posts, pipeline counts, appointments, connections, SSI score

### Backend - Business Logic

**T115** [US4] Implement dashboard service
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/dashboardService.ts`
- **Task**: Create service to aggregate data from all entities for dashboard
- **Function**: getDashboardData(userId): Promise<Dashboard>
- **Aggregations**:
  - weeklyPostCount: Count posts with status 'scheduled' or 'published' where createdAt >= start of week
  - weeklyPostTarget: Always 5
  - linkedinSSI: Get from User.linkedinIntegration.ssiScore
  - upcomingPosts: Get next 5 posts with status 'scheduled', sorted by scheduledAt
  - pipelineCounts: Aggregate opportunities by stage (exclude archived), return { [stage]: count }
  - todayAppointments: Get appointments where startTime is today
  - tomorrowAppointments: Get appointments where startTime is tomorrow
  - weeklyConnectionCount: Get from User.currentWeekConnectionCount
  - weeklyConnectionLimit: Get from User.weeklyConnectionLimit
  - recentRecruiters: Get last 5 recruiters with status 'discovered' or 'connection_sent', sorted by createdAt descending
- **Optimization**: Use MongoDB aggregation pipelines where possible, cache results for 5 minutes

### Backend - API Endpoint

**T116** [US4] Implement dashboard API router
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/dashboard.ts`
- **Task**: Create Express router with single endpoint: GET /dashboard
- **Route**: GET /dashboard - Returns aggregated dashboard data
- **Middleware**: Require auth middleware
- **Response**: { weeklyPostCount, weeklyPostTarget, linkedinSSI, upcomingPosts, pipelineCounts, todayAppointments, tomorrowAppointments, weeklyConnectionCount, weeklyConnectionLimit, recentRecruiters }
- **Caching**: Consider adding cache header (max-age: 300) for 5 minute cache

### Frontend - API Client

**T117** [US4] [P] Implement dashboard API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/dashboardApi.ts`
- **Task**: Create function to fetch dashboard data
- **Function**: getDashboard(): Promise<Dashboard>
- **Error Handling**: Handle API errors, show fallback UI

### Frontend - Dashboard Widgets

**T118** [US4] [P] Implement Weekly Posts widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Dashboard/WeeklyPostsWidget.tsx`
- **Task**: Create widget to show weekly posting progress
- **Props**: currentCount: number, target: number
- **UI**: Ant Design Card with title "Weekly Posts", Progress component (circle or bar), X/5 posts this week, link to Content Kanban
- **Color Coding**: Red if < 3, yellow if 3-4, green if 5
- **Actions**: Click widget → navigate to Content Kanban

**T119** [US4] [P] Implement LinkedIn SSI widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Dashboard/SSIWidget.tsx`
- **Task**: Create widget to display LinkedIn SSI score
- **Props**: ssiScore: number, lastUpdated: Date
- **UI**: Ant Design Card with title "LinkedIn SSI", large score display (0-100), progress bar, last updated timestamp, link to LinkedIn settings
- **Color Coding**: Score-based color (0-30: red, 31-60: yellow, 61-100: green)
- **Empty State**: "Connect LinkedIn to see your SSI score"

**T120** [US4] [P] Implement Pipeline Summary widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Dashboard/PipelineSummaryWidget.tsx`
- **Task**: Create widget to show job pipeline stage counts
- **Props**: pipelineCounts: {[stage]: count}
- **UI**: Ant Design Card with title "Job Pipeline", bar chart or list showing count per stage, link to Pipeline Kanban
- **Chart**: Use Ant Design Statistic or simple bar chart, only show non-archived stages
- **Actions**: Click widget → navigate to Pipeline Kanban

**T121** [US4] [P] Implement Today's Appointments widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Dashboard/TodayAppointmentsWidget.tsx`
- **Task**: Create widget to show today's appointments
- **Props**: appointments: Appointment[]
- **UI**: Ant Design Card with title "Today's Appointments", list of appointments with time and title, link to Calendar
- **Empty State**: "No appointments today"
- **Actions**: Click appointment → open detail drawer, Click widget title → navigate to Calendar

**T122** [US4] [P] Implement Upcoming Posts widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Dashboard/UpcomingPostsWidget.tsx`
- **Task**: Create widget to show next scheduled posts
- **Props**: posts: Post[]
- **UI**: Ant Design Card with title "Upcoming Posts", list of next 5 scheduled posts with scheduled time and content preview, link to Content Kanban
- **Empty State**: "No posts scheduled"
- **Actions**: Click post → navigate to Content Kanban with post selected

**T123** [US4] [P] Implement Connection Status widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Dashboard/ConnectionStatusWidget.tsx`
- **Task**: Create widget to show weekly connection status
- **Props**: currentCount: number, limit: number
- **UI**: Ant Design Card with title "Weekly Connections", progress bar, X/100 connections, link to Recruiters page
- **Color Coding**: Green if < 80%, yellow if 80-95%, red if >= 95%
- **Actions**: Click widget → navigate to Recruiters page

**T124** [US4] [P] Implement Recent Recruiters widget
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Dashboard/RecentRecruitersWidget.tsx`
- **Task**: Create widget to show recently discovered recruiters
- **Props**: recruiters: Recruiter[]
- **UI**: Ant Design Card with title "Recent Recruiters", list of last 5 recruiters with name, company, status badge, link to Recruiters page
- **Empty State**: "No recruiters discovered yet"
- **Actions**: Click recruiter → navigate to Recruiters page with recruiter selected

### Frontend - Dashboard Page

**T125** [US4] Implement Dashboard page
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/Dashboard.tsx`
- **Task**: Create dashboard page with all widgets in grid layout
- **UI**:
  - Page header with title "Dashboard", welcome message with user name
  - Grid layout using Ant Design Row/Col (responsive)
  - Top row: WeeklyPostsWidget, SSIWidget, ConnectionStatusWidget
  - Middle row: PipelineSummaryWidget (spans 2 cols), TodayAppointmentsWidget
  - Bottom row: UpcomingPostsWidget, RecentRecruitersWidget
- **State**: Load dashboard data on mount, auto-refresh every 5 minutes
- **Loading**: Show skeleton loaders while fetching data
- **Error Handling**: Show error message if data fetch fails, retry button

**⚠️ CHECKPOINT US4**: Dashboard complete - full system integrated

---

## Phase 8: Polish & Integration

**Goal**: Add production-ready features, error handling, and UX improvements

### Backend - Middleware & Utilities

**T126** [Polish] [P] Implement request logging middleware
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/logger.ts`
- **Task**: Create Express middleware to log all requests with method, path, status, duration
- **Library**: Consider morgan or custom implementation
- **Format**: JSON format with timestamp, method, path, status, duration, userId (if authenticated)
- **Output**: Console in development, file/stream in production

**T127** [Polish] [P] Implement rate limiting middleware
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/rateLimit.ts`
- **Task**: Create rate limiting middleware to prevent abuse
- **Library**: express-rate-limit
- **Limits**:
  - General API: 100 requests per 15 minutes per IP
  - Auth endpoints: 5 requests per 15 minutes per IP
  - Content generation: 10 requests per hour per user
- **Response**: Return 429 Too Many Requests with Retry-After header

**T128** [Polish] [P] Implement request sanitization middleware
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/sanitize.ts`
- **Task**: Create middleware to sanitize user inputs to prevent XSS and NoSQL injection
- **Library**: express-mongo-sanitize, xss-clean
- **Apply**: Add to middleware chain before route handlers

**T129** [Polish] [P] Implement health check endpoint
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/health.ts`
- **Task**: Create health check endpoint for monitoring
- **Route**: GET /health - Returns { status: 'ok', timestamp, uptime, database: 'connected' }
- **Checks**: Verify database connection, return 503 if unhealthy
- **Security**: No auth required (public endpoint)

**T130** [Polish] Implement graceful shutdown handler
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/utils/shutdown.ts`
- **Task**: Create graceful shutdown handler for SIGTERM/SIGINT signals
- **Actions**: Close database connections, stop scheduled jobs, drain HTTP connections, exit process
- **Timeout**: Force exit after 30 seconds if shutdown doesn't complete

### Backend - Testing & Documentation

**T131** [Polish] Create API documentation with Swagger UI
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/docs.ts`
- **Task**: Serve OpenAPI spec with Swagger UI
- **Library**: swagger-ui-express
- **Route**: GET /api/v1/docs - Serve Swagger UI with OpenAPI spec from contracts/openapi.yaml
- **Features**: Interactive API testing, authentication support

**T132** [Polish] [P] Add database seed script
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/scripts/seed.ts`
- **Task**: Create script to seed database with sample data for development
- **Data**: Sample user, post ideas, posts, opportunities, appointments, recruiters
- **Usage**: npm run seed (dev only)

### Frontend - UX Enhancements

**T133** [Polish] [P] Implement global loading state
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/LoadingOverlay.tsx`
- **Task**: Create full-page loading overlay for async operations
- **UI**: Ant Design Spin component, centered, with backdrop
- **Usage**: Show during initial auth check, data loading, or long operations

**T134** [Polish] [P] Implement global error boundary
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/ErrorBoundary.tsx`
- **Task**: Create React error boundary to catch rendering errors
- **UI**: Display error message with reload button, log error to console
- **Features**: Different error pages for 404, 500, network errors

**T135** [Polish] [P] Implement notification system
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/utils/notifications.ts`
- **Task**: Create global notification utility using Ant Design notification/message
- **Functions**: showSuccess(message), showError(message), showWarning(message), showInfo(message)
- **Usage**: Import and call throughout app for user feedback

**T136** [Polish] [P] Add loading skeletons to all pages
- **Files**: All page components in `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/`
- **Task**: Replace loading spinners with Ant Design Skeleton for better UX
- **UI**: Skeleton matches actual content layout (cards, lists, tables)

**T137** [Polish] [P] Add empty states to all lists
- **Files**: All list/table components
- **Task**: Create meaningful empty states with icons, messages, and action buttons
- **UI**: Ant Design Empty component with custom descriptions and call-to-action
- **Examples**: "No posts yet. Create your first post!", "No appointments scheduled. Add one now!"

**T138** [Polish] [P] Implement responsive design improvements
- **Files**: All page and component files
- **Task**: Ensure all pages work well on mobile/tablet devices
- **Changes**: Responsive grid layouts, mobile-friendly modals (use drawers on mobile), touch-friendly buttons
- **Testing**: Test on mobile viewport sizes (375px, 768px, 1024px)

**T139** [Polish] [P] Add keyboard shortcuts
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/hooks/useKeyboardShortcuts.ts`
- **Task**: Create hook to add keyboard shortcuts for common actions
- **Shortcuts**:
  - Ctrl+K: Open command palette (future)
  - Ctrl+N: Create new post/opportunity (context-aware)
  - Ctrl+/: Show keyboard shortcuts help
- **UI**: Show keyboard shortcuts in tooltips

**T140** [Polish] Implement dark mode support (optional)
- **Files**: Theme configuration, all pages
- **Task**: Add dark mode theme toggle
- **Implementation**: Use Ant Design theme switching, store preference in localStorage
- **UI**: Toggle in header or settings page

### Frontend - Settings Page

**T141** [Polish] Implement Settings page
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/pages/Settings.tsx`
- **Task**: Create settings page for user profile, LinkedIn connection, notification preferences
- **UI**:
  - Page header with title "Settings"
  - Tabs: Profile, LinkedIn Integration, Notifications, Preferences
  - Profile tab: Edit name, email, timezone, skills, target industries/regions
  - LinkedIn Integration tab: LinkedInSettings component
  - Notifications tab: Toggle email/desktop notifications, set reminder time before appointments
  - Preferences tab: Weekly connection limit, weekly post target, language (future)
- **Features**: Auto-save on change or Save button per section
- **Validation**: Email format, timezone valid, connection limit 1-200

**T142** [Polish] [P] Implement user profile form
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Settings/ProfileForm.tsx`
- **Task**: Create form to edit user profile
- **Props**: user: User, onSubmit
- **UI**: Ant Design Form with fields: name, email (disabled), timezone (select), skills (tags), target industries (tags), target regions (select multiple)
- **Validation**: Name required, timezone required
- **Features**: Timezone dropdown with search, skills/industries tag creation

**T143** [Polish] [P] Implement notification preferences form
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/components/Settings/NotificationPreferencesForm.tsx`
- **Task**: Create form to configure notification preferences
- **Props**: notifications: NotificationPreferences, onSubmit
- **UI**: Ant Design Form with toggles: enable email notifications, enable desktop notifications, appointment reminder time (slider 15-120 minutes)
- **Features**: Test notification button to send sample notification

**T144** [Polish] Implement user settings API
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/api/settings.ts`
- **Task**: Create Express router to update user settings
- **Routes**:
  - PUT /settings/profile: Update name, timezone, skills, target industries/regions
  - PUT /settings/notifications: Update notification preferences
  - PUT /settings/limits: Update weekly connection limit
- **Middleware**: Require auth middleware
- **Validation**: Validate all inputs, check valid timezone

**T145** [Polish] [P] Implement settings API client
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/services/settingsApi.ts`
- **Task**: Create functions to update user settings
- **Functions**:
  - updateProfile(data): Promise<User>
  - updateNotificationPreferences(data): Promise<User>
  - updateLimits(data): Promise<User>
- **Error Handling**: Handle API errors, show notifications

### Testing & Quality

**T146** [Polish] Add environment-specific configurations
- **Files**: `/Users/francine/My Repositories/pds-girl-coder/backend/.env.development`, `.env.production.example`
- **Task**: Create environment-specific config files
- **Development**: Local MongoDB, debug logging, mock external services
- **Production**: Remote MongoDB, production logging, real external services

**T147** [Polish] [P] Create deployment documentation
- **File**: `/Users/francine/My Repositories/pds-girl-coder/docs/DEPLOYMENT.md`
- **Task**: Document deployment process for production
- **Sections**: Prerequisites, environment setup, database migration, build process, deployment steps, monitoring, troubleshooting
- **Platforms**: Consider documenting for common platforms (Heroku, Railway, AWS, Vercel)

**T148** [Polish] [P] Create developer setup guide
- **File**: `/Users/francine/My Repositories/pds-girl-coder/docs/DEVELOPMENT.md`
- **Task**: Document local development setup
- **Sections**: Prerequisites, installation, running locally, project structure, coding standards, contribution guidelines

### Security Enhancements

**T149** [Polish] Implement password reset flow
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/passwordResetService.ts`
- **Task**: Create password reset with email token
- **Functions**: requestPasswordReset(email), resetPassword(token, newPassword)
- **Flow**: User enters email → generate token → send email → user clicks link → enter new password → validate token → update password
- **Security**: Token expires in 1 hour, hash token before storing, invalidate after use

**T150** [Polish] Add email verification for new users
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/services/emailVerificationService.ts`
- **Task**: Require email verification after registration
- **Flow**: User registers → send verification email → user clicks link → verify token → activate account
- **Security**: Token expires in 24 hours, users can't use most features until verified

**T151** [Polish] Implement HTTPS enforcement in production
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/https.ts`
- **Task**: Create middleware to redirect HTTP to HTTPS in production
- **Logic**: Check X-Forwarded-Proto header, redirect if not https
- **Environment**: Only apply in production

**T152** [Polish] Add helmet.js for security headers
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/app.ts`
- **Task**: Add helmet middleware for security headers
- **Library**: helmet
- **Headers**: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security

### Performance Optimization

**T153** [Polish] Implement API response caching
- **File**: `/Users/francine/My Repositories/pds-girl-coder/backend/src/middleware/cache.ts`
- **Task**: Add caching layer for GET endpoints
- **Library**: node-cache or Redis
- **Strategy**: Cache dashboard data (5 min), cache user profile (10 min), invalidate on updates
- **Headers**: Add Cache-Control headers

**T154** [Polish] Add database query optimization
- **Files**: All service files
- **Task**: Review and optimize MongoDB queries
- **Optimizations**: Add indexes for common queries, use projection to limit fields returned, use aggregation pipelines for complex queries
- **Monitoring**: Log slow queries (>100ms)

**T155** [Polish] Implement lazy loading for frontend routes
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/src/App.tsx`
- **Task**: Use React.lazy and Suspense to lazy load page components
- **Benefits**: Reduce initial bundle size, faster first load
- **Implementation**: Wrap lazy-loaded components with Suspense + loading fallback

**T156** [Polish] Optimize frontend bundle size
- **File**: `/Users/francine/My Repositories/pds-girl-coder/frontend/vite.config.ts`
- **Task**: Configure code splitting and tree shaking
- **Optimizations**: Split vendor chunks, analyze bundle size, remove unused dependencies
- **Tools**: Use vite-plugin-bundle-analyzer to identify large dependencies

### Monitoring & Observability

**T157** [Polish] Add application logging
- **Files**: All backend service files
- **Task**: Add structured logging throughout application
- **Levels**: DEBUG, INFO, WARN, ERROR
- **Context**: Include userId, requestId, timestamp in all logs
- **Output**: Console in dev, file/log service in production

---

## Dependencies

```
Phase 1 (Setup)
  ↓
Phase 2 (Foundation) ← BLOCKING for all user stories
  ↓
Phase 3 (US1 - Content) ← MVP SCOPE
  ↓ (independent)
Phase 4 (US2 - Pipeline)
  ↓ (independent)
Phase 5 (US5 - Recruiters)
  ↓ (independent)
Phase 6 (US3 - Calendar)
  ↓ (requires all data sources)
Phase 7 (US4 - Dashboard)
  ↓
Phase 8 (Polish)
```

User Stories US1, US2, US3, US5 are **independent** after Phase 2 completes.
US4 (Dashboard) depends on US1, US2, US3, US5 being complete.

---

## Parallel Execution Examples

### Phase 1 (Setup) Parallelization:
- All backend setup tasks (T001-T006) can run in parallel
- All frontend setup tasks (T007-T013) can run in parallel
- Repository config tasks (T014-T016) can run in parallel

### Phase 2 (Foundation) Parallelization:
- Database config (T017-T018) can run in parallel
- Core utilities (T019-T022) can run in parallel
- Frontend type definitions (T034) and token storage (T036) can run in parallel
- React components (T039-T040) can run in parallel after API client is ready

### Phase 3 (US1) Parallelization:
- Models (T044-T045) can run in parallel
- API clients (T061-T063) can run in parallel
- Shared components (T064-T065) can run in parallel
- Form modals (T066, T069) can run in parallel
- Settings components (T074) independent

### Phase 4 (US2) Parallelization:
- API client (T078) and components (T079-T081) can run in parallel after backend is ready

### Phase 5 (US5) Parallelization:
- API client (T090) and components (T091-T095) can run in parallel after backend is ready

### Phase 6 (US3) Parallelization:
- Models (T097-T098) can run in parallel
- API client (T108) and components (T109-T113) can run in parallel after backend is ready

### Phase 7 (US4) Parallelization:
- API client (T117) and all widgets (T118-T124) can run in parallel after backend is ready

### Phase 8 (Polish) Parallelization:
- Most polish tasks are independent and can run in parallel
- Backend middleware (T126-T129) can run in parallel
- Frontend UX tasks (T133-T140) can run in parallel
- Settings components (T142-T143, T145) can run in parallel

### Across Phases:
After Phase 2, teams can work on US1, US2, US5 simultaneously since they're independent. US3 can also be developed in parallel. US4 should wait until data sources exist to avoid rework.

---

## Implementation Strategy

1. **MVP First**: Complete Phase 1 → Phase 2 → Phase 3 (US1) for initial launch
   - This delivers core value: LinkedIn content management with AI generation
   - Can be tested and deployed independently
   - Estimated: 40-50 tasks for MVP

2. **Incremental Delivery**: Add US2, US5, US3 in subsequent releases
   - US2 (Pipeline): Add job tracking capability
   - US5 (Recruiters): Add networking automation
   - US3 (Calendar): Add time management features
   - Each can be released independently as they complete

3. **Dashboard Last**: Complete US4 after all data sources exist
   - Dashboard aggregates data from all features
   - Provides maximum value when all features are functional
   - Can start building dashboard as features complete

4. **Polish Continuously**: Integrate Phase 8 tasks throughout development
   - Don't wait until end to add error handling, loading states, etc.
   - Add polish tasks as you complete each feature
   - Security and monitoring should be included from the start

---

## Task Summary

- **Total Tasks**: 157
- **Phase 1 (Setup)**: 16 tasks
- **Phase 2 (Foundation)**: 27 tasks - BLOCKING
- **Phase 3 (US1 - MVP)**: 31 tasks
- **Phase 4 (US2)**: 9 tasks
- **Phase 5 (US5)**: 13 tasks
- **Phase 6 (US3)**: 18 tasks
- **Phase 7 (US4)**: 11 tasks
- **Phase 8 (Polish)**: 32 tasks

**Parallelizable Tasks**: ~65% marked with [P]

---

## Implementation Notes

### MVP Scope (Phase 1 + 2 + 3)
The minimum viable product consists of 74 tasks (47% of total) and delivers:
- Complete LinkedIn content management system
- AI-powered post generation
- Scheduling and auto-publishing
- Kanban for content organization
- Weekly posting goals and tracking
- SSI score monitoring

This represents the core value proposition and can be launched independently.

### Testing Strategy
While no explicit test tasks are included (per instructions), consider:
- Manual testing each user story after completion
- End-to-end testing of critical paths (auth, post creation, LinkedIn publishing)
- Integration testing of external services (Claude API, LinkedIn API)
- Load testing for scheduled jobs

### External Service Dependencies
Key integrations that may require special attention:
- **Claude API**: For content generation and topic suggestions
- **LinkedIn API**: For OAuth, posting, SSI, metrics (note API limitations)
- **Email Service**: For notifications (SMTP or service like SendGrid)
- **iCalendar**: For calendar import (standard format, well supported)

### Deployment Considerations
- Backend requires: Node.js 22 runtime, MongoDB 7 database, environment variables for API keys
- Frontend requires: Static file hosting (Vercel, Netlify, etc.) or Node.js server
- Scheduled jobs require: Persistent backend process (not serverless functions)
- Notifications require: Email service configuration, Web Push service (optional)

### Estimated Timeline
Based on task complexity and dependencies:
- **Phase 1 (Setup)**: 2-3 days
- **Phase 2 (Foundation)**: 5-7 days (blocking)
- **Phase 3 (US1 MVP)**: 10-14 days
- **Phase 4 (US2)**: 4-5 days
- **Phase 5 (US5)**: 5-7 days
- **Phase 6 (US3)**: 7-9 days
- **Phase 7 (US4)**: 3-4 days
- **Phase 8 (Polish)**: 8-10 days (continuous)

**Total estimated timeline**: 8-12 weeks for full implementation with single developer, 4-6 weeks with 2-3 developers working in parallel on independent user stories.
