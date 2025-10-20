# Implementation Research: International Job Search Management System

## 1. Technology Stack

### Backend Framework
**Decision**: Express.js with Node.js
**Rationale**:
- Express.js remains the industry standard for REST API development in 2025, with the largest ecosystem of middleware and plugins
- Extensive community support and documentation, critical for troubleshooting external API integrations (LinkedIn, AI services, calendar feeds)
- Simplest setup with minimal configuration overhead, perfect for single-user applications
- Native support for all required features: middleware for authentication, easy route handling, and excellent compatibility with MongoDB through Mongoose
- While Fastify offers better performance (2-4x faster with 48,000 requests/second), Express's simplicity and battle-tested stability are more valuable for this use case
- NestJS would be overkill for a single-user application, adding unnecessary architectural complexity and opinionated structure

**Alternatives Considered**:
- **Fastify**: 2.7x better performance (48,000 req/sec vs Express), built-in JSON schema validation, first-class TypeScript support. However, smaller middleware ecosystem and unnecessary complexity for single-user app with moderate traffic
- **NestJS**: Enterprise-grade with Angular-like architecture, TypeScript-first design, dependency injection. Too opinionated and complex for this scope; better suited for large-scale enterprise applications with multiple teams

### Frontend Framework
**Decision**: Vite + React (SPA architecture)
**Rationale**:
- This is a private, authenticated single-user application with no SEO requirements, making SSR unnecessary
- Vite provides lightning-fast development experience with Hot Module Replacement (HMR) and fast build times
- Simple deployment as static files to any hosting service (Netlify, Vercel, AWS S3+CloudFront)
- Full flexibility to choose routing library (React Router v6), state management, and UI libraries
- Minimal build configuration and maintenance overhead
- Perfect for applications requiring client-side interactivity (drag-and-drop Kanban, calendar views, real-time updates)
- **Excellent Ant Design compatibility**: Ant Design works seamlessly with Vite + React setup with zero configuration issues
- Vite is now the recommended build tool for React applications in 2025, replacing Create React App

**Alternatives Considered**:
- **Next.js**: Excellent for SSR/SEO needs and has official Ant Design integration guide. However, adds unnecessary complexity (API routes, file-based routing, server components, App Router constraints) for a private authenticated app. Note: React 19 + Next.js 15 have known compatibility issues with Ant Design v5 regarding ref handling
- **Create React App (CRA)**: Deprecated and no longer maintained; not recommended for new projects in 2025

### Language
**Decision**: TypeScript (strict mode)
**Rationale**:
- Critical for external API integrations: type-safe contracts with LinkedIn API, AI services (OpenAI/Claude), and calendar parsing reduce runtime errors
- **Ant Design is written in TypeScript with complete type definitions** (antd >= 4.0.0 requires TypeScript >= 4.0.0), providing excellent IntelliSense and autocomplete
- Prevents common errors when handling timezone conversions, job scheduling, and data transformations
- Type safety for Ant Design component props prevents runtime errors (e.g., Form validation, Table columns, Modal callbacks)
- First-class support in both Express and React ecosystems as of 2025
- Over 70% of new React projects and ~73% of professional frontend codebases use TypeScript in 2025
- Type definitions catch errors at compile-time rather than in production
- Industry standard for enterprise-scale applications in 2025

**Alternatives Considered**:
- **JavaScript**: Faster initial setup but significantly higher risk of runtime errors with multiple external API integrations and complex data transformations. Ant Design still works with JavaScript but loses type safety benefits

### Versions
- **Node.js**: 22 LTS (Active LTS until October 2025, Maintenance LTS until April 2027)
- **React**: 18.3.x (stable production version; React 19.2.0 released October 2025 but has compatibility issues with Ant Design)
- **Ant Design**: 5.27.4 (latest stable; requires React 16-18 by default)
- **React 19 Compatibility Note**: To use React 19 with Ant Design 5, install `@ant-design/v5-patch-for-react-19` (version 1.0.3)
- **TypeScript**: 5.7.x (latest stable)
- **Express**: 4.21.x (Express 5 is still in beta)
- **MongoDB**: 6.x or 7.x with MongoDB driver 6.x
- **Vite**: 6.x (latest)

**Recommended Approach**: Use React 18.3.x for production stability with Ant Design. Consider React 19 only when Ant Design officially supports it without patches.

## 2. AI Content Generation

**Decision**: Anthropic Claude API (Claude 3 Haiku)
**Rationale**:
- **Cost-effectiveness**: Claude 3 Haiku at $0.25 per million input tokens and $1.25 per million output tokens is the most cost-effective option for professional content generation
  - Typical LinkedIn post (500 words ≈ 650 tokens): ~$0.0008 per generation
  - Recruiter message (100-150 words ≈ 200 tokens): ~$0.0003 per generation
  - Budget estimate: 1,000 generations/month = ~$1.20/month
- **Content quality**: Claude is specifically recognized for capturing writing style and tone better than competitors, especially when provided with example posts
- **Professional tone**: Superior for business/professional content generation compared to GPT-3.5 Turbo; produces more natural, context-aware LinkedIn posts
- **API reliability**: Anthropic offers 99.9% uptime SLA with consistent performance
- **Rate limits**: Generous limits for single-user application (Claude 3 Haiku: 50,000 requests per minute)
- **Latest models available** (as of 2025): Claude 3.7 Sonnet ($3/$15 per million tokens) offers better quality but unnecessary for basic content generation

**Alternatives Considered**:
- **OpenAI GPT-4o**: Better general knowledge and reasoning but 10-20x more expensive ($2.50/$10.00 per million tokens) - unnecessary cost for straightforward content generation tasks
- **OpenAI GPT-3.5 Turbo**: Similar pricing ($3/$6 per million tokens) but lower quality for professional writing and less natural tone
- **Claude 3.7 Sonnet**: Higher quality ($3/$15 per million tokens) but overkill for this use case; Haiku sufficient for LinkedIn posts
- **Open-source models (Llama 3, Mistral)**: Require self-hosting infrastructure (GPU servers, model serving frameworks), significant setup complexity, ongoing maintenance, and uncertain quality - not cost-effective for single-user app

**Integration Approach**:
- Store API key in environment variables (`.env` file, never commit to repository)
- Implement rate limiting middleware to prevent abuse (5 requests per minute per user)
- Cache API responses in MongoDB to avoid regenerating identical content from same prompts
- Add content length validation (LinkedIn limit: 3,000 characters including spaces)
- Implement retry logic with exponential backoff for API failures (3 retries with 1s, 2s, 4s delays)
- Track token usage per user in database for cost monitoring and analytics
- Provide user feedback during generation (loading states, progress indicators)
- Allow users to regenerate or edit AI-generated content before posting

**Security Considerations**:
- Never expose API key to frontend (all AI requests routed through backend)
- Sanitize user input to prevent prompt injection attacks
- Implement content moderation to filter inappropriate generated content
- Log all AI requests for auditing and debugging

## 3. LinkedIn Integration

**Capabilities**:
The LinkedIn API provides OAuth 2.0 authentication and **severely limited** access to the following features:

**Available Features**:
- **Posting content**: Available through Share API (requires `w_member_social` permission scope) for creating posts on user's profile
- **Organizational content**: For company pages (requires `w_organization_social` scope if marketing platform access requested)
- **Basic profile data**: Access to user's profile information (requires `r_liteprofile` scope)

**Social Selling Index (SSI) - CRITICAL LIMITATION**:
- **NO official API access**: LinkedIn does NOT provide any public API endpoint to retrieve Social Selling Index data programmatically
- SSI is a proprietary metric calculated by LinkedIn and visible only in the LinkedIn web interface
- **Attempting to scrape SSI data violates LinkedIn Terms of Service** and can result in account bans and legal action
- LinkedIn is shifting focus from SSI to AI-powered tools in 2025, reducing emphasis on this metric

**Engagement Metrics - PARTIAL ACCESS**:
- Limited engagement statistics available through standard LinkedIn API
- Basic metrics only (likes, comments, shares counts)
- **Detailed analytics** (impressions, clicks, click-through rates, demographics) require LinkedIn Marketing API partnership program
- Marketing API access requires application approval and is typically granted only to marketing platforms and agencies

**Recruiter Search - NOT AVAILABLE**:
- LinkedIn Recruiter Lite and Recruiter features are NOT accessible via public API
- **Talent Solutions API requires partnership approval and certification** (typically only granted to recruiting platforms)
- Standard API does NOT support searching for recruiter profiles or advanced people search
- People Search API has strict throttle limits: 100 searches per day for individual users, 400 for app developers

**Authentication**:
OAuth 2.0 three-legged authorization flow:
1. Redirect user to LinkedIn authorization URL with required scopes (`r_liteprofile`, `w_member_social`)
2. User grants permissions on LinkedIn's consent screen
3. LinkedIn redirects back to application callback URL with authorization code
4. Backend exchanges authorization code for access token (valid for 60 days)
5. Store access token securely (encrypted in database with AES-256)
6. Implement refresh token flow for seamless re-authentication before expiration
7. Handle token revocation and re-authorization gracefully

**Rate Limits**:
LinkedIn enforces strict rate limits that vary by partnership tier:
- **Application-level throttles**: Limit total API calls per application per day
- **User-level throttles**: Limit calls per individual user (typically 100-500 per day depending on endpoint)
- **Standard tier**: ~500 requests per day per app for most endpoints
- **People Search**: 100 searches per day per user, 400 for app developer accounts
- **Exceeding limits**: Returns HTTP 429 (Too Many Requests); monitor quota in Developer Portal
- **Best practice**: Limit actions to 100 per day per account (retrieving profiles, sending messages, posting content)

**Recommended Implementation**:
- Implement exponential backoff for rate limit errors (429 responses)
- Queue LinkedIn API requests to avoid burst traffic
- Cache API responses when possible to reduce request volume
- Display rate limit status to user in UI
- Implement request prioritization (e.g., post publishing over analytics retrieval)

**Limitations Summary**:
- ❌ Cannot programmatically access Social Selling Index (SSI)
- ❌ Cannot retrieve detailed post analytics without Marketing API partnership
- ❌ Cannot search for recruiters or perform advanced people searches without Talent API partnership
- ❌ Cannot access private messages or InMail functionality
- ❌ Posted content subject to LinkedIn's content policies and spam detection
- ⚠️ Very low rate limits (100-500 requests/day)
- ✅ Can post content to user's feed
- ✅ Can retrieve basic profile information

**Fallback Strategy**:
Given the severe API limitations, implement a **hybrid manual/automated approach**:

### 1. For SSI Tracking:
- **Manual entry**: User manually enters SSI score from LinkedIn dashboard on weekly basis
- **UI support**: Provide clear instructions and annotated screenshots showing how to find SSI score on LinkedIn
- **Historical tracking**: Store SSI data in MongoDB with timestamps to show trends over time (line charts)
- **Automated reminders**: Send weekly email/push notification reminding user to update SSI
- **Quick entry**: Simple form with number input (SSI range: 0-100)
- **Value**: Even manual tracking provides valuable insights into social selling performance trends

### 2. For Recruiter Discovery:
- **Manual profile addition**: User manually adds recruiter profiles via LinkedIn profile URL
- **URL parsing**: Extract basic information from public profile URL (name from URL slug if available)
- **Manual data entry**: Form to capture: name, title, company, location, LinkedIn URL, notes
- **Contact history tracking**: Log all interactions (messages sent, responses received, meetings scheduled)
- **Follow-up reminders**: Automated reminders for follow-up actions (e.g., "Follow up with [Recruiter] - last contact 2 weeks ago")
- **Chrome extension (future enhancement)**: One-click "Add to Job Search Manager" button when viewing LinkedIn profiles
- **Organization**: Tag recruiters by industry, company, specialization for easy filtering

### 3. For Detailed Analytics:
- **Manual metrics entry**: User inputs key engagement metrics after posting to LinkedIn
- **Quick-entry form**: Simple form with fields for: views, likes, comments, shares, click-throughs
- **Post-creation reminder**: Show reminder/prompt immediately after publishing post to LinkedIn
- **Historical analysis**: Store all metrics to generate trend reports and identify best-performing content types
- **Insights**: Calculate engagement rate, identify optimal posting times, track follower growth

### 4. For Automated Posting (FULLY SUPPORTED):
- ✅ **Full automation**: Content generation via Claude API + scheduled publishing via LinkedIn Share API
- ✅ **Scheduling**: Use Agenda job queue to publish at optimal times
- ✅ **Content preview**: Show preview of post before publishing
- ✅ **Draft management**: Save drafts, edit before publishing
- ✅ **Post history**: Track all published posts with timestamps
- ✅ **Error handling**: Retry failed posts, notify user of issues
- ✅ **Success confirmation**: Verify post published successfully via API response

### 5. UI/UX for Manual Data Entry:
- Design quick-entry forms with minimal friction (auto-save, keyboard shortcuts)
- Pre-fill known data where possible
- Use Ant Design Form components with validation
- Provide bulk import options (CSV upload for recruiter lists)
- Mobile-responsive forms for on-the-go updates
- Celebration/gamification for consistent tracking (streaks, achievements)

**Ethical and Legal Considerations**:
- **Avoid scraping**: LinkedIn's Terms of Service explicitly forbid unauthorized scraping; violations can result in permanent account bans, IP blocks, and legal action (LinkedIn actively monitors and litigates scraping)
- **GDPR compliance**: If storing recruiter data, ensure proper consent, data handling, and deletion capabilities
- **Respect rate limits**: Implement proper backoff strategies to avoid API abuse detection
- **User consent**: Clearly communicate what data is accessed and how it's used in privacy policy
- **Data security**: Encrypt stored LinkedIn access tokens, implement token rotation
- **Transparency**: Inform users about API limitations and why manual entry is necessary

**Alternative Consideration**:
If LinkedIn API limitations are too restrictive, consider pivoting to a "LinkedIn Companion Tool" that helps users **manually** manage their job search with better organization, reminders, and analytics rather than promising full automation.

## 4. Calendar Integration

**Decision**: node-ical library for iCalendar parsing
**Rationale**:
- Specifically optimized for Node.js with native file system and URL fetching capabilities
- Supports parsing local .ics files and remote URLs (webcal://, https://)
- Modern async/await support with promise-based API (clean, readable code)
- **Actively maintained**: Last update 2 months ago (as of October 2025); multiple maintained forks
- Handles recurring events (RRULE) and timezone conversions automatically
- Zero external dependencies - lightweight (~50KB), secure, minimal attack surface
- Direct support for Google Calendar public URLs, iCloud webcal:// feeds, and Office 365 calendar exports
- Parses all standard iCalendar properties: VEVENT, VTODO, VALARM, VTIMEZONE

**Alternatives Considered**:
- **ical.js**: Cross-platform (browser + Node.js) with comprehensive iCalendar support and validation tools. More complex API and unnecessary browser compatibility for backend-only parsing. Latest version: 2.2.1
- **node-icalendar**: Older library with less active maintenance and outdated API patterns

**Import Strategy**:

### 1. Webcal URL Handling:
```typescript
// Convert webcal:// to https:// for fetching
const httpsUrl = calendarUrl.replace('webcal://', 'https://');
const events = await ical.async.fromURL(httpsUrl);
```
- Automatically handles redirects and follows standard HTTP protocols
- Support basic authentication if calendar requires credentials (embed in URL or use custom headers)

### 2. Google Calendar Integration:
**Public Calendar URL**:
- User navigates to Google Calendar Settings > [Calendar Name] > Integrate Calendar
- Copy "Public address in iCal format" (e.g., `https://calendar.google.com/calendar/ical/[calendar-id]/public/basic.ics`)
- Parse using: `await ical.async.fromURL(googleCalendarUrl)`

**Private Calendar URL** (requires authentication):
- User must generate App Password or use OAuth 2.0 for Google Calendar API
- Alternative: Export .ics file manually and upload to application

### 3. Apple iCloud Calendar:
- User goes to iCloud Calendar > Calendar Sharing > Public Calendar
- Copy webcal:// URL (e.g., `webcal://p01-caldav.icloud.com/published/2/[token]`)
- Convert to HTTPS and parse with node-ical
- Handle iCloud-specific timezone quirks (test thoroughly)

### 4. File Upload:
```typescript
// Support direct .ics file upload for offline calendars
const content = await fs.readFile(uploadedFilePath, 'utf8');
const events = await ical.async.parseICS(content);
```
- Use Ant Design Upload component for file selection
- Validate file size (max 5MB) and MIME type (text/calendar)
- Parse and preview events before importing

### 5. Event Processing:
**Extract relevant fields**:
- Start time (DTSTART), end time (DTEND)
- Summary/title (SUMMARY)
- Description (DESCRIPTION)
- Location (LOCATION)
- Attendees (ATTENDEE)
- Recurrence rules (RRULE)

**Data transformation**:
```typescript
for (const event of Object.values(events)) {
  if (event.type === 'VEVENT') {
    const calendarEvent = {
      externalId: event.uid,
      title: event.summary,
      description: event.description,
      location: event.location,
      startTime: DateTime.fromJSDate(event.start).toUTC().toJSDate(), // Convert to UTC
      endTime: DateTime.fromJSDate(event.end).toUTC().toJSDate(),
      attendees: event.attendee ? parseAttendees(event.attendee) : [],
      isRecurring: !!event.rrule,
      source: 'google_calendar', // or 'icloud', 'uploaded'
    };

    // Store in MongoDB calendar_events collection
    await CalendarEvent.create(calendarEvent);
  }
}
```

**Handle recurring events**:
- Expand recurring events (RRULE) into individual instances for next 12 months
- Use RRule library for complex recurrence patterns
- Limit expansion to prevent infinite series

**Filter events by criteria**:
- Allow user to define keywords (e.g., "Interview", "Network", "Coffee Chat")
- Only import events matching user-defined patterns
- Optionally import all events and allow post-import filtering

### 6. Sync Frequency:
- **Initial import**: Manual trigger by user (button: "Import Calendar")
- **Automatic refresh**: Every 6 hours using Agenda scheduled job
- **Manual refresh**: User-triggered button for immediate sync (show last sync timestamp)
- **Intelligent updates**:
  - Store ETag or Last-Modified headers from calendar URLs
  - Only re-parse if calendar changed (reduces unnecessary processing)
  - Track last successful sync timestamp per calendar
- **Error handling**:
  - Retry failed syncs 3 times with exponential backoff (1s, 2s, 4s)
  - Notify user via email/notification if sync fails persistently (>3 attempts)
  - Display sync status in UI with error messages
  - Allow user to disable auto-sync for problematic calendars

### 7. Data Storage:
**MongoDB Schema Design**:
```typescript
// calendar_events collection
{
  _id: ObjectId,
  userId: ObjectId,
  externalId: String, // UID from iCalendar
  calendarSourceId: ObjectId, // Reference to calendar_sources
  title: String,
  description: String,
  location: String,
  startTime: Date, // UTC
  endTime: Date, // UTC
  attendees: [String],
  isRecurring: Boolean,
  recurrenceRule: String, // RRULE if applicable
  linkedJobId: ObjectId, // Optional: link to job application
  createdAt: Date,
  updatedAt: Date
}

// calendar_sources collection
{
  _id: ObjectId,
  userId: ObjectId,
  name: String, // "Google Calendar - Work"
  url: String, // Calendar URL (encrypted if contains credentials)
  type: String, // 'google', 'icloud', 'webcal', 'file'
  lastSyncAt: Date,
  lastSyncStatus: String, // 'success', 'failed', 'pending'
  syncFrequency: Number, // Hours between syncs
  isActive: Boolean,
  errorMessage: String, // Last error if sync failed
}
```

**Event Linking**:
- Automatically match calendar events to job applications by:
  - Company name in event title/location
  - Job title in event description
  - Date/time proximity to application milestones
- Allow manual linking via UI (drag event to job card)
- Display linked events on job detail page

**Preserve original data**:
- Store raw iCalendar data in separate field for debugging
- Track sync history in `calendar_sync_logs` collection
- Maintain audit trail for troubleshooting

**Performance Optimization**:
- Index on `userId` and `startTime` for fast queries
- Implement pagination for event lists
- Cache parsed events in memory (Redis if scaling)

## 5. Notification System

### Email (Minimum Viable Product)
**Decision**: AWS SES (Simple Email Service)
**Rationale**:
- **Most cost-effective**: $0.10 per 1,000 emails after free tier - for 1,000 notifications/month = $0.10/month
- **Generous free tier**: 62,000 emails/month free when hosted on AWS EC2 (or 3,000/month on other hosting)
- **High deliverability**: Enterprise-grade infrastructure with excellent inbox placement rates
- **Scalability**: Handles millions of emails with consistent performance
- **Integration**: Works seamlessly with Nodemailer library (`nodemailer-ses-transport`)
- **No vendor lock-in**: SMTP interface allows easy migration to other providers if needed
- **Production-ready**: Used by enterprises for transactional emails

**Setup Complexity Note**:
- Initial setup requires domain verification (DNS records) and moving out of sandbox mode (one-time request)
- Once configured, ongoing usage is straightforward
- For MVP/development, can use Nodemailer with Gmail SMTP (free, but limited to 500 emails/day and lower deliverability)

**Alternatives Considered**:
- **Resend**: Modern developer experience with 3,000 emails/month free tier and React Email integration. Excellent choice but slightly more expensive at scale ($20/month for 50,000 emails vs AWS SES $5)
- **SendGrid**: User-friendly interface with 100 emails/day free tier (~3,000/month), but $14.95/month for 40,000 emails is significantly more expensive than AWS SES ($4). Slow support response times reported
- **Nodemailer with SMTP (Gmail, Outlook)**: Free but daily limits (500/day), deliverability issues, risk of account suspension. Not recommended for production

**Implementation**:

**Notification Types**:
1. **Post reminders**: "Your LinkedIn post is scheduled in 15 minutes"
2. **Recruiter follow-ups**: "It's been 2 weeks since you contacted [Recruiter Name]"
3. **Interview reminders**: "Interview with [Company] tomorrow at 9:00 AM"
4. **Daily digest**: Summary of today's tasks, scheduled posts, upcoming interviews
5. **Weekly digest**: SSI update reminder, weekly activity summary, job search progress
6. **System notifications**: Calendar sync failures, API errors, scheduled post failures

**Email Templates**:
- Use Handlebars or EJS for HTML email templates
- Responsive design (mobile-friendly)
- Professional styling with company branding
- Plain text alternative for accessibility
- Unsubscribe link in footer (required by CAN-SPAM Act)

**Configuration**:
```typescript
// Example: Nodemailer with AWS SES
import nodemailer from 'nodemailer';
import aws from '@aws-sdk/client-ses';

const ses = new aws.SES({ region: 'us-east-1' });
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: 'noreply@yourapp.com',
    to,
    subject,
    html,
    text: stripHtml(html), // Plain text fallback
  });
}
```

**User Preferences**:
- Configurable notification preferences per user (stored in MongoDB)
- Enable/disable each notification type
- Choose email frequency (instant, daily digest, weekly digest)
- Quiet hours (no notifications during sleep hours)
- Unsubscribe functionality with one-click re-enable

**Queue and Retry Logic**:
- Use Agenda to queue email jobs
- Retry failed sends 3 times with exponential backoff
- Log all email attempts for debugging
- Alert admin if email service is consistently failing

**Deliverability Best Practices**:
- Set up SPF, DKIM, and DMARC records for domain
- Monitor bounce and complaint rates
- Implement email verification on signup
- Avoid spam trigger words in subject lines
- Include physical mailing address in footer (CAN-SPAM compliance)

### Desktop Notifications (Nice-to-have)
**Approach**: Web Push API with service workers
**Browser Support Considerations**:
- ✅ Chrome, Edge, Firefox: Full support since 2015+
- ✅ Safari 16.4+ (March 2023): Full support including iOS 16.4+
- ✅ Opera: Full support
- ⚠️ Requires HTTPS (automatically satisfied by modern hosting platforms like Vercel, Netlify)
- **Universal compatibility in 2025**: All major browsers now support Web Push API

**Implementation Strategy**:

**1. User Permission**:
- Request notification permission on first visit after user has engaged with the app (not immediately on landing page - reduces denial rate)
- Non-intrusive prompt: "Stay updated with reminders? Enable notifications"
- Respect user's decision; don't ask repeatedly if denied

**2. Service Worker Registration**:
```typescript
// Register service worker for background notification handling
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    });
}
```

**3. Push Subscription**:
```typescript
// Generate push subscription endpoint using Web Push API
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
});

// Send subscription to backend for storage
await fetch('/api/notifications/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(subscription),
});
```

**4. Server Integration**:
- Use `web-push` npm package for sending notifications from Node.js backend
- Generate VAPID keys (once): `npx web-push generate-vapid-keys`
- Store public/private keys in environment variables
- Store push subscriptions in MongoDB per user

**5. Notification Triggers**:
- Post scheduled for publishing in 15 minutes
- New recruiter follow-up reminder
- Daily summary at user-configured time (e.g., 8:00 AM)
- Missed follow-up reminders
- Interview starting soon (1 hour before)
- Calendar sync completed/failed

**Backend Implementation**:
```typescript
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:noreply@yourapp.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendPushNotification(subscription: PushSubscription, payload: any) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    if (error.statusCode === 410) {
      // Subscription expired - remove from database
      await deleteSubscription(subscription);
    }
  }
}
```

**Service Worker (service-worker.js)**:
```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/logo-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url },
    actions: [
      { action: 'open', title: 'View' },
      { action: 'close', title: 'Dismiss' }
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open') {
    clients.openWindow(event.notification.data.url);
  }
});
```

**Technical Details**:
- **Subscription expiration**: Handle gracefully by detecting expired subscriptions (HTTP 410 response) and removing from database
- **Subscription renewal**: Prompt user to re-enable if subscription expires
- **Graceful degradation**: Fall back to email if push notification fails
- **Offline support**: Queue notifications if user offline; deliver when back online
- **Click actions**: Open specific app page when notification clicked (e.g., job detail, post editor)

### Mobile Notifications (Stretch Goal)
**Approach**: Progressive Web App (PWA) with Web Push API
**Feasibility Assessment**:
- ✅ **iOS support finally available**: iOS 16.4+ (March 2023) added full PWA notification support, making this viable in 2025
- ✅ **Cross-platform**: Same infrastructure works on Android (Chrome), iOS (Safari), and desktop browsers
- ✅ **No native app needed**: Avoid complexity and cost of developing/maintaining native iOS/Android apps
- ✅ **Installable**: Users can "install" web app to home screen with native-like experience
- ✅ **Offline support**: Service workers enable offline functionality

**Implementation Considerations**:

**1. PWA Manifest**:
```json
// public/manifest.json
{
  "name": "Job Search Manager",
  "short_name": "JobSearch",
  "description": "Manage your international job search with AI-powered tools",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1890ff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**2. Service Worker for Offline Support**:
- Cache static assets (HTML, CSS, JS, images)
- Cache API responses with stale-while-revalidate strategy
- Offline fallback page
- Background sync for failed API requests

**3. Same Notification Infrastructure**:
- Reuse desktop Web Push API code (no additional implementation)
- Same VAPID keys, same subscription management
- Test on iOS Safari and Android Chrome browsers

**4. Installation Prompt**:
```typescript
// Prompt user to install PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show custom install button
  showInstallButton();
});

installButton.addEventListener('click', async () => {
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} install prompt`);
});
```

**Testing Requirements**:
- Test on iOS Safari (iPhone/iPad with iOS 16.4+)
- Test on Android Chrome
- Test on desktop browsers (Chrome, Firefox, Safari, Edge)
- Verify notifications work when app is closed/backgrounded
- Test offline functionality

**Alternative - Firebase Cloud Messaging (NOT RECOMMENDED for MVP)**:
- Only needed for advanced features: user segmentation, targeting, A/B testing, analytics, message scheduling
- Adds complexity: requires Firebase SDK, Google account, additional configuration
- Adds dependency on Google infrastructure
- **Unnecessary for single-user app** - native Web Push API is sufficient
- Consider FCM only if future requirements include: mass notifications, advanced analytics, native mobile app

### Summary of Notification Strategy:
- **Phase 1 (MVP - Immediate)**: Email notifications via AWS SES ($0.10/month)
- **Phase 2 (Nice-to-have - Month 2-3)**: Desktop Web Push API notifications (free)
- **Phase 3 (Stretch - Month 4-6)**: PWA mobile notifications using same Web Push infrastructure (free)
- **Future (Only if needed)**: Firebase Cloud Messaging for advanced features

**Cost Comparison**:
- AWS SES: $0.10/month for 1,000 emails
- Web Push API: Free (no server costs beyond existing backend)
- PWA: Free (just static assets)
- Total notification costs: ~$0.10-0.20/month

## 6. Testing Strategy

### Backend Tests
**Framework**: Vitest
**Rationale**:
- **4x faster than Jest** for large test suites (parallel execution, optimized module resolution)
- **Native ESM and TypeScript support** without configuration (no babel-jest or ts-jest needed)
- **Jest-compatible API**: Most Jest tests run in Vitest with zero or minimal changes
- **Modern and actively maintained**: Built specifically for Vite ecosystem (2025 standard)
- **Better developer experience**: Fast watch mode, instant feedback, clear error messages
- **Excellent for Node.js API testing**: Works seamlessly with Supertest for HTTP testing
- **Industry trend**: Vue and Svelte ecosystems have adopted Vitest as the default

**Alternatives Considered**:
- **Jest**: Mature and widely used, but slower performance and requires complex configuration for ESM/TypeScript. Still has better React Native support
- **Mocha + Chai**: Older framework with more manual setup; lacks modern features like snapshot testing

**Unit Testing Approach**:
Focus on testing individual components in isolation:
- **Route handlers**: Test each Express route's request/response logic
- **Middleware**: Test authentication, error handling, validation middleware
- **Utility functions**: Test date/time conversions, calendar parsing, data transformations
- **Business logic**: Test job status transitions, post scheduling, notification triggering
- **Target**: 80%+ code coverage for critical paths (authentication, job management, scheduling)

**Integration Testing Approach**:
Test complete API endpoints with real database:
- **Use mongodb-memory-server**: Spin up isolated in-memory MongoDB instance for each test suite
- **Test complete workflows**: User registration → login → create job → update status → delete
- **Test authentication flows**: Login, token refresh, logout, permission checks
- **Test job CRUD operations**: Create, read, update, delete with validation
- **Test calendar sync**: Parse iCalendar data, store events, link to jobs
- **Test API contracts**: Ensure request/response formats match OpenAPI spec

**External API Mocking**:
Avoid hitting real external APIs to prevent rate limits and costs:
- **LinkedIn API**: Use MSW (Mock Service Worker) or nock to intercept HTTP requests and return mock responses
- **Claude API**: Mock AI-generated content with predefined samples
- **Email service**: Use AWS SES test mode or mock email sending (don't send real emails in tests)
- **Calendar URLs**: Mock iCalendar feed responses with sample .ics data

**Testing Tools**:
- **Vitest**: Test runner and assertion library
- **Supertest**: HTTP request testing for Express routes
- **mongodb-memory-server**: Isolated in-memory MongoDB for integration tests
- **MSW (Mock Service Worker)**: Intercept and mock API requests (modern alternative to nock)
- **@faker-js/faker**: Generate realistic test data (names, emails, dates, companies)

**Example Test**:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';

describe('POST /api/jobs', () => {
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDatabase(mongoServer.getUri());
  });

  afterEach(async () => {
    await disconnectDatabase();
    await mongoServer.stop();
  });

  it('should create a new job application', async () => {
    const response = await request(app)
      .post('/api/jobs')
      .set('Authorization', 'Bearer valid-token')
      .send({
        company: 'Google',
        position: 'Software Engineer',
        status: 'applied',
      });

    expect(response.status).toBe(201);
    expect(response.body.company).toBe('Google');
  });
});
```

### Frontend Tests
**Framework**: Vitest + React Testing Library
**Rationale**:
- **Vitest**: Consistent testing experience across frontend and backend (same API, same config)
- **React Testing Library**: Enforces user-centric testing philosophy (test behavior, not implementation details)
- **Fast execution**: Leverages Vite's build pipeline for instant test feedback
- **Built-in JSX support**: No additional configuration for React components
- **Ant Design compatibility**: React Testing Library works seamlessly with Ant Design components
- **Accessibility focus**: Encourages testing with accessible queries (by role, label, text)

**Alternatives Considered**:
- **Jest + React Testing Library**: More common combination but slower and requires more configuration
- **Cypress Component Testing**: Good for visual testing but slower than unit tests; better suited for E2E

**Component Testing Approach**:
Test components from user perspective:
- **User interactions**: Click buttons, fill forms, select dropdowns, drag-and-drop
- **Conditional rendering**: Components show/hide based on state, props, and permissions
- **Form validation**: Test Ant Design Form validation rules and error messages
- **API integration**: Test React Query hooks with mocked API responses
- **Accessibility**: Verify ARIA labels, keyboard navigation, screen reader support
- **Ant Design components**: Test interactions with Table, Form, Modal, Select, DatePicker, etc.

**Testing Library**:
- Use `@testing-library/react` for rendering components
- Use `@testing-library/user-event` for realistic user interactions (better than fireEvent)
- Use `@testing-library/jest-dom` for extended matchers (toBeVisible, toHaveValue, etc.)

**Key Test Scenarios**:
1. **Kanban board**:
   - Render job cards in correct columns
   - Drag job card from "Applied" to "Interview"
   - Update job status in backend after drag

2. **Job form**:
   - Fill out all required fields
   - Submit form with valid data
   - Show validation errors for invalid inputs
   - Ant Design Form integration

3. **Calendar view**:
   - Display events from API
   - Filter events by date range
   - Click event to view details
   - Link event to job application

4. **Authentication**:
   - Login with credentials
   - Show error for invalid credentials
   - Logout and clear tokens
   - Redirect to login if unauthorized

5. **Content generation**:
   - Click "Generate Post" button
   - Show loading state during API call
   - Display generated content in textarea
   - Allow editing before saving

**Example Test**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobForm from './JobForm';

describe('JobForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<JobForm onSubmit={onSubmit} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/company/i), 'Google');
    await user.type(screen.getByLabelText(/position/i), 'Software Engineer');
    await user.selectOptions(screen.getByLabelText(/status/i), 'applied');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        company: 'Google',
        position: 'Software Engineer',
        status: 'applied',
      });
    });
  });
});
```

**Ant Design Component Testing**:
```typescript
import { Form, Input, Button } from 'antd';

it('should show validation error for empty required field', async () => {
  render(<LoginForm />);

  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/please input your email/i)).toBeInTheDocument();
});
```

### E2E Tests
**Tool**: Playwright
**Rationale**:
- **Superior browser support**: Chromium, Firefox, WebKit (Safari) - critical for cross-browser testing
- **Native parallel execution**: Run tests concurrently for faster CI/CD pipelines (no paid tier required)
- **Better network interception**: More flexible mocking and request interception than Cypress
- **Multi-tab and multi-domain support**: Critical for LinkedIn OAuth flows (redirect to LinkedIn → back to app)
- **Built-in debugging tools**: Trace viewer with screenshots/videos, execution timeline, network logs
- **Modern and actively maintained**: Recommended for new projects in 2025 by industry experts
- **Better performance**: Faster execution than Cypress for large test suites
- **Auto-waiting**: Automatically waits for elements to be actionable (reduces flaky tests)

**Alternatives Considered**:
- **Cypress**: Excellent debugging UX with time-travel and visual test runner, but:
  - ❌ No Safari/WebKit support (can't test on Apple browsers)
  - ❌ No parallel execution in free tier (requires paid Dashboard)
  - ❌ Struggles with multi-domain OAuth flows (LinkedIn redirects)
  - ✅ Better suited for teams prioritizing developer experience over comprehensive browser coverage

**Critical User Flows to Test**:

**1. Authentication Flow**:
- User registration with email/password
- Login with valid credentials
- Show error for invalid credentials
- LinkedIn OAuth connection:
  - Click "Connect LinkedIn"
  - Redirect to LinkedIn login
  - Grant permissions
  - Redirect back to app with access token
- Token refresh on expiration
- Session persistence across page reloads
- Logout and token clearing

**2. Job Management**:
- Add new job application:
  - Fill all required fields (company, position, location, URL)
  - Select status from dropdown
  - Upload resume/cover letter
  - Submit form
- View job in Kanban board:
  - Verify job card appears in correct column
  - Check all details displayed correctly
- Move job through stages:
  - Drag from "Applied" → "Screening"
  - Drag from "Screening" → "Interview"
  - Drag from "Interview" → "Offer"
- Edit job application:
  - Click edit button
  - Modify fields
  - Save changes
- Delete job application:
  - Click delete button
  - Confirm deletion in modal
- Filter and search:
  - Search by company name
  - Filter by status
  - Filter by date range

**3. Content Generation**:
- Generate LinkedIn post:
  - Click "Create Post" button
  - Enter post idea in textarea
  - Click "Generate with AI"
  - Verify loading state appears
  - Verify generated content displays
- Edit generated content:
  - Modify text in editor
  - Format text (bold, italic, lists)
- Schedule post:
  - Select future date/time
  - Click "Schedule"
  - Verify post appears in calendar
- Publish post to LinkedIn:
  - Click "Publish Now"
  - Verify success message
  - Verify post marked as published

**4. Calendar Integration**:
- Import calendar:
  - Click "Add Calendar"
  - Enter webcal:// URL
  - Click "Import"
  - Verify events load
- View events in calendar:
  - Switch between month/week/day views
  - Click event to view details
- Link event to job:
  - Drag calendar event to job card
  - Verify link created
  - View linked events on job detail page
- Manual sync:
  - Click "Refresh Calendar"
  - Verify new events appear

**5. Recruiter Management**:
- Add recruiter profile:
  - Click "Add Recruiter"
  - Fill form (name, company, LinkedIn URL)
  - Submit
- Track communication:
  - Add note about conversation
  - Log email sent
  - Set follow-up reminder
- View recruiter list:
  - Filter by company
  - Search by name

**E2E Testing Strategy**:

**Environment Setup**:
- Run tests against **staging environment** (not production) with test data
- Use separate test database that can be reset between runs
- Mock external APIs (LinkedIn, Claude) to avoid rate limits and costs:
  - Intercept LinkedIn OAuth and return mock tokens
  - Intercept Claude API and return predefined content

**Test Data Management**:
- **Seed database** with known test data before each test run
- Use fixtures for consistent test data (users, jobs, recruiters)
- **Clean up** after tests complete (delete test data)
- Use factories for creating test data with faker.js

**Playwright Configuration**:
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
});
```

**Example E2E Test**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Job Application Flow', () => {
  test('should create and publish job application', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button:has-text("Login")');

    // Navigate to jobs
    await expect(page).toHaveURL('/dashboard');
    await page.click('text=Jobs');

    // Create new job
    await page.click('button:has-text("Add Job")');
    await page.fill('[name="company"]', 'Google');
    await page.fill('[name="position"]', 'Software Engineer');
    await page.selectOption('[name="status"]', 'applied');
    await page.click('button:has-text("Submit")');

    // Verify job appears in Kanban
    await expect(page.locator('.job-card:has-text("Google")')).toBeVisible();
  });
});
```

**CI/CD Integration**:
- Run Playwright tests in GitHub Actions / GitLab CI
- Run on pull requests before merging
- Upload test artifacts (screenshots, videos, traces) on failure
- Block deployment if tests fail

**Debugging Failed Tests**:
- Use Playwright Inspector: `npx playwright test --debug`
- View trace files: `npx playwright show-trace trace.zip`
- Screenshots and videos captured automatically on failure
- Network logs available in trace viewer

**Performance Considerations**:
- Use `fullyParallel: true` to run tests concurrently
- Limit workers in CI to avoid resource exhaustion
- Use `page.goto('/', { waitUntil: 'networkidle' })` sparingly (slows tests)
- Prefer explicit waits over arbitrary timeouts

## 7. Job Scheduling

**Decision**: Agenda with MongoDB
**Rationale**:
- **Native MongoDB integration**: Stores job state directly in MongoDB (no additional infrastructure like Redis required)
- **Persistence**: Jobs survive application restarts (critical for scheduled LinkedIn posts - if server crashes, scheduled posts won't be lost)
- **Reliability**: Built-in automatic retry logic with exponential backoff for failed jobs
- **Simple setup**: Minimal configuration, works out-of-the-box with existing MongoDB connection
- **Job management**: Easy to query, update, or cancel scheduled jobs via MongoDB (standard CRUD operations)
- **Suitable for moderate scale**: Handles hundreds of scheduled jobs efficiently (more than sufficient for single-user app)
- **Monitoring**: Direct access to job status via MongoDB queries (no separate queue monitoring tool needed)
- **No additional costs**: Uses existing MongoDB database (no Redis hosting fees)

**Use Cases**:
1. **Scheduled LinkedIn posts**: Publish content at specific future times in user's timezone
2. **Calendar sync**: Refresh external calendars every 6 hours
3. **Reminder notifications**: Email/push notifications for recruiter follow-ups
4. **Recurring tasks**: Daily digests (8 AM), weekly SSI reminders (Monday mornings)
5. **Data cleanup**: Archive old jobs (90 days), purge expired tokens (monthly)

**Alternatives Considered**:
- **node-cron**:
  - ✅ Simple API for cron-style scheduling
  - ❌ No persistence - jobs lost on restart (UNACCEPTABLE for scheduled posts)
  - ❌ No job history or error tracking
  - ❌ No distributed locking (problems with multiple server instances)

- **BullMQ**:
  - ✅ Superior performance (10x+ faster than Agenda)
  - ✅ Advanced features: priority queues, rate limiting, job progress tracking
  - ✅ Excellent for high-volume job processing (thousands of jobs per minute)
  - ❌ **Requires Redis infrastructure** - additional cost (~$7/month for Redis hosting) and complexity
  - ❌ Overkill for single-user app with <100 scheduled jobs
  - ⚠️ Consider BullMQ if scaling to multi-user SaaS with thousands of users

**Missed Schedule Handling**:
What happens when server experiences downtime?

**Scenario**: LinkedIn post scheduled for 2:00 PM, but server crashes at 1:00 PM and restarts at 3:00 PM.

**Agenda's Built-in Recovery**:
1. **Automatic catch-up**: On startup, Agenda queries MongoDB for jobs that should have executed during downtime
2. **Immediate execution**: Missed jobs execute immediately after startup (with respect to priority)
3. **Lockout mechanism**: Prevents duplicate execution if multiple server instances exist (uses MongoDB locking)
4. **Configurable behavior**: Can configure whether to run missed jobs or skip them

**Application-Level Handling**:
```typescript
// Example: Check if post is too late to publish
agenda.define('publish-linkedin-post', async (job) => {
  const { postId, scheduledTime } = job.attrs.data;
  const now = DateTime.now();
  const scheduled = DateTime.fromJSDate(scheduledTime);
  const minutesLate = now.diff(scheduled, 'minutes').minutes;

  if (minutesLate > 60) {
    // More than 1 hour late - notify user instead of posting
    await notifyUser({
      type: 'missed_post',
      message: `Scheduled post missed due to system downtime. Please reschedule.`,
      postId,
    });
    return;
  }

  // Post is slightly late but still relevant - publish anyway
  await publishToLinkedIn(postId);
});
```

**Manual Review Dashboard**:
- Admin page showing all scheduled jobs
- Filter by status: pending, running, completed, failed
- Reschedule or cancel jobs manually
- View job execution history and error logs

**Notification on Missed Jobs**:
- Send email alert to user if scheduled post was missed
- Include "Reschedule" button in email for one-click rescheduling

**Implementation Details**:

**Setup**:
```typescript
import Agenda from 'agenda';
import { MongoClient } from 'mongodb';

const mongoConnectionString = process.env.MONGODB_URI;
const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: 'agendaJobs' },
  processEvery: '30 seconds', // Check for new jobs every 30 seconds
  maxConcurrency: 10, // Process up to 10 jobs simultaneously
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await agenda.stop();
  process.exit(0);
});

await agenda.start();
```

**Job Definitions**:
```typescript
// Publish LinkedIn post at scheduled time
agenda.define('publish-linkedin-post', async (job) => {
  const { postId, userId } = job.attrs.data;

  try {
    // Fetch post from database
    const post = await Post.findById(postId);

    // Publish to LinkedIn API
    const result = await linkedInAPI.createPost({
      userId,
      content: post.content,
    });

    // Update post status in database
    await Post.updateOne(
      { _id: postId },
      { status: 'published', publishedAt: new Date(), linkedInId: result.id }
    );

    // Send success notification
    await sendNotification(userId, {
      type: 'post_published',
      message: 'Your LinkedIn post has been published successfully!',
      postId,
    });
  } catch (error) {
    // Log error and notify user
    console.error('Failed to publish post:', error);
    await sendNotification(userId, {
      type: 'post_failed',
      message: 'Failed to publish LinkedIn post. Please try again.',
      postId,
      error: error.message,
    });

    // Retry job up to 3 times
    if (job.attrs.failCount < 3) {
      throw error; // Agenda will retry automatically
    }
  }
});

// Sync external calendar feeds
agenda.define('sync-calendar', { priority: 'low', concurrency: 5 }, async (job) => {
  const { userId, calendarSourceId } = job.attrs.data;

  try {
    const calendarSource = await CalendarSource.findById(calendarSourceId);
    const events = await ical.async.fromURL(calendarSource.url);

    // Process and store events
    for (const event of Object.values(events)) {
      if (event.type === 'VEVENT') {
        await CalendarEvent.updateOne(
          { externalId: event.uid, userId },
          { /* event data */ },
          { upsert: true }
        );
      }
    }

    // Update last sync timestamp
    await CalendarSource.updateOne(
      { _id: calendarSourceId },
      { lastSyncAt: new Date(), lastSyncStatus: 'success' }
    );
  } catch (error) {
    await CalendarSource.updateOne(
      { _id: calendarSourceId },
      { lastSyncStatus: 'failed', errorMessage: error.message }
    );
  }
});

// Send follow-up reminder
agenda.define('send-reminder', async (job) => {
  const { userId, reminderId, type } = job.attrs.data;

  const reminder = await Reminder.findById(reminderId);

  // Send email notification
  await sendEmail({
    to: reminder.userEmail,
    subject: `Reminder: ${reminder.title}`,
    body: reminder.description,
  });

  // Send push notification if enabled
  if (reminder.pushEnabled) {
    await sendPushNotification(userId, {
      title: reminder.title,
      body: reminder.description,
    });
  }

  // Mark reminder as sent
  await Reminder.updateOne({ _id: reminderId }, { sentAt: new Date() });
});
```

**Scheduling Jobs**:
```typescript
// Schedule one-time job
await agenda.schedule('2025-10-13T09:00:00Z', 'publish-linkedin-post', {
  postId: post._id,
  userId: user._id,
});

// Schedule recurring job (every 6 hours)
await agenda.every('6 hours', 'sync-calendar', {
  userId: user._id,
  calendarSourceId: calendar._id,
});

// Schedule with cron syntax (daily at 8 AM)
await agenda.every('0 8 * * *', 'send-daily-digest', {
  userId: user._id,
});

// Cancel job
await agenda.cancel({ name: 'publish-linkedin-post', 'data.postId': postId });
```

**Monitoring and Debugging**:
```typescript
// Listen to job events
agenda.on('start', (job) => {
  console.log(`Job ${job.attrs.name} starting`);
});

agenda.on('complete', (job) => {
  console.log(`Job ${job.attrs.name} completed`);
});

agenda.on('fail', (err, job) => {
  console.error(`Job ${job.attrs.name} failed:`, err);
});

// Query job status via MongoDB
const pendingJobs = await agenda.jobs({ nextRunAt: { $ne: null } });
const failedJobs = await agenda.jobs({ failCount: { $gt: 0 } });
```

**Dashboard Queries**:
```typescript
// Get all scheduled posts
const scheduledPosts = await agenda.jobs({
  name: 'publish-linkedin-post',
  nextRunAt: { $gt: new Date() },
});

// Get jobs that failed
const failedJobs = await agenda.jobs({
  lastFinishedAt: { $exists: true },
  failCount: { $gt: 0 },
});
```

**Best Practices**:
- **Idempotency**: Design jobs to be safely re-run (in case of retries)
- **Timeout handling**: Set reasonable timeouts for external API calls
- **Error logging**: Log all errors with context for debugging
- **Job data size**: Keep job data small (store IDs, not full documents)
- **Cleanup**: Regularly purge old completed jobs to prevent collection bloat

```typescript
// Clean up old jobs (monthly)
agenda.define('cleanup-old-jobs', async (job) => {
  const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toJSDate();
  await agenda.cancel({
    lastFinishedAt: { $lt: thirtyDaysAgo },
  });
});

agenda.every('0 0 1 * *', 'cleanup-old-jobs'); // Run on 1st of each month
```

## 8. Timezone Handling

**Storage Strategy**: Store all timestamps in UTC in MongoDB, store user's timezone preference in user profile

**Rationale**:
- **UTC storage is industry-standard best practice** for distributed systems and international applications
- **Eliminates ambiguity**: No confusion with daylight saving time (DST) transitions
- **Simplifies backend logic**: All database queries, comparisons, and calculations use consistent UTC
- **Ensures consistency**: All timestamps are in the same timezone regardless of server location
- **Future-proof**: Easy to add multi-timezone support for international job searches
- **Database compatibility**: MongoDB stores dates as UTC by default (BSON Date type)

**Library**: Luxon
**Rationale**:
- **Built on modern Intl API**: Uses browser's native Internationalization API (no timezone database bundles required)
- **Comprehensive timezone support**: Handles all IANA timezones with DST transitions automatically
- **Immutable API**: Similar to Moment.js but with immutable objects (prevents accidental mutations)
- **Chainable, fluent API**: Readable and intuitive code for complex timezone operations
- **First-class TypeScript support**: Excellent type definitions out of the box
- **Better timezone features than alternatives**: More intuitive API than date-fns-tz for timezone-heavy operations
- **Active maintenance**: Regularly updated with timezone database changes

**Alternatives Considered**:
- **date-fns-tz**:
  - ✅ Modular and tree-shakable (smaller bundle size)
  - ✅ Functional programming style
  - ❌ Requires more manual timezone handling (less intuitive API)
  - ❌ Better suited for simple date operations without heavy timezone requirements

- **Day.js with timezone plugin**:
  - ✅ **Ant Design uses Day.js by default** (good compatibility)
  - ✅ Extremely lightweight (2KB gzipped)
  - ❌ Plugin-based approach adds setup complexity
  - ❌ Less comprehensive timezone features compared to Luxon
  - ⚠️ Can be used for Ant Design DatePicker/Calendar components while using Luxon for backend logic

**Recommendation**: Use **Luxon for backend/business logic** (scheduling, timezone conversions) and optionally use **Day.js for Ant Design DatePicker** components if needed for consistency.

**User Timezone Detection**:

### 1. Initial Detection (Frontend):
```typescript
// Automatically detect user's timezone on first login
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// Example: "America/New_York", "Europe/London", "Asia/Tokyo"

// Send to backend during registration/login
await api.updateUserProfile({ timezone: userTimezone });
```

### 2. Store in User Profile (Backend):
```typescript
// User schema in MongoDB
{
  _id: ObjectId,
  email: String,
  timezone: String, // "America/New_York"
  createdAt: Date, // UTC
  updatedAt: Date, // UTC
}
```

### 3. Manual Override (Settings Page):
```typescript
// Allow users to change timezone in settings
<Select
  value={user.timezone}
  onChange={(timezone) => updateUserProfile({ timezone })}
>
  {timezones.map(tz => (
    <Option key={tz} value={tz}>{tz}</Option>
  ))}
</Select>
```
- Useful for users traveling or managing job searches across multiple timezones
- Provide search/autocomplete for easier timezone selection

### 4. Validation:
```typescript
import { IANAZone } from 'luxon';

// Validate timezone string against IANA database
function isValidTimezone(timezone: string): boolean {
  return IANAZone.isValidZone(timezone);
}

// Fallback to UTC if invalid
const userTimezone = isValidTimezone(user.timezone) ? user.timezone : 'UTC';
```

**Scheduling Logic - Posting in User's Local Time**:

### Scenario: User wants to schedule LinkedIn post for "tomorrow at 9:00 AM their time"

**Frontend: User selects date/time in their local timezone**
```typescript
import { DateTime } from 'luxon';

// User picks "Oct 13, 2025 at 9:00 AM" via Ant Design DatePicker
const userSelectedDate = new Date(2025, 9, 13, 9, 0); // Local browser time

// Convert to user's timezone (explicit)
const scheduledTime = DateTime.fromJSDate(userSelectedDate, {
  zone: userTimezone  // e.g., "America/Los_Angeles" (PDT)
});

console.log(scheduledTime.toString());
// "2025-10-13T09:00:00.000-07:00" (9 AM Pacific)

// Convert to UTC for storage
const utcTime = scheduledTime.toUTC();

console.log(utcTime.toString());
// "2025-10-13T16:00:00.000Z" (4 PM UTC)

// Send to backend
await api.schedulePost({
  scheduledAt: utcTime.toJSDate(), // JavaScript Date object in UTC
  timezone: userTimezone, // Store for display purposes
  content: postContent,
});
```

**Backend: Store UTC timestamp in MongoDB**
```typescript
// Store in MongoDB
const post = await Post.create({
  userId: user._id,
  content: postContent,
  scheduledAt: utcTime, // MongoDB Date type (stored as UTC)
  userTimezone: userTimezone, // Store user's timezone for reference
  status: 'scheduled',
});

// Schedule Agenda job with UTC time
await agenda.schedule(
  utcTime.toJSDate(), // Agenda uses JavaScript Date (interprets as UTC)
  'publish-linkedin-post',
  { postId: post._id }
);
```

**Backend Job Execution**:
```typescript
// Agenda job runs based on UTC timestamp
agenda.define('publish-linkedin-post', async (job) => {
  const { postId } = job.attrs.data;

  // Job executes at exact moment: Oct 13, 2025 16:00 UTC = Oct 13, 2025 9:00 AM Pacific
  const post = await Post.findById(postId);
  await publishToLinkedIn(post);

  console.log(`Post published at ${DateTime.now().toUTC().toString()}`);
  // "2025-10-13T16:00:03.123Z"
});
```

**Frontend Display Logic**:
```typescript
// Display scheduled time in user's CURRENT timezone
const storedUtcTime = DateTime.fromJSDate(post.scheduledAt, { zone: 'utc' });
const localTime = storedUtcTime.setZone(currentUserTimezone);

// Format for display
const displayTime = localTime.toLocaleString(DateTime.DATETIME_FULL);
// "Monday, October 13, 2025, 9:00 AM PDT"

// Or custom format
const customFormat = localTime.toFormat('MMM dd, yyyy \'at\' h:mm a ZZZZ');
// "Oct 13, 2025 at 9:00 AM Pacific Daylight Time"
```

**Ant Design DatePicker Integration**:
```typescript
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Set user's timezone
const userTimezone = 'America/Los_Angeles';

<DatePicker
  showTime
  value={post.scheduledAt ? dayjs(post.scheduledAt).tz(userTimezone) : null}
  onChange={(date) => {
    if (date) {
      // Convert to UTC for storage
      const utcDate = date.utc().toDate();
      handleScheduleChange(utcDate);
    }
  }}
  format="MMM DD, YYYY HH:mm"
/>
```

**Edge Cases Handled**:

### 1. Daylight Saving Time (DST):
```typescript
// Scenario: User schedules post for Nov 5, 2025 at 9 AM (day after DST ends in US)
const scheduledTime = DateTime.fromObject(
  { year: 2025, month: 11, day: 5, hour: 9 },
  { zone: 'America/Los_Angeles' }
);

console.log(scheduledTime.toString());
// "2025-11-05T09:00:00.000-08:00" (PST, not PDT)

const utcTime = scheduledTime.toUTC();
console.log(utcTime.toString());
// "2025-11-05T17:00:00.000Z" (UTC automatically adjusted for PST)

// Luxon handles DST transitions automatically!
```

### 2. Timezone Changes:
```typescript
// User changes timezone from "America/Los_Angeles" to "Europe/London"
const storedUtcTime = DateTime.fromJSDate(post.scheduledAt, { zone: 'utc' });

// Old timezone display
const oldLocalTime = storedUtcTime.setZone('America/Los_Angeles');
console.log(oldLocalTime.toFormat('h:mm a')); // "9:00 AM"

// New timezone display (same moment in time)
const newLocalTime = storedUtcTime.setZone('Europe/London');
console.log(newLocalTime.toFormat('h:mm a')); // "5:00 PM" (same moment)

// UI should recalculate all displayed times in new timezone
```

### 3. International Job Search:
```typescript
// User wants to post at 9 AM London time for UK jobs, but lives in LA
<TimezoneSelector
  label="Post at 9 AM in:"
  value={postTimezone}
  onChange={setPostTimezone}
/>

const londonTime = DateTime.fromObject(
  { year: 2025, month: 10, day: 13, hour: 9 },
  { zone: 'Europe/London' }
);

const utcTime = londonTime.toUTC();
// User sees: "9:00 AM GMT"
// System stores: UTC timestamp
// Job executes at correct London time regardless of server location
```

### 4. Calendar Integration:
```typescript
// External calendar events come with their own timezones
const calendarEvent = {
  summary: 'Interview with Google',
  start: '2025-10-13T14:00:00-07:00', // 2 PM Pacific
};

// Parse with original timezone
const eventTime = DateTime.fromISO(calendarEvent.start);

// Convert to UTC for storage
const utcEventTime = eventTime.toUTC();

// Display in user's current timezone
const displayTime = utcEventTime.setZone(currentUserTimezone);
console.log(displayTime.toFormat('MMM dd \'at\' h:mm a'));
// If user in New York: "Oct 13 at 5:00 PM"
// If user in London: "Oct 13 at 10:00 PM"
```

**Best Practices Applied**:
1. ✅ **Always store timestamps in UTC** (MongoDB Date type)
2. ✅ **Always include timezone in API responses** for client-side formatting
3. ✅ **Use ISO 8601 format** for API communication (e.g., "2025-10-13T16:00:00Z")
4. ❌ **Avoid storing offsets** (e.g., "-07:00") as they become invalid during DST transitions
5. ✅ **Test thoroughly around DST transition dates** (March and November in US/Europe)
6. ✅ **Log timestamps in UTC** for debugging (consistent across all servers)
7. ✅ **Display times in user's timezone** (never show UTC to end users)

**Testing DST Transitions**:
```typescript
// Test DST spring forward (March 10, 2025 at 2 AM in US)
const beforeDST = DateTime.fromObject(
  { year: 2025, month: 3, day: 9, hour: 23 },
  { zone: 'America/Los_Angeles' }
);

const afterDST = beforeDST.plus({ hours: 4 });
console.log(afterDST.toString());
// "2025-03-10T04:00:00.000-07:00" (PDT, skipped 2-3 AM)

// Test DST fall back (November 2, 2025 at 2 AM in US)
const ambiguousTime = DateTime.fromObject(
  { year: 2025, month: 11, day: 2, hour: 1, minute: 30 },
  { zone: 'America/Los_Angeles' }
);
// This time occurs twice! Luxon picks the first occurrence by default
```

**Summary**:
- **Backend**: UTC everywhere (database, logging, scheduling)
- **Frontend**: Display in user's timezone, allow timezone selection
- **API**: ISO 8601 with explicit timezone information
- **Library**: Luxon for comprehensive timezone handling
- **Testing**: Verify DST transitions, timezone changes, international scenarios

## 9. Ant Design Component Strategy

### Overview
Ant Design is an enterprise-class UI design language and React component library written in TypeScript with complete type definitions. It provides 50+ high-quality components out of the box, making it ideal for building professional web applications.

**Key Advantages**:
- Written in TypeScript with predictable static types
- Complete set of internationalization support (20+ languages)
- Powerful theme customization capabilities
- Enterprise-proven (used by Alibaba, Tencent, Baidu)
- Excellent documentation and active community
- Consistent design language across all components

### Kanban Board

**Approach**: Ant Design Card/List + dnd-kit for drag-and-drop

**Components Used**:
- `Card` - For job cards with company, position, status info
- `List` - For organizing cards in columns
- `Badge` - For status indicators, unread notifications
- `Tag` - For categorizing jobs by type, urgency, location
- `Typography` - For text formatting (company names, job titles)
- `Avatar` - For company logos
- `Dropdown` - For job card action menus (edit, delete, move)

**Drag-and-Drop Library**: @dnd-kit/core + @dnd-kit/sortable

**Rationale**:
- **react-beautiful-dnd is DEPRECATED** (Atlassian stopped maintenance in 2022)
- **dnd-kit is the modern replacement** and industry standard in 2025:
  - ✅ Actively maintained with regular updates
  - ✅ Highly customizable and performant
  - ✅ Supports complex drag-and-drop patterns (multi-container, nested lists)
  - ✅ **Accessibility-first design** with keyboard navigation (WCAG 2.1 compliant)
  - ✅ Modular architecture (import only what you need)
  - ✅ TypeScript-first with excellent type definitions
  - ✅ Handles touch events for mobile/tablet devices
  - ✅ Built-in collision detection and auto-scrolling

**Alternatives Considered**:
- **hello-pangea/dnd** (community fork of react-beautiful-dnd): Good for simple list reordering but less flexible than dnd-kit for complex Kanban boards
- **react-dnd**: Older, more complex API; overkill for this use case

**Implementation Example**:
```typescript
import { Card, Tag, Avatar, Dropdown, Menu } from 'antd';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const JobCard = ({ job }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: job._id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => editJob(job._id)}>Edit</Menu.Item>
      <Menu.Item onClick={() => deleteJob(job._id)}>Delete</Menu.Item>
    </Menu>
  );

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        hoverable
        extra={<Dropdown overlay={menu}><MoreOutlined /></Dropdown>}
      >
        <Card.Meta
          avatar={<Avatar src={job.companyLogo} />}
          title={job.position}
          description={job.company}
        />
        <div style={{ marginTop: 12 }}>
          <Tag color="blue">{job.location}</Tag>
          <Tag color="green">{job.salary}</Tag>
        </div>
      </Card>
    </div>
  );
};

const KanbanColumn = ({ status, jobs, onDragEnd }) => {
  return (
    <div className="kanban-column">
      <h3>{status}</h3>
      <SortableContext items={jobs.map(j => j._id)} strategy={verticalListSortingStrategy}>
        {jobs.map(job => <JobCard key={job._id} job={job} />)}
      </SortableContext>
    </div>
  );
};

const KanbanBoard = ({ jobs, onJobMove }) => {
  const [activeJob, setActiveJob] = useState(null);

  const handleDragStart = (event) => {
    setActiveJob(jobs.find(j => j._id === event.active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      onJobMove(active.id, over.id);
    }
    setActiveJob(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].map(status => (
          <KanbanColumn
            key={status}
            status={status}
            jobs={jobs.filter(j => j.status === status)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
      <DragOverlay>
        {activeJob ? <JobCard job={activeJob} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
```

**Features**:
- Drag job cards between columns (Applied → Screening → Interview → Offer)
- Smooth animations with CSS transforms
- Visual feedback during drag (DragOverlay component)
- Keyboard shortcuts for accessibility (Tab, Enter, Space, Arrow keys)
- Touch support for mobile/tablet use
- Responsive layout with Ant Design Grid system

### Calendar View

**Component**: Ant Design Calendar + FullCalendar (optional for advanced features)

**Primary Approach**: Ant Design Calendar for MVP

**Ant Design Calendar Component**:
- Built-in component with month/year views
- Customizable date cells via `dateCellRender` and `monthCellRender` props
- Supports custom content in each date cell
- Works seamlessly with Ant Design DatePicker for date selection
- Integrates with Day.js (Ant Design's default date library)

**Implementation Example**:
```typescript
import { Calendar, Badge, Modal } from 'antd';
import type { Dayjs } from 'dayjs';

const JobCalendar = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const dateCellRender = (date: Dayjs) => {
    const dayEvents = events.filter(e =>
      dayjs(e.startTime).isSame(date, 'day')
    );

    return (
      <ul className="events">
        {dayEvents.map(event => (
          <li key={event._id}>
            <Badge
              status={event.type === 'interview' ? 'success' : 'processing'}
              text={event.title}
            />
          </li>
        ))}
      </ul>
    );
  };

  const onSelect = (date: Dayjs) => {
    setSelectedDate(date);
    // Show events for selected date in modal
  };

  return (
    <Calendar
      dateCellRender={dateCellRender}
      onSelect={onSelect}
    />
  );
};
```

**FullCalendar Integration (Advanced)**:

If Ant Design Calendar is too limited, integrate **FullCalendar** with Ant Design styling:

**When to use FullCalendar**:
- Need week/day/agenda views (not just month view)
- Drag-and-drop event rescheduling
- Time-slot based scheduling (not just all-day events)
- Resource scheduling (multiple calendars)
- More interactive event management

**FullCalendar + Ant Design Example**:
```typescript
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal } from 'antd';

const FullCalendarView = ({ events, onEventClick, onDateClick }) => {
  return (
    <div className="ant-calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
        editable={true}
        droppable={true}
        // Style to match Ant Design theme
        themeSystem="standard"
        height="auto"
      />
    </div>
  );
};

// Custom CSS to match Ant Design
.ant-calendar-wrapper .fc {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --fc-border-color: #d9d9d9;
  --fc-button-bg-color: #1890ff;
  --fc-button-border-color: #1890ff;
  --fc-button-hover-bg-color: #40a9ff;
}
```

**Rationale**:
- **Ant Design Calendar**: Lightweight, perfect for simple month view with event badges
- **FullCalendar**: More feature-rich but heavier bundle size (~150KB); use only if advanced calendar features required
- **Recommendation**: Start with Ant Design Calendar for MVP, upgrade to FullCalendar if users need week/day views

**Calendar Features**:
- Display interview events from calendar import
- View scheduled LinkedIn posts
- Color-coding by event type:
  - 🟢 Green: Interviews
  - 🔵 Blue: Scheduled posts
  - 🟡 Yellow: Follow-up reminders
  - 🔴 Red: Deadlines
- Click event to view details in Modal
- Timezone-aware display (show all events in user's local time)
- Filter events by type (checkboxes)

### Dashboard Layout

**Components**: Ant Design Grid, Card, Statistic, Progress, Typography

**Layout Strategy**:
Ant Design provides a 24-column responsive grid system for flexible layouts.

**Dashboard Implementation**:
```typescript
import { Row, Col, Card, Statistic, Progress, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const Dashboard = ({ stats }) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Typography.Title level={2}>Job Search Dashboard</Typography.Title>

      {/* Key Metrics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Applications"
              value={stats.activeApplications}
              prefix={<SendOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Interviews Scheduled"
              value={stats.interviews}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Response Rate"
              value={stats.responseRate}
              suffix="%"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="LinkedIn SSI"
              value={stats.ssi}
              suffix="/ 100"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Application Funnel">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Typography.Text>Applied: {stats.applied}</Typography.Text>
                <Progress percent={100} showInfo={false} />
              </div>
              <div>
                <Typography.Text>Screening: {stats.screening}</Typography.Text>
                <Progress percent={(stats.screening / stats.applied) * 100} />
              </div>
              <div>
                <Typography.Text>Interview: {stats.interview}</Typography.Text>
                <Progress percent={(stats.interview / stats.applied) * 100} />
              </div>
              <div>
                <Typography.Text>Offer: {stats.offer}</Typography.Text>
                <Progress percent={(stats.offer / stats.applied) * 100} status="success" />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity">
            <Timeline>
              {recentActivities.map(activity => (
                <Timeline.Item key={activity.id} color={activity.color}>
                  {activity.description}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Upcoming Events */}
      <Row>
        <Col span={24}>
          <Card title="Upcoming This Week">
            <List
              dataSource={upcomingEvents}
              renderItem={event => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<CalendarOutlined />} />}
                    title={event.title}
                    description={dayjs(event.date).format('MMM DD, YYYY [at] h:mm A')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};
```

**Responsive Breakpoints** (Ant Design Grid):
- `xs`: <576px (mobile portrait)
- `sm`: ≥576px (mobile landscape)
- `md`: ≥768px (tablet)
- `lg`: ≥992px (desktop)
- `xl`: ≥1200px (large desktop)
- `xxl`: ≥1600px (extra large desktop)

**Dashboard Features**:
- Responsive grid adapts to screen size (4 columns on desktop, 2 on tablet, 1 on mobile)
- Real-time statistics with icons
- Progress bars showing application funnel conversion rates
- Timeline of recent activity
- Upcoming events list
- Color-coded status indicators

### Forms and Authentication

**Components**: Form, Input, Button, Checkbox, Modal, Alert, Spin

**Ant Design Form Features**:
- Built-in validation with async support
- Field-level error messages
- Automatic form state management
- TypeScript support for type-safe forms
- Layout options: horizontal, vertical, inline

**Login Form Example**:
```typescript
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginForm = ({ onLogin, error, loading }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onLogin(values.email, values.password, values.remember);
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      layout="vertical"
      size="large"
    >
      {error && (
        <Alert
          message="Login Failed"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Email"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 8, message: 'Password must be at least 8 characters!' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <a style={{ float: 'right' }} href="/forgot-password">
          Forgot password?
        </a>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Log In
        </Button>
      </Form.Item>

      <Form.Item>
        <Button
          icon={<LinkedinOutlined />}
          onClick={handleLinkedInLogin}
          block
        >
          Continue with LinkedIn
        </Button>
      </Form.Item>
    </Form>
  );
};
```

**Job Application Form Example**:
```typescript
import { Form, Input, Select, DatePicker, InputNumber, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const JobForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="company"
        label="Company"
        rules={[{ required: true, message: 'Company name is required' }]}
      >
        <Input placeholder="e.g., Google" />
      </Form.Item>

      <Form.Item
        name="position"
        label="Position"
        rules={[{ required: true, message: 'Position is required' }]}
      >
        <Input placeholder="e.g., Software Engineer" />
      </Form.Item>

      <Form.Item name="location" label="Location">
        <Input placeholder="e.g., London, UK" />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true }]}
      >
        <Select>
          <Select.Option value="applied">Applied</Select.Option>
          <Select.Option value="screening">Screening</Select.Option>
          <Select.Option value="interview">Interview</Select.Option>
          <Select.Option value="offer">Offer</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="appliedDate" label="Date Applied">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="salary" label="Salary Range">
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item name="jobUrl" label="Job URL">
        <Input placeholder="https://company.com/careers/job-id" />
      </Form.Item>

      <Form.Item name="notes" label="Notes">
        <Input.TextArea rows={4} placeholder="Additional notes..." />
      </Form.Item>

      <Form.Item name="resume" label="Resume">
        <Upload beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Upload Resume</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Save Job Application
          </Button>
          <Button onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
```

**Validation Strategy**:
- Client-side validation: Ant Design Form rules (immediate feedback)
- Server-side validation: Backend API validation (security, data integrity)
- Custom validators: Async validation (e.g., check if email already exists)
- Error handling: Display field-level and form-level errors

**Authentication UI Components**:
- Login/Register forms with Ant Design styling
- LinkedIn OAuth button with brand colors
- Password strength indicator (Progress component)
- Two-factor authentication input (OTP input)
- Account settings form
- Profile editing modal

### State Management

**Decision**: React Query (TanStack Query) + Zustand

**Rationale**:
- **React Query for server state**:
  - ✅ Automatic caching, deduplication, refetching
  - ✅ Loading/error states handled automatically
  - ✅ Optimistic updates for better UX
  - ✅ Perfect for API calls (jobs, calendar, posts)
  - ✅ Works seamlessly with Ant Design components

- **Zustand for client state**:
  - ✅ Lightweight (~1KB) with zero dependencies
  - ✅ No boilerplate (simpler than Redux)
  - ✅ TypeScript-first design
  - ✅ Hooks-based API (familiar for React developers)
  - ✅ Middleware support (persist, devtools)
  - ✅ Perfect for UI state (modals, filters, selected items)

**Alternatives Considered**:
- **Redux Toolkit**:
  - ✅ Industry standard, excellent DevTools, large ecosystem
  - ❌ More boilerplate than Zustand even with Redux Toolkit
  - ❌ Overkill for single-user application

- **React Context API**:
  - ✅ Built-in, no external dependencies
  - ❌ Performance issues with frequent updates (re-renders entire tree)
  - ❌ Not suitable for complex state logic

- **Jotai/Recoil**:
  - ✅ Atomic state management (fine-grained reactivity)
  - ❌ Newer with smaller community than Zustand/Redux
  - ❌ More complex mental model

**Implementation Example**:

**React Query for API calls**:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

// Fetch jobs
const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create job
const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (job) => api.post('/jobs', job).then(res => res.data),
    onSuccess: (newJob) => {
      queryClient.invalidateQueries(['jobs']); // Refetch jobs list
      message.success('Job application created!');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
};

// Update job status (optimistic update)
const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, status }) => api.patch(`/jobs/${jobId}`, { status }),
    onMutate: async ({ jobId, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries(['jobs']);

      // Snapshot current state
      const previousJobs = queryClient.getQueryData(['jobs']);

      // Optimistically update UI
      queryClient.setQueryData(['jobs'], (old) =>
        old.map(job => job._id === jobId ? { ...job, status } : job)
      );

      return { previousJobs };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['jobs'], context.previousJobs);
      message.error('Failed to update job status');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });
};

// Usage in component
const JobBoard = () => {
  const { data: jobs, isLoading, error } = useJobs();
  const createJob = useCreateJob();
  const updateJobStatus = useUpdateJobStatus();

  if (isLoading) return <Spin size="large" />;
  if (error) return <Alert type="error" message={error.message} />;

  return (
    <KanbanBoard
      jobs={jobs}
      onJobMove={(jobId, newStatus) => updateJobStatus.mutate({ jobId, newStatus })}
    />
  );
};
```

**Zustand for UI state**:
```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';

// UI state store
const useUIStore = create(
  persist(
    (set) => ({
      // Sidebar collapsed state
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Selected filters
      filters: {
        status: null,
        location: null,
        dateRange: null,
      },
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),
      clearFilters: () => set({
        filters: { status: null, location: null, dateRange: null }
      }),

      // Modal visibility
      modals: {
        createJob: false,
        editJob: false,
        generatePost: false,
      },
      openModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: true }
      })),
      closeModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: false }
      })),
    }),
    {
      name: 'ui-storage', // LocalStorage key
      partialPersist: true, // Only persist specific fields
    }
  )
);

// Usage in components
const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <Layout.Sider collapsed={sidebarCollapsed} onCollapse={toggleSidebar}>
      {/* Sidebar content */}
    </Layout.Sider>
  );
};

const JobFilters = () => {
  const { filters, setFilter, clearFilters } = useUIStore();

  return (
    <Space>
      <Select
        value={filters.status}
        onChange={(value) => setFilter('status', value)}
        placeholder="Filter by status"
      >
        <Select.Option value="applied">Applied</Select.Option>
        <Select.Option value="interview">Interview</Select.Option>
      </Select>
      <Button onClick={clearFilters}>Clear Filters</Button>
    </Space>
  );
};
```

**State Architecture**:
- **Server state** (React Query): Jobs, calendar events, posts, recruiters, user profile
- **Client state** (Zustand): UI state, filters, modals, sidebar, theme preferences
- **Form state** (Ant Design Form): Form fields, validation, submission
- **URL state** (React Router): Current page, query params, navigation

**Benefits**:
- Automatic loading/error states reduce boilerplate
- Optimistic updates improve perceived performance
- Caching reduces API calls
- Zustand's simplicity keeps client state manageable
- TypeScript support across all state management layers

### Theme Customization

Ant Design allows comprehensive theming via ConfigProvider:

```typescript
import { ConfigProvider, theme } from 'antd';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff', // Primary brand color
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#f5222d',
          borderRadius: 8,
          fontSize: 14,
        },
        algorithm: theme.defaultAlgorithm, // or theme.darkAlgorithm
      }}
    >
      <YourApp />
    </ConfigProvider>
  );
};
```

**Dark Mode Support**:
```typescript
const [isDarkMode, setIsDarkMode] = useState(false);

<ConfigProvider
  theme={{
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }}
>
  <Switch
    checked={isDarkMode}
    onChange={setIsDarkMode}
    checkedChildren="Dark"
    unCheckedChildren="Light"
  />
</ConfigProvider>
```

## 10. Authentication

**Strategy**: JWT (JSON Web Tokens) with access + refresh token pattern

**Rationale**:
- **Stateless authentication**: No server-side session storage required (scales horizontally)
- **Scalable for future**: Multi-device support (mobile app, browser extensions)
- **Industry standard**: Best practice for single-page applications with separate backend API
- **Compatible with OAuth**: Works seamlessly with LinkedIn OAuth flow
- **Fine-grained authorization**: Enable user roles, permissions, feature flags in future

**Implementation**:

### Access Tokens
- **Lifespan**: 15-30 minutes (short-lived for security)
- **Contains**: User ID, email, roles/permissions
- **Algorithm**: HS256 (HMAC with SHA-256) for single-server setup
- **Storage**: In-memory (React state/context) or sessionStorage on frontend
- **Transmission**: Sent in `Authorization: Bearer <token>` header on every API request
- **Validation**: Verified on every protected API endpoint

### Refresh Tokens
- **Lifespan**: 7 days (long-lived for user convenience)
- **Storage**: httpOnly, secure cookies (NOT accessible via JavaScript - prevents XSS)
- **Purpose**: Used exclusively to obtain new access tokens when they expire
- **Rotation**: New refresh token issued every time it's used (single-use tokens)
- **Database**: Stored hashed in MongoDB for revocation capability
- **Security**: Prevents token theft replay attacks

### Token Storage

**Access Token**:
- **Option 1 - In-Memory (Most Secure)**:
  - Store in React state/context (lost on page refresh)
  - Requires automatic refresh token flow on app load
  - Prevents XSS attacks (token never persisted)

- **Option 2 - sessionStorage (Balanced)**:
  - Survives page refresh
  - Cleared on tab close
  - Vulnerable to XSS if CDN compromised (but less risk than localStorage)

- **NEVER use localStorage**: Vulnerable to XSS attacks, accessible to all scripts including malicious ones

**Refresh Token**:
- **httpOnly cookie** (ONLY option):
  - Automatically sent with HTTP requests
  - Inaccessible to JavaScript (even to your own app code)
  - Set with `secure` flag (HTTPS only) and `sameSite: 'strict'` (CSRF protection)
  - Example: `Set-Cookie: refreshToken=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`

### Refresh Strategy

**Token Refresh Flow**:
1. **Login**: User logs in → receive access token (15 min expiry) + refresh token (7 days) in httpOnly cookie
2. **API Requests**: Frontend makes requests with access token in `Authorization` header
3. **Token Expiration**: When access token expires (or proactively 1 minute before):
   - Automatically call `/auth/refresh` endpoint
   - Send httpOnly cookie with refresh token (automatic by browser)
   - Receive new access token + new refresh token (rotation)
   - Update access token in memory/sessionStorage
4. **Continue**: Make API requests with new access token
5. **Final Expiration**: If refresh token expires or is invalid → redirect to login page

**Axios Interceptor for Automatic Refresh**:
```typescript
import axios from 'axios';
import { DateTime } from 'luxon';

let accessToken = null;
let tokenExpiry = null;

// Store access token and expiry
export const setAccessToken = (token: string, expiresIn: number) => {
  accessToken = token;
  tokenExpiry = DateTime.now().plus({ seconds: expiresIn });
};

// Check if token is expired or about to expire
const isTokenExpired = () => {
  if (!tokenExpiry) return true;
  return DateTime.now() >= tokenExpiry.minus({ minutes: 1 }); // Refresh 1 min before expiry
};

// Axios request interceptor
axios.interceptors.request.use(
  async (config) => {
    // Refresh token if expired
    if (isTokenExpired()) {
      try {
        const response = await axios.post('/auth/refresh', {}, {
          withCredentials: true // Send httpOnly cookie
        });
        setAccessToken(response.data.accessToken, response.data.expiresIn);
      } catch (error) {
        // Refresh failed - redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // Add access token to request
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor (handle 401 Unauthorized)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post('/auth/refresh', {}, {
          withCredentials: true
        });
        setAccessToken(response.data.accessToken, response.data.expiresIn);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Token Rotation Benefits
- **Prevents replay attacks**: Old refresh tokens become invalid after use
- **Limits damage if stolen**: Refresh token is single-use with short validity (7 days)
- **Detects token theft**: If an old refresh token is reused, system can detect compromise and invalidate all user sessions

### Security Considerations

**1. Token Signing**:
```typescript
import jwt from 'jsonwebtoken';

// Backend: Generate access token
const accessToken = jwt.sign(
  { userId: user._id, email: user.email, roles: user.roles },
  process.env.JWT_SECRET, // Strong secret (256+ bits)
  { expiresIn: '15m', algorithm: 'HS256' }
);

// Backend: Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
- Use **strong secret key** (minimum 256 bits, generated cryptographically)
- Store secret in environment variable, NEVER in code
- Consider **RS256** (asymmetric) for future multi-service architecture

**2. HTTPS Only**:
- **Enforce HTTPS in production** (all tokens encrypted in transit)
- Set `secure: true` on cookies (only transmitted over HTTPS)
- Use HSTS headers: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

**3. CSRF Protection**:
- Set `sameSite: 'strict'` on refresh token cookie
- Prevents cookie from being sent on cross-origin requests
- Blocks CSRF attacks (malicious site can't trigger requests with user's cookies)

**4. XSS Protection**:
- **Content Security Policy (CSP)** headers:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'
  ```
- **Sanitize user input** to prevent script injection (use DOMPurify)
- Use **httpOnly cookies** for refresh tokens (inaccessible to JavaScript)
- Avoid `dangerouslySetInnerHTML` in React

**5. Token Revocation**:
```typescript
// MongoDB schema for refresh tokens
{
  _id: ObjectId,
  userId: ObjectId,
  tokenHash: String, // SHA-256 hash of refresh token
  expiresAt: Date,
  createdAt: Date,
  deviceInfo: String, // User agent, IP for tracking
  isRevoked: Boolean,
}

// On logout: Delete refresh token
await RefreshToken.deleteOne({ tokenHash: hash(refreshToken) });

// On password change: Delete ALL user's refresh tokens
await RefreshToken.deleteMany({ userId: user._id });

// Detect token theft: Track token families
if (oldTokenReused) {
  await RefreshToken.updateMany(
    { userId: user._id },
    { isRevoked: true }
  );
}
```

**6. Validation on Every Request**:
```typescript
// Middleware: Verify JWT and check user status
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### OAuth Integration (LinkedIn)

**Flow**:
1. User clicks "Connect LinkedIn"
2. Redirect to LinkedIn authorization URL with required scopes
3. User grants permissions on LinkedIn
4. LinkedIn redirects back to app with authorization code
5. Backend exchanges code for LinkedIn access token
6. Store LinkedIn token **encrypted** in database
7. Issue application JWT tokens to frontend
8. Use LinkedIn token for LinkedIn API calls (separate from app authentication)

**Implementation**:
```typescript
// Backend: LinkedIn OAuth callback
app.get('/auth/linkedin/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange code for LinkedIn access token
  const linkedinToken = await exchangeCodeForToken(code);

  // Fetch LinkedIn profile
  const profile = await fetchLinkedInProfile(linkedinToken);

  // Find or create user
  let user = await User.findOne({ linkedinId: profile.id });
  if (!user) {
    user = await User.create({
      email: profile.email,
      linkedinId: profile.id,
      linkedinAccessToken: encrypt(linkedinToken), // Encrypt before storing
    });
  } else {
    user.linkedinAccessToken = encrypt(linkedinToken);
    await user.save();
  }

  // Generate app JWT tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in database
  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: DateTime.now().plus({ days: 7 }).toJSDate(),
  });

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Redirect to frontend with access token
  res.redirect(`/dashboard?token=${accessToken}`);
});
```

### Example Authentication Flow

**Login**:
```
POST /auth/login
Body: { email: "user@example.com", password: "password123" }

Response:
{
  accessToken: "eyJhbGciOiJIUzI1NiIs...",
  expiresIn: 900, // 15 minutes in seconds
  user: { id: "...", email: "user@example.com" }
}
Set-Cookie: refreshToken=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Protected API Request**:
```
GET /api/jobs
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
[{ id: "1", company: "Google", ... }]
```

**Token Refresh** (automatic when access token expires):
```
POST /auth/refresh
Cookie: refreshToken=abc123

Response:
{
  accessToken: "eyJhbGciOiJIUzI1NiIs...", // New access token
  expiresIn: 900
}
Set-Cookie: refreshToken=xyz789; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
// New refresh token (rotation)
```

**Logout**:
```
POST /auth/logout
Cookie: refreshToken=xyz789

Response: 200 OK
{ success: true }
// Backend deletes refresh token hash from database
```

### UI Components (Ant Design)

**Login Page**:
```typescript
import { Form, Input, Button, Checkbox, Divider } from 'antd';
import { UserOutlined, LockOutlined, LinkedinOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    const { accessToken } = await login(values);
    setAccessToken(accessToken, 900);
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <Form onFinish={onFinish} size="large">
        <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, min: 8 }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Log In
          </Button>
        </Form.Item>
        <Divider>Or</Divider>
        <Button icon={<LinkedinOutlined />} onClick={handleLinkedInLogin} block>
          Continue with LinkedIn
        </Button>
      </Form>
    </div>
  );
};
```

**Protected Route Wrapper**:
```typescript
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

**Summary**: This JWT-based authentication strategy provides **robust security** with httpOnly cookies, token rotation, and automatic refresh, while maintaining **excellent user experience** with seamless token renewal and multi-device support. Perfect balance for a modern single-page application in 2025.

---

## Summary of Key Decisions

| Category | Decision | Primary Rationale |
|----------|----------|-------------------|
| **Backend Framework** | Express.js | Battle-tested, largest ecosystem, simple setup |
| **Frontend Framework** | Vite + React SPA | No SSR needed, fast dev experience, excellent Ant Design compatibility |
| **Language** | TypeScript (strict) | Type safety for external APIs, Ant Design written in TypeScript |
| **Node.js Version** | 22 LTS | Active LTS until Oct 2025, Maintenance until Apr 2027 |
| **React Version** | 18.3.x | Stable with Ant Design; React 19 has compatibility issues |
| **Ant Design Version** | 5.27.4 | Latest stable, requires React 16-18 |
| **AI Service** | Claude 3 Haiku | Most cost-effective ($0.25/$1.25 per M tokens), quality prose |
| **LinkedIn API** | Limited use + manual fallbacks | API too restrictive for SSI, analytics, recruiter search |
| **Calendar Parsing** | node-ical | Node.js optimized, async/await support, active maintenance |
| **Email Service** | AWS SES | Most cost-effective ($0.10/1k emails), 62k free on EC2 |
| **Web Push** | Native Web Push API | Free, universal browser support in 2025 (iOS 16.4+) |
| **Backend Testing** | Vitest | 4x faster than Jest, ESM/TS native, Jest-compatible |
| **Frontend Testing** | Vitest + React Testing Library | Consistent with backend, user-centric testing |
| **E2E Testing** | Playwright | All browsers (WebKit!), parallel execution, OAuth multi-domain support |
| **Job Scheduling** | Agenda + MongoDB | Native MongoDB persistence, no Redis infrastructure needed |
| **Timezone Library** | Luxon | Built on Intl API, comprehensive timezone features, fluent API |
| **Drag-and-Drop** | @dnd-kit | Modern, maintained (react-beautiful-dnd deprecated), accessible |
| **Calendar UI** | Ant Design Calendar (MVP) / FullCalendar (advanced) | Ant Design Calendar for simple views, FullCalendar if need week/day views |
| **UI Framework** | **Ant Design 5** | **REQUIRED CONSTRAINT**, enterprise-grade, TypeScript-first, 50+ components |
| **State Management** | React Query + Zustand | Server state (React Query), client state (Zustand) |
| **Authentication** | JWT with refresh tokens | Stateless, scalable, httpOnly cookies for security |

**Key Constraint Compliance**:
- ✅ **Ant Design is the UI framework** (as required)
- ✅ All components, forms, layouts use Ant Design
- ✅ Ant Design Calendar for MVP calendar view
- ✅ TypeScript for type safety with Ant Design's excellent type definitions
- ✅ React 18.3.x for stable Ant Design compatibility

**Deployment Recommendations**:
- **Frontend**: Vercel, Netlify, or Cloudflare Pages (automatic HTTPS, CDN, CI/CD)
- **Backend**: Railway, Render, or Fly.io (easy Node.js deployment, auto-scaling)
- **Database**: MongoDB Atlas (free tier: 512MB, automatic backups, global distribution)
- **Environment**: Separate staging and production environments with different API keys

**Estimated Monthly Costs** (production single-user):
- MongoDB Atlas: $0 (free tier sufficient)
- Hosting (Render/Railway): $0-7 (free tier or hobby plan)
- AWS SES: $0.10 (1,000 emails/month)
- Web Push: $0 (native browser API)
- Claude API: $1-5 (100-500 generations/month)
- **Total**: $1-12/month

This research provides a complete, production-ready technology stack optimized for a single-user International Job Search Management System with external integrations, **using Ant Design as the UI framework**, balancing simplicity, cost-effectiveness, and modern development practices in 2025.
