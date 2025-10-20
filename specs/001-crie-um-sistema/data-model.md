# Data Model: International Job Search Management System

**Date**: 2025-10-12
**Branch**: `001-crie-um-sistema`

## Overview

This document defines the MongoDB data model for all entities in the job search management system. All timestamps are stored in UTC. All collections use MongoDB's native `_id` field as the primary key.

---

## 1. User

Represents the job seeker using the system.

### Schema

```typescript
{
  _id: ObjectId,
  email: string,                    // Unique, used for authentication
  passwordHash: string,             // bcrypt hashed password
  name: string,                     // User's full name

  // LinkedIn Integration
  linkedinIntegration: {
    connected: boolean,
    accessToken?: string,           // Encrypted
    refreshToken?: string,          // Encrypted
    expiresAt?: Date,               // UTC
    ssiScore?: number,              // LinkedIn Social Selling Index (0-100)
    lastSsiUpdate?: Date            // UTC
  },

  // Profile Information
  timezone: string,                 // IANA timezone (e.g., "America/Sao_Paulo")
  skills: string[],                 // For AI content generation context
  targetIndustries: string[],       // For recruiter discovery
  targetRegions: string[],          // For recruiter discovery (e.g., ["LATAM", "North America"])

  // Connection Management
  weeklyConnectionLimit: number,    // Default: 100
  currentWeekConnectionCount: number, // Resets every Monday
  weekStartDate: Date,              // UTC - Monday of current week

  // Notification Preferences
  notifications: {
    email: {
      enabled: boolean,
      address: string
    },
    desktop: {
      enabled: boolean,
      subscription?: object         // Web Push subscription object
    },
    appointmentReminder: {
      enabled: boolean,
      minutesBefore: number         // Default: 60
    }
  },

  createdAt: Date,                  // UTC
  updatedAt: Date                   // UTC
}
```

### Indexes

- `email` (unique)
- `weekStartDate` (for connection count reset queries)

### Validation Rules

- `email` must be valid email format
- `passwordHash` minimum 60 characters (bcrypt)
- `timezone` must be valid IANA timezone
- `weeklyConnectionLimit` range: 1-200
- `currentWeekConnectionCount` >= 0
- `linkedinIntegration.ssiScore` range: 0-100 (if present)

---

## 2. PostIdea

Represents a concept or topic for LinkedIn content.

### Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // Reference to User
  title: string,                    // Brief title for the idea
  description: string,              // Detailed description/notes
  tags: string[],                   // Categories for organization

  status: string,                   // "active" | "used" | "archived"
  usedInPostIds: ObjectId[],        // References to Post documents

  createdAt: Date,                  // UTC
  updatedAt: Date                   // UTC
}
```

### Indexes

- `userId` + `status`
- `userId` + `createdAt` (descending)

### Validation Rules

- `title` required, 1-200 characters
- `description` optional, max 2000 characters
- `status` must be one of: "active", "used", "archived"
- `tags` array max 10 elements

---

## 3. Post

Represents LinkedIn content (draft, scheduled, or published).

### Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // Reference to User
  postIdeaId?: ObjectId,            // Reference to PostIdea (optional)

  content: string,                  // Generated or manually written post (max 3000 chars)

  status: string,                   // "draft" | "scheduled" | "published" | "failed"

  // Scheduling
  scheduledAt?: Date,               // UTC - when to publish
  publishedAt?: Date,               // UTC - actual publication time

  // LinkedIn Integration
  linkedinPostId?: string,          // LinkedIn's ID for the published post
  linkedinUrl?: string,             // Direct URL to the post

  // Engagement Metrics (populated after publication)
  metrics: {
    likes: number,
    comments: number,
    shares: number,
    lastUpdated?: Date              // UTC - when metrics were last fetched
  },

  // Error Handling
  errorMessage?: string,            // If status is "failed"
  retryCount: number,               // Number of publish attempts

  createdAt: Date,                  // UTC
  updatedAt: Date                   // UTC
}
```

### Indexes

- `userId` + `status`
- `userId` + `scheduledAt` (for scheduling queries)
- `userId` + `createdAt` (descending, for kanban view)
- `scheduledAt` (for job scheduler queries)

### Validation Rules

- `content` required, 1-3000 characters
- `status` must be one of: "draft", "scheduled", "published", "failed"
- `scheduledAt` required if status is "scheduled"
- `retryCount` >= 0, max 3
- `metrics.likes`, `metrics.comments`, `metrics.shares` >= 0

### State Transitions

```
draft → scheduled → published
              ↓
            failed (can retry → scheduled or → draft)
```

---

## 4. JobOpportunity

Represents a potential job in the application pipeline.

### Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // Reference to User

  // Basic Information
  company: string,
  position: string,
  description: string,              // Job description and notes

  // Pipeline Stage
  stage: string,                    // See stages below
  stageHistory: [{
    stage: string,
    timestamp: Date,                // UTC
    notes?: string
  }],

  // Contact Information
  contactEmail?: string,
  contactName?: string,
  contactPhone?: string,
  recruiterId?: ObjectId,           // Reference to Recruiter (optional)

  // Links and Resources
  jobPostingUrl?: string,
  companyWebsite?: string,

  // Attachments and Notes
  notes: string,                    // Free-form notes
  attachments: [{
    filename: string,
    url: string,                    // S3 or file storage URL
    uploadedAt: Date                // UTC
  }],

  // Metadata
  salary?: {
    min: number,
    max: number,
    currency: string                // ISO 4217 (e.g., "USD", "BRL")
  },
  location?: string,
  remoteType?: string,              // "remote" | "hybrid" | "onsite"

  createdAt: Date,                  // UTC
  updatedAt: Date                   // UTC
}
```

### Pipeline Stages

Required stages (in order):
1. `initial_contacts` - First contact made
2. `in_progress` - Application submitted or actively engaging
3. `interview` - Interview scheduled or completed
4. `proposal` - Job offer received
5. `negotiation` - Discussing terms
6. `deal_closed` - Offer accepted
7. `archived` - Rejected, withdrawn, or completed

### Indexes

- `userId` + `stage`
- `userId` + `createdAt` (descending)
- `recruiterId` (for linking to recruiters)

### Validation Rules

- `company` required, 1-200 characters
- `position` required, 1-200 characters
- `stage` must be one of the defined pipeline stages
- `stageHistory` must have at least one entry
- `salary.currency` must be valid ISO 4217 code (if present)

---

## 5. Appointment

Represents a calendar event (interview or study session).

### Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // Reference to User

  // Basic Information
  title: string,
  description: string,
  type: string,                     // "interview" | "study_session"

  // Date and Time
  startTime: Date,                  // UTC
  endTime: Date,                    // UTC
  allDay: boolean,                  // Default: false

  // Source
  source: string,                   // "manual" | "icalendar"
  externalEventId?: string,         // UID from iCalendar import
  icalendarUrl?: string,            // Source calendar URL if imported

  // Related Entities
  jobOpportunityId?: ObjectId,      // Link to JobOpportunity for interviews
  company?: string,                 // Company name for interviews

  // Notification Status
  notificationSent: boolean,
  notificationSentAt?: Date,        // UTC

  // Metadata
  location?: string,                // Physical location or video call link
  attendees?: string[],             // Email addresses

  createdAt: Date,                  // UTC
  updatedAt: Date                   // UTC
}
```

### Indexes

- `userId` + `startTime` (for calendar view)
- `userId` + `type` + `startTime`
- `startTime` (for notification job queries)
- `externalEventId` + `icalendarUrl` (unique composite, for deduplication)

### Validation Rules

- `title` required, 1-200 characters
- `type` must be one of: "interview", "study_session"
- `startTime` < `endTime` (if both provided)
- `source` must be one of: "manual", "icalendar"
- `notificationSent` default: false

---

## 6. Recruiter

Represents a LinkedIn recruiter profile for connection management.

### Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // Reference to User

  // Profile Information
  name: string,
  company: string,
  location: string,
  industry?: string,
  linkedinProfileUrl: string,       // Must be unique per user

  // Connection Status
  status: string,                   // "discovered" | "connection_sent" | "connected" | "rejected"

  // Timeline
  discoveredAt: Date,               // UTC
  connectionSentAt?: Date,          // UTC
  connectedAt?: Date,               // UTC
  rejectedAt?: Date,                // UTC

  // Week Tracking (for connection limit)
  connectionWeek?: Date,            // UTC - Monday of week connection was sent (for limit tracking)

  // Generated Messages
  generatedMessages: [{
    message: string,
    generatedAt: Date,              // UTC
    used: boolean
  }],

  // Custom Notes
  notes: string,

  // Search Metadata (for filtering/sorting)
  searchCriteria?: {
    region: string[],
    industry: string[],
    keywords: string[]
  },

  createdAt: Date,                  // UTC
  updatedAt: Date                   // UTC
}
```

### Indexes

- `userId` + `status`
- `userId` + `linkedinProfileUrl` (unique composite)
- `userId` + `connectionWeek` (for weekly connection limit queries)
- `userId` + `discoveredAt` (descending)

### Validation Rules

- `name` required, 1-200 characters
- `company` required, 1-200 characters
- `linkedinProfileUrl` required, must be valid URL
- `status` must be one of: "discovered", "connection_sent", "connected", "rejected"
- `generatedMessages` max 10 messages

### State Transitions

```
discovered → connection_sent → connected
                         ↓
                      rejected
```

---

## 7. ICalendarSync

Tracks external calendar synchronization state.

### Schema

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // Reference to User

  name: string,                     // User-friendly name for the calendar
  icalendarUrl: string,             // webcal:// or https:// URL

  enabled: boolean,

  // Sync Status
  lastSyncAt?: Date,                // UTC
  lastSuccessfulSyncAt?: Date,      // UTC
  syncStatus: string,               // "pending" | "success" | "error"
  errorMessage?: string,

  // Stats
  eventCount: number,               // Number of events imported

  createdAt: Date,                  // UTC
  updatedAt: Date                   // UTC
}
```

### Indexes

- `userId`
- `userId` + `enabled` + `lastSyncAt` (for sync job queries)

### Validation Rules

- `name` required, 1-100 characters
- `icalendarUrl` required, must be valid URL
- `syncStatus` must be one of: "pending", "success", "error"
- `eventCount` >= 0

---

## Relationships

```
User (1) ──── (N) PostIdea
User (1) ──── (N) Post
User (1) ──── (N) JobOpportunity
User (1) ──── (N) Appointment
User (1) ──── (N) Recruiter
User (1) ──── (N) ICalendarSync

PostIdea (1) ──── (N) Post

Recruiter (1) ──── (N) JobOpportunity [optional link]
JobOpportunity (1) ──── (N) Appointment [optional link]
```

---

## Weekly Reset Logic

Every Monday at 00:00 UTC, a scheduled job runs:

```typescript
// Reset connection count for all users where current week has ended
db.users.updateMany(
  { weekStartDate: { $lt: startOfThisWeek } },
  {
    $set: {
      currentWeekConnectionCount: 0,
      weekStartDate: startOfThisWeek
    }
  }
)
```

---

## Common Queries

### Dashboard Metrics
```typescript
// Weekly post count
db.posts.countDocuments({
  userId: ObjectId("..."),
  createdAt: { $gte: startOfWeek },
  status: { $in: ["scheduled", "published"] }
})

// Pipeline stage counts
db.jobOpportunities.aggregate([
  { $match: { userId: ObjectId("..."), stage: { $ne: "archived" } } },
  { $group: { _id: "$stage", count: { $sum: 1 } } }
])

// Today's appointments
db.appointments.find({
  userId: ObjectId("..."),
  startTime: { $gte: startOfDay, $lt: endOfDay }
}).sort({ startTime: 1 })

// Weekly connection count
db.users.findOne(
  { _id: ObjectId("...") },
  { currentWeekConnectionCount: 1, weeklyConnectionLimit: 1 }
)
```

### Post Scheduling
```typescript
// Find posts to publish in next 5 minutes
db.posts.find({
  status: "scheduled",
  scheduledAt: {
    $gte: now,
    $lt: new Date(now.getTime() + 5 * 60 * 1000)
  }
})
```

### Appointment Notifications
```typescript
// Find appointments needing notification in next hour
db.appointments.find({
  notificationSent: false,
  startTime: {
    $gte: new Date(now.getTime() + 55 * 60 * 1000),
    $lt: new Date(now.getTime() + 65 * 60 * 1000)
  }
})
```

---

## Data Retention

- **Posts**: Retained indefinitely (user may want historical engagement data)
- **PostIdeas**: Retained until user archives
- **JobOpportunities**: Archived opportunities retained indefinitely
- **Appointments**: Past appointments retained for 1 year, then deleted
- **Recruiters**: All statuses retained indefinitely (connection history valuable)
- **ICalendarSync**: Sync history retained for 90 days

---

## Security Considerations

1. **Sensitive Fields**: `passwordHash`, `linkedinIntegration.accessToken`, `linkedinIntegration.refreshToken` must be encrypted at rest
2. **User Isolation**: All queries MUST include `userId` filter to prevent data leakage
3. **Input Validation**: All string fields must be sanitized to prevent NoSQL injection
4. **Rate Limiting**: LinkedIn API tokens and user actions must be rate-limited at application level
5. **GDPR Compliance**: User data export and deletion endpoints required

---

## Migration Strategy

Initial deployment uses MongoDB schema versioning:

```typescript
{
  schemaVersion: 1,
  // ... document fields
}
```

Future schema changes increment `schemaVersion` and run migration scripts before application deployment.
