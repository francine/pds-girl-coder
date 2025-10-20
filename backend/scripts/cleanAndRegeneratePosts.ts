import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobsearch';

// Software Engineering focused posts
const engineeringPosts = [
  {
    title: 'Clean Code Principles That Changed How I Write Software',
    content: `Writing code is easy. Writing CLEAN code that others can maintain? That's the real challenge.

Here are the principles that transformed my code quality:

🎯 Single Responsibility Principle
One function, one job. If you need "and" to describe what it does, it's doing too much.

🎯 Meaningful Names
\`getUserData()\` > \`fetch()\`
\`isValidEmail()\` > \`check()\`
Your code should read like prose.

🎯 Functions Should Be Small
If you can't see it all on one screen, it's too long. Break it down.

🎯 Don't Repeat Yourself (DRY)
Copy-paste is a code smell. Extract, reuse, abstract.

🎯 Write Tests First
TDD isn't just a buzzword. It forces better design and catches bugs early.

🎯 Comments Explain WHY, Not WHAT
Good code is self-documenting. Comments should explain the reasoning, not the mechanics.

Clean code isn't about being perfect—it's about being considerate of the next developer (which is often future you).

What's your #1 clean code principle?

#CleanCode #SoftwareEngineering #CodingBestPractices #DeveloperLife #Programming`
  },
  {
    title: 'The Architecture Patterns Every Backend Engineer Should Know',
    content: `Backend architecture can make or break your application. Here are the patterns that saved my projects:

🏗️ Layered Architecture (MVC)
Separate concerns: Controllers handle requests, Services contain business logic, Repositories manage data.
Simple, testable, maintainable.

🏗️ Microservices
Independent services, independent deployments. Scale what needs scaling, not everything.
Great for large teams and complex domains.

🏗️ Event-Driven Architecture
Decouple services with events. Pub/Sub patterns enable async processing and better scalability.
Perfect for real-time systems.

🏗️ CQRS (Command Query Responsibility Segregation)
Separate read and write operations. Optimize each independently.
Ideal for high-performance systems.

🏗️ Repository Pattern
Abstract data access. Swap databases without touching business logic.
Makes testing infinitely easier.

🏗️ API Gateway
Single entry point for multiple services. Handle auth, rate limiting, routing in one place.

There's no "best" architecture—only the right one for your specific needs.

Start simple, refactor when complexity demands it. Premature optimization is real.

Which architecture pattern do you use most?

#BackendDevelopment #SoftwareArchitecture #Microservices #SystemDesign #Engineering`
  },
  {
    title: 'From Monolith to Microservices: Lessons Learned',
    content: `We migrated from a monolith to microservices. Here's what I wish I knew before starting:

✅ Start with a monolith
Seriously. Microservices solve scaling problems. If you don't have scaling problems, you don't need microservices.

✅ Define clear boundaries
Bad boundaries = distributed monolith. Design around business domains, not technical layers.

✅ Embrace eventual consistency
Distributed transactions are hard. Design for eventual consistency from day one.

✅ Invest in observability
You can't debug microservices with console.log. Distributed tracing, centralized logging, metrics—non-negotiable.

✅ Service communication matters
REST for public APIs, gRPC for inter-service. Choose based on your needs, not trends.

✅ Database per service
Shared databases defeat the purpose. Each service owns its data.

✅ Automate everything
Manual deployments of 20+ services? Nightmare. CI/CD, infrastructure as code, automated testing—or don't do microservices.

Microservices aren't a silver bullet. They trade codebase complexity for operational complexity.

Make sure you're solving the right problem before you commit.

Have you worked with microservices? What was your biggest challenge?

#Microservices #SoftwareArchitecture #SystemDesign #DevOps #BackendEngineering`
  },
  {
    title: 'Database Optimization: How I Reduced Query Time by 90%',
    content: `Slow queries were killing our app performance. Here's how we fixed it:

🚀 Index Everything That Matters
Query on user_id? Add an index. Filter by created_at? Index it.
But don't over-index—writes get slower.

🚀 N+1 Queries Are Silent Killers
Loading users + their posts in a loop? That's 1 + N queries.
Use JOINs or batch loading. Your database will thank you.

🚀 Pagination Is Mandatory
LIMIT 1000 without OFFSET? You're loading everything in memory.
Cursor-based pagination for large datasets.

🚀 Query Optimization
EXPLAIN ANALYZE is your best friend. Find the bottlenecks, optimize them.
Sometimes rewriting the query is all you need.

🚀 Connection Pooling
Creating a new connection per request? Expensive.
Use connection pools to reuse existing connections.

🚀 Caching Strategy
Redis for frequently accessed data. Cache query results, not just objects.
Invalidation is hard—design it upfront.

🚀 Denormalization When Needed
Normalized data is clean, but sometimes you need speed over purity.
Read-heavy? Consider denormalizing.

Performance optimization isn't premature—it's about knowing when to optimize.

Measure first, optimize second.

What's your favorite database optimization technique?

#DatabaseOptimization #PerformanceTuning #SQL #BackendDevelopment #PostgreSQL`
  },
  {
    title: 'API Design Best Practices for RESTful Services',
    content: `Your API is your product's interface. Here's how to make it great:

📡 Use HTTP methods correctly
GET = read, POST = create, PUT = update, PATCH = partial update, DELETE = delete
Don't POST everything.

📡 Versioning is not optional
/api/v1/users not /api/users
You WILL need to break compatibility eventually.

📡 Consistent naming conventions
Use plural nouns: /users not /user
Use kebab-case: /user-profiles not /userProfiles
Be consistent across all endpoints.

📡 Status codes matter
200 = success, 201 = created, 400 = bad request, 401 = unauthorized, 404 = not found, 500 = server error
Use them correctly. Your clients depend on it.

📡 Return meaningful errors
\`{"error": "Invalid input"}\` is useless
\`{"error": "Email must be a valid format", "field": "email"}\` is helpful

📡 Pagination for collections
Don't return 10,000 records. Use limit/offset or cursor-based pagination.

📡 Rate limiting from day one
Protect your API from abuse. Return 429 with Retry-After header.

📡 Document everything
OpenAPI/Swagger is your friend. Keep docs updated with code changes.

A well-designed API is intuitive, predictable, and self-documenting.

What's your #1 API design principle?

#APIDesign #RESTful #BackendDevelopment #SoftwareEngineering #WebDev`
  },
  {
    title: 'Docker and Containerization: A Practical Guide',
    content: `"It works on my machine" is no longer an excuse. Docker changed how we ship software.

Here's what makes containers powerful:

🐳 Consistency Across Environments
Dev, staging, prod—same container, same behavior. No more environment surprises.

🐳 Dependency Isolation
Node 14 for one app, Node 18 for another? No problem. Each container is self-contained.

🐳 Fast Deployments
Build once, deploy anywhere. Rollbacks are just switching to a previous image.

🐳 Resource Efficiency
Lighter than VMs, faster to start. Run multiple containers on one machine.

Best practices I learned the hard way:

✅ Keep images small—multi-stage builds are your friend
✅ Don't run as root inside containers
✅ Use .dockerignore to exclude unnecessary files
✅ Tag images properly—latest is not a version strategy
✅ Health checks are mandatory for production
✅ Use Docker Compose for local development

Container orchestration (Kubernetes, Docker Swarm) comes next, but master containers first.

Containerization isn't just about Docker—it's about building reliable, reproducible systems.

Are you using containers in production? What's your setup?

#Docker #Containerization #DevOps #SoftwareEngineering #CloudComputing`
  },
  {
    title: 'CI/CD Pipeline That Actually Works',
    content: `Manual deployments are risky, slow, and error-prone. Here's the CI/CD pipeline that transformed our workflow:

⚙️ Stage 1: Commit & Build
Push to Git → Automated build triggered
Run linting, compile TypeScript, build assets
Fast feedback = fewer broken builds

⚙️ Stage 2: Automated Testing
Unit tests (must pass)
Integration tests (API contracts)
E2E tests (critical user flows)
Code coverage reports

⚙️ Stage 3: Security & Quality
Dependency vulnerability scanning
Static code analysis (SonarQube)
Docker image scanning
Catch issues before they reach production

⚙️ Stage 4: Deploy to Staging
Automatic deployment to staging environment
Run smoke tests
QA team validates

⚙️ Stage 5: Production Deployment
Merge to main = automatic production deploy
Blue-green deployment (zero downtime)
Automatic rollback on health check failures

⚙️ Post-Deployment
Monitor metrics, logs, error rates
Slack notifications for deployment status
Track deployment frequency (we're at 20+ per day)

Tools we use: GitHub Actions, Docker, Kubernetes, ArgoCD

The best CI/CD pipeline is the one your team trusts enough to deploy on Fridays.

What's your deployment frequency?

#CICD #DevOps #Automation #SoftwareEngineering #ContinuousDeployment`
  },
  {
    title: 'Writing Tests That Actually Add Value',
    content: `Testing isn't about hitting 100% coverage. It's about confidence in your code.

Here's my testing strategy:

🧪 Unit Tests: Test Business Logic
Pure functions, edge cases, error handling
Fast, isolated, easy to write
Aim for high coverage on critical paths

🧪 Integration Tests: Test Interactions
Database queries, API calls, service communication
Catch issues that unit tests miss
Use test databases, mock external services

🧪 E2E Tests: Test User Journeys
Critical flows only—login, checkout, payment
Slow but invaluable for catching UX issues
Run in CI, but don't block on flakiness

🧪 What NOT to test
Framework code (it's already tested)
Third-party libraries (trust them or don't use them)
Trivial getters/setters

Testing principles that work:

✅ Arrange, Act, Assert—structure matters
✅ Test behavior, not implementation
✅ One assertion per test (mostly)
✅ Descriptive test names: "should return 404 when user not found"
✅ Tests should be fast—slow tests don't get run
✅ Mock external dependencies, stub time/randomness

Tests are documentation. Good tests explain how your code should behave.

100% coverage with bad tests = false confidence. Focus on value, not metrics.

What's your testing philosophy?

#Testing #TDD #SoftwareQuality #CleanCode #DeveloperTools`
  },
  {
    title: 'TypeScript: Why I Will Never Go Back to Plain JavaScript',
    content: `After 2 years with TypeScript, going back to JavaScript feels like coding blindfolded.

Here's why TypeScript transformed my development:

⚡ Catch Bugs at Compile Time
\`Cannot read property 'name' of undefined\` in production? Not anymore.
TypeScript catches these before code ships.

⚡ Better Developer Experience
Autocomplete everywhere. IntelliSense knows your entire codebase.
Refactoring is safe—rename a variable, update 100+ files instantly.

⚡ Self-Documenting Code
\`function getUser(): Promise<User>\` vs \`function getUser()\`
One tells you exactly what to expect. The other is a mystery.

⚡ Easier Refactoring
Change an interface? TypeScript shows you every place that breaks.
No more "grep and pray."

⚡ Team Communication
Types are contracts. They document what your API expects and returns.
New team members ramp up faster.

Common misconceptions:

❌ "TypeScript is too verbose" → Inference does the heavy lifting
❌ "It slows development" → It prevents debugging sessions that take 10x longer
❌ "I do not need types for small projects" → Small projects become big projects

Start with strict mode. Yes, it is harder. But it forces better patterns.

TypeScript is not perfect, but the productivity gains are undeniable.

Are you using TypeScript? If not, what's holding you back?

#TypeScript #JavaScript #WebDevelopment #SoftwareEngineering #DevTools`
  },
  {
    title: 'Git Workflow That Scales with Your Team',
    content: `Bad Git practices kill productivity. Here is the workflow that keeps our team shipping fast:

🌿 Branching Strategy: Trunk-Based Development
main = production-ready, always
Feature branches: short-lived (1-3 days max)
Merge frequently, deploy often

🌿 Branch Naming Convention
feature/user-authentication
bugfix/payment-error-handling
hotfix/critical-security-patch
Consistent naming = easier tracking

🌿 Commit Messages That Matter
Bad: "fix bug"
Good: "fix: prevent duplicate email registration"

Follow Conventional Commits:
feat: new feature
fix: bug fix
refactor: code change without feature change
docs: documentation only

🌿 Pull Request Best Practices
Small PRs (< 400 lines)
Descriptive titles and descriptions
Link to tickets/issues
Request reviews from relevant people
CI must pass before merge

🌿 Code Review Checklist
Does it work? (test locally)
Does it follow team conventions?
Is it maintainable?
Are edge cases handled?
Are tests included?

🌿 Avoid These Git Mistakes
Force pushing to shared branches
Committing secrets/credentials
Huge commits with multiple unrelated changes
Not pulling before pushing
Using \`git add .\` without reviewing changes

Git is a collaboration tool. Use it like one.

What is your team Git workflow?

#Git #VersionControl #DevOps #TeamCollaboration #SoftwareEngineering`
  }
];

async function cleanAndRegeneratePosts() {
  let client: MongoClient | null = null;

  try {
    console.log('Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // Get the first user
    const usersCollection = db.collection('users');
    let user = await usersCollection.findOne({});

    if (!user) {
      console.log('No user found. Please create a user first.');
      return;
    }

    console.log('Using user with ID:', user._id);

    const postsCollection = db.collection('posts');

    // Delete existing posts
    console.log('\nDeleting existing posts...');
    const deleteResult = await postsCollection.deleteMany({ userId: user._id });
    console.log(`Deleted ${deleteResult.deletedCount} posts`);

    // Create new software engineering posts
    console.log('\nGenerating 10 software engineering posts...\n');

    for (let i = 0; i < engineeringPosts.length; i++) {
      const postData = engineeringPosts[i];

      console.log(`[${i + 1}/10] Creating post: "${postData.title}"...`);

      const post = {
        userId: user._id,
        content: postData.content,
        status: 'draft',
        metrics: {
          likes: 0,
          comments: 0,
          shares: 0
        },
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await postsCollection.insertOne(post);
    }

    const totalPosts = await postsCollection.countDocuments({ userId: user._id });
    console.log(`\n✅ Complete! Total posts for user: ${totalPosts}`);
    console.log('\n📝 All posts are focused on software engineering topics and are in DRAFT status.');
    console.log('🚀 You can now view these posts in the dashboard and schedule them for posting on LinkedIn.');

  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the script
cleanAndRegeneratePosts().catch(console.error);
