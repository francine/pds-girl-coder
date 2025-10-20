# Quickstart Guide: International Job Search Management System

**Date**: 2025-10-12
**Branch**: `001-crie-um-sistema`

## Prerequisites

- **Node.js**: 22.x LTS ([Download](https://nodejs.org/))
- **MongoDB**: 7.x ([Installation Guide](https://www.mongodb.com/docs/manual/installation/))
- **Git**: For version control
- **Code Editor**: VS Code recommended

## Repository Structure

```
pds-girl-coder/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── services/        # Business logic
│   │   ├── api/             # REST endpoints
│   │   ├── integrations/    # External services (LinkedIn, AI, notifications)
│   │   └── jobs/            # Scheduled tasks
│   ├── tests/
│   └── package.json
├── frontend/                # Vite + React + Ant Design
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main views
│   │   ├── services/        # API clients
│   │   └── lib/             # Utilities
│   ├── tests/
│   └── package.json
├── specs/                   # Feature specifications
└── .specify/                # Speckit templates
```

---

## Initial Setup

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd pds-girl-coder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend `.env`

Create `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/jobsearch

# JWT Authentication
JWT_SECRET=<generate-random-secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Anthropic Claude API (for AI content generation)
ANTHROPIC_API_KEY=<your-api-key>

# LinkedIn API (optional for MVP)
LINKEDIN_CLIENT_ID=<your-client-id>
LINKEDIN_CLIENT_SECRET=<your-client-secret>
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback

# AWS SES (for email notifications)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
SES_FROM_EMAIL=noreply@yourdomain.com

# Web Push (for desktop notifications)
VAPID_PUBLIC_KEY=<generate-with-web-push>
VAPID_PRIVATE_KEY=<generate-with-web-push>
VAPID_SUBJECT=mailto:admin@yourdomain.com
```

#### Frontend `.env`

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_VAPID_PUBLIC_KEY=<same-as-backend>
```

### 3. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 4. Generate Secrets

```bash
# Generate JWT secret (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate VAPID keys for Web Push
cd backend
npx web-push generate-vapid-keys
```

---

## Development Workflow

### Running the Application

#### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3000`

#### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

UI runs on `http://localhost:5173`

### Testing

#### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- src/services/posts.test.ts

# Watch mode
npm run test:watch
```

#### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run E2E tests (Playwright)
npm run test:e2e

# Run specific test
npm test -- src/components/Kanban.test.tsx
```

### Code Quality

```bash
# Lint backend
cd backend
npm run lint
npm run lint:fix

# Lint frontend
cd frontend
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

---

## Key Development Tasks

### 1. Creating a New API Endpoint

**Example: Add POST `/api/v1/posts/archive`**

1. **Add route** in `backend/src/api/posts.ts`:

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { archivePost } from '../services/postService';

const router = Router();

router.post('/:id/archive', authenticate, async (req, res) => {
  try {
    const post = await archivePost(req.user.id, req.params.id);
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

2. **Implement business logic** in `backend/src/services/postService.ts`:

```typescript
export async function archivePost(userId: string, postId: string) {
  const post = await Post.findOne({ _id: postId, userId });
  if (!post) throw new Error('Post not found');

  post.status = 'archived';
  await post.save();
  return post;
}
```

3. **Add test** in `backend/src/services/postService.test.ts`:

```typescript
describe('archivePost', () => {
  it('should archive a post', async () => {
    const post = await Post.create({ userId, content: 'Test', status: 'draft' });
    const archived = await archivePost(userId, post._id);
    expect(archived.status).toBe('archived');
  });
});
```

### 2. Creating a New React Component

**Example: Add RecruiterCard component**

1. **Create component** in `frontend/src/components/RecruiterCard.tsx`:

```tsx
import { Card, Tag, Button } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';

interface RecruiterCardProps {
  recruiter: {
    id: string;
    name: string;
    company: string;
    location: string;
    status: string;
  };
  onConnect: (id: string) => void;
}

export function RecruiterCard({ recruiter, onConnect }: RecruiterCardProps) {
  return (
    <Card
      title={recruiter.name}
      extra={<Tag>{recruiter.status}</Tag>}
      actions={[
        <Button
          key="connect"
          type="primary"
          icon={<LinkedinOutlined />}
          onClick={() => onConnect(recruiter.id)}
        >
          Connect
        </Button>
      ]}
    >
      <p><strong>Company:</strong> {recruiter.company}</p>
      <p><strong>Location:</strong> {recruiter.location}</p>
    </Card>
  );
}
```

2. **Add test** in `frontend/src/components/RecruiterCard.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { RecruiterCard } from './RecruiterCard';

describe('RecruiterCard', () => {
  it('renders recruiter information', () => {
    const recruiter = {
      id: '1',
      name: 'Jane Doe',
      company: 'TechCorp',
      location: 'São Paulo',
      status: 'discovered'
    };

    render(<RecruiterCard recruiter={recruiter} onConnect={() => {}} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
  });

  it('calls onConnect when button clicked', () => {
    const onConnect = vi.fn();
    const recruiter = { id: '1', name: 'Jane', company: 'Tech', location: 'BR', status: 'discovered' };

    render(<RecruiterCard recruiter={recruiter} onConnect={onConnect} />);
    fireEvent.click(screen.getByText('Connect'));
    expect(onConnect).toHaveBeenCalledWith('1');
  });
});
```

### 3. Adding a Scheduled Job

**Example: Post publisher**

Create `backend/src/jobs/postPublisher.ts`:

```typescript
import Agenda from 'agenda';
import { publishScheduledPosts } from '../services/postService';

export function setupPostPublisher(agenda: Agenda) {
  agenda.define('publish-scheduled-posts', async () => {
    console.log('Running post publisher job');
    await publishScheduledPosts();
  });

  // Run every 5 minutes
  agenda.every('5 minutes', 'publish-scheduled-posts');
}
```

Register in `backend/src/jobs/index.ts`:

```typescript
import Agenda from 'agenda';
import { setupPostPublisher } from './postPublisher';

export async function startScheduler(mongoUri: string) {
  const agenda = new Agenda({ db: { address: mongoUri } });

  setupPostPublisher(agenda);

  await agenda.start();
  console.log('Job scheduler started');
}
```

### 4. Integrating External APIs

**Example: Claude API for content generation**

Create `backend/src/integrations/claude.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateLinkedInPost(
  topic: string,
  description: string,
  userSkills: string[]
): Promise<string> {
  const prompt = `Generate a professional LinkedIn post about: ${topic}
Description: ${description}
Author skills: ${userSkills.join(', ')}
Max 500 words. Professional but engaging tone.`;

  const response = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text;
}
```

---

## Database Management

### Seeding Test Data

Create `backend/scripts/seed.ts`:

```typescript
import { connectDB } from '../src/config/database';
import { User, PostIdea, Post } from '../src/models';

async function seed() {
  await connectDB();

  const user = await User.create({
    email: 'test@example.com',
    passwordHash: await bcrypt.hash('password123', 10),
    name: 'Test User',
    timezone: 'America/Sao_Paulo',
    weeklyConnectionLimit: 100,
  });

  await PostIdea.create([
    { userId: user._id, title: 'React Hooks', description: 'Advanced patterns', status: 'active' },
    { userId: user._id, title: 'System Design', description: 'Scalability tips', status: 'active' },
  ]);

  console.log('Seed data created');
  process.exit(0);
}

seed();
```

Run:
```bash
cd backend
npm run seed
```

### Migrations

Migrations are handled via versioned scripts in `backend/migrations/`:

```typescript
// migrations/001_add_recruiter_fields.ts
export async function up() {
  await db.collection('users').updateMany({}, {
    $set: {
      targetRegions: ['LATAM'],
      targetIndustries: []
    }
  });
}
```

Run migrations:
```bash
npm run migrate
```

---

## Common Issues & Solutions

### Issue: MongoDB connection failed

**Solution**:
```bash
# Check MongoDB status
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Verify connection string
mongo mongodb://localhost:27017/jobsearch
```

### Issue: CORS errors in frontend

**Solution**: Ensure `backend/.env` has correct `CORS_ORIGIN`:
```env
CORS_ORIGIN=http://localhost:5173
```

### Issue: JWT authentication fails

**Solution**: Check that `JWT_SECRET` is set and frontend includes token:
```typescript
// frontend/src/services/api.ts
const token = localStorage.getItem('accessToken');
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Issue: Scheduled jobs not running

**Solution**:
```bash
# Check Agenda collection
mongo jobsearch
db.agendaJobs.find()

# Restart server to re-register jobs
npm run dev
```

---

## Deployment Checklist

### Backend Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB instance (MongoDB Atlas recommended)
- [ ] Configure production `CORS_ORIGIN`
- [ ] Generate strong `JWT_SECRET`
- [ ] Set up AWS SES for email (verify domain)
- [ ] Add rate limiting middleware
- [ ] Enable request logging
- [ ] Set up health check endpoint (`/health`)
- [ ] Configure process manager (PM2)

### Frontend Deployment

- [ ] Update `VITE_API_URL` to production API
- [ ] Build production bundle: `npm run build`
- [ ] Deploy to CDN/static hosting (Vercel, Netlify, Cloudflare Pages)
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Set up error tracking (Sentry)

### Database

- [ ] Create production database
- [ ] Set up automated backups
- [ ] Create indexes for performance
- [ ] Enable authentication
- [ ] Configure connection pooling

---

## Useful Commands

```bash
# Backend
npm run dev              # Start dev server
npm test                 # Run tests
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint code
npm run type-check       # TypeScript validation

# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run tests
npm run test:e2e         # E2E tests

# Database
mongosh                  # MongoDB shell
mongosh --eval "db.users.find()" jobsearch  # Query
mongodump --db=jobsearch # Backup
mongorestore --db=jobsearch dump/jobsearch  # Restore
```

---

## Next Steps

1. **Complete Authentication**: Implement JWT refresh token rotation
2. **LinkedIn Integration**: Complete OAuth flow and posting
3. **AI Content Generation**: Integrate Claude API for posts and messages
4. **Notification System**: Set up AWS SES and Web Push
5. **Calendar Sync**: Implement iCalendar parsing
6. **Recruiter Discovery**: Build search functionality
7. **Dashboard**: Aggregate metrics from all modules

---

## Resources

- [API Documentation (OpenAPI)](/specs/001-crie-um-sistema/contracts/openapi.yaml)
- [Data Model](/specs/001-crie-um-sistema/data-model.md)
- [Research & Technical Decisions](/specs/001-crie-um-sistema/research.md)
- [Express.js Docs](https://expressjs.com/)
- [Ant Design Components](https://ant.design/components/overview/)
- [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/)
- [Vitest Docs](https://vitest.dev/)
- [Playwright E2E](https://playwright.dev/)
