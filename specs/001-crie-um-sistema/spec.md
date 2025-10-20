# Feature Specification: International Job Search Management System

**Feature Branch**: `001-crie-um-sistema`
**Created**: 2025-10-12
**Status**: Draft
**Input**: User description: "Crie um sistema para me ajudar a organizar o meu processo para conseguir uma vaga na gringa.

o que preciso fazer?
- postar pelo menos 5x na semana conteudos sobre a minha stack no linkedin
- marcar entrevistas (integrar com icall)
- agenda para treinar ingles e as questoes das entrevistas

Esse sistema deve:
- possuir um dashboard
- possuir uma area para cadastro de ideias de posts
- um kanban para organizar esses conteudos que contenha, post, status, conteudo, etc
- gerar os 5 posts semanais com ate 500 palavras, baseado nos temas escolhidos, caso nao tenha 5, o sistema deve sugir os posts restantes pra atingir essa metrica
- se for possivel integrar com o linkedin, esse sistema deve fazer o post no dia e hora agendados e acompanhar o SSI e exibir no meu dashboard
- um calendario com as agendas das entrevistas marcadas e aulas, as agendas poderao vir do icall ou ser inseridas manualmente.
- enviar notificacao pro computador ou pro meu celular (se possivel), ou por email, me lembrando dos compromissos do dia
- possuir um kanban pra acompanhamento dos processos. esse kanban deve possuir as colunas de 'primeiros contatos', 'processos em andamento', 'entrevista', 'proposta', 'negociacao', 'acordo fechado', e 'archivado'.

- o sistema deve ser todo em ingles
- vc pode sugerir melhorias nesse levantamento que achar devido"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - LinkedIn Content Creation and Publishing (Priority: P1)

As a job seeker, I need to consistently publish professional content on LinkedIn to increase my visibility and demonstrate my expertise to international recruiters.

**Why this priority**: Consistent LinkedIn presence is the primary visibility driver for international job opportunities. This is the foundation for building professional brand awareness and must work independently before adding automation or tracking features.

**Independent Test**: Can be fully tested by creating a post idea, generating content from it, scheduling it, and verifying it appears in the content kanban. Delivers immediate value by helping maintain weekly posting consistency.

**Acceptance Scenarios**:

1. **Given** I have a post idea, **When** I add it to the post ideas area with a title and brief description, **Then** the idea is saved and available for content generation
2. **Given** I have selected a post idea, **When** I request content generation, **Then** the system generates a LinkedIn post with up to 500 words based on the topic
3. **Given** I have less than 5 posts scheduled for the current week, **When** I view the content kanban, **Then** the system suggests topics to reach the 5-post weekly target
4. **Given** I have a generated post, **When** I schedule it with a specific date and time, **Then** the post appears in the content kanban with "Scheduled" status
5. **Given** I have a scheduled post with LinkedIn integration enabled, **When** the scheduled time arrives, **Then** the post is automatically published to my LinkedIn profile
6. **Given** a post has been published to LinkedIn, **When** I view the content kanban, **Then** the post status updates to "Published" with engagement metrics

---

### User Story 2 - Job Application Pipeline Tracking (Priority: P2)

As a job seeker, I need to track all my job applications through different stages so I can manage multiple opportunities effectively and know where each application stands.

**Why this priority**: Once visibility strategy is established (P1), tracking actual job opportunities becomes critical. This provides structure to manage multiple concurrent applications and prevents opportunities from being forgotten or mismanaged.

**Independent Test**: Can be fully tested by creating job opportunities, moving them through pipeline stages, and viewing the current status of all applications. Delivers value by organizing the job search process systematically.

**Acceptance Scenarios**:

1. **Given** I have made initial contact with a company, **When** I create a new job opportunity entry, **Then** it appears in the "Initial Contacts" column with company name, position, and date
2. **Given** I have a job opportunity in any stage, **When** I drag it to a different column, **Then** the opportunity moves to that stage and timestamps the transition
3. **Given** I have multiple opportunities, **When** I view the pipeline kanban, **Then** I see all opportunities organized by stage: Initial Contacts, In Progress, Interview, Proposal, Negotiation, Deal Closed, and Archived
4. **Given** I have a job opportunity, **When** I add notes or update details, **Then** the information is saved and viewable when I open that opportunity
5. **Given** I have a completed or rejected opportunity, **When** I move it to "Archived", **Then** it is removed from active view but remains accessible in the archive

---

### User Story 3 - Interview and Study Schedule Management (Priority: P3)

As a job seeker, I need to manage my interview appointments and English/interview practice sessions so I stay prepared and never miss important commitments.

**Why this priority**: After establishing visibility (P1) and tracking opportunities (P2), effective time management ensures readiness for interviews. This supports the execution of opportunities already in the pipeline.

**Independent Test**: Can be fully tested by adding appointments manually, importing from iCalendar, viewing them in the calendar, and receiving notifications. Delivers value by preventing scheduling conflicts and ensuring preparation time.

**Acceptance Scenarios**:

1. **Given** I have an upcoming interview, **When** I manually add it to the calendar with date, time, company, and type, **Then** the appointment appears on the calendar view
2. **Given** I have an iCalendar URL from iCal, **When** I connect it to the system, **Then** appointments from that calendar appear in my schedule
3. **Given** I have appointments scheduled for today, **When** the day begins, **Then** I receive notifications reminding me of upcoming commitments
4. **Given** I want to schedule practice time, **When** I create a study session for English or interview preparation, **Then** it appears in the calendar as a blocked time slot
5. **Given** I have appointments in the calendar, **When** I view the dashboard, **Then** I see today's and upcoming appointments prominently displayed
6. **Given** I have enabled notifications, **When** an appointment is 1 hour away, **Then** I receive a notification via email, desktop, or mobile

---

### User Story 4 - Centralized Dashboard Overview (Priority: P4)

As a job seeker, I need a centralized dashboard to see my weekly posting progress, LinkedIn SSI score, upcoming appointments, and pipeline status at a glance.

**Why this priority**: The dashboard aggregates insights from all other features. It provides maximum value only after the underlying systems (content, pipeline, calendar) are functional and generating data.

**Independent Test**: Can be fully tested by viewing the dashboard with existing data from other features and verifying all key metrics are displayed correctly. Delivers value by providing a single source of truth for job search progress.

**Acceptance Scenarios**:

1. **Given** I have been using the system, **When** I open the dashboard, **Then** I see my weekly posting count (X out of 5 posts)
2. **Given** LinkedIn integration is connected, **When** I view the dashboard, **Then** my current LinkedIn SSI (Social Selling Index) score is displayed
3. **Given** I have scheduled posts, **When** I view the dashboard, **Then** I see upcoming scheduled posts for the current week
4. **Given** I have job opportunities in the pipeline, **When** I view the dashboard, **Then** I see a summary count for each pipeline stage
5. **Given** I have appointments scheduled, **When** I view the dashboard, **Then** I see today's and tomorrow's appointments
6. **Given** I have not met the weekly posting target, **When** I view the dashboard, **Then** I see a prompt to create or schedule more posts

---

### User Story 5 - LinkedIn Recruiter Discovery and Connection Management (Priority: P2)

As a job seeker, I need to discover and connect with LATAM recruiters on LinkedIn to expand my network and increase job opportunities while staying within LinkedIn's weekly connection limits.

**Why this priority**: After establishing content strategy (P1), actively building a recruiter network is critical for job opportunities. This complements the pipeline tracking (P2) by generating new opportunities through direct recruiter connections.

**Independent Test**: Can be fully tested by searching for recruiters based on criteria, viewing suggested connection messages, tracking weekly connection count, and marking recruiters as connected. Delivers value by systematizing the networking process.

**Acceptance Scenarios**:

1. **Given** I want to find recruiters, **When** I access the recruiter discovery feature, **Then** the system searches for LATAM recruiters based on configurable criteria (region, industry, company)
2. **Given** the system has found recruiter profiles, **When** I view the recruiter list, **Then** I see profile summaries with name, current company, location, and industry
3. **Given** I want to connect with a recruiter, **When** I select a recruiter profile, **Then** the system generates 3-5 personalized connection message suggestions based on my profile and the recruiter's background
4. **Given** I have selected a connection message, **When** I copy it and send the connection on LinkedIn, **Then** I can mark the recruiter as "connection sent" with timestamp
5. **Given** I have sent connection requests this week, **When** I view my connection tracking, **Then** I see my weekly connection count and remaining connections before hitting the limit
6. **Given** I have reached the weekly connection limit, **When** I try to mark more connections, **Then** the system warns me and suggests waiting until the next week
7. **Given** a recruiter accepts my connection, **When** I update their status, **Then** they move to "connected" status and can optionally be linked to job opportunities in the pipeline
8. **Given** the week resets, **When** I view my connection tracking, **Then** the weekly counter resets and I can send new connections

---

### Edge Cases

- What happens when LinkedIn integration fails or the user's LinkedIn credentials expire?
- How does the system handle post scheduling conflicts (multiple posts scheduled at the same time)?
- What happens if the user tries to generate a post from an empty or very vague idea?
- How does the system handle iCalendar sync failures or unavailable calendar URLs?
- What happens when a notification cannot be delivered (user offline, notification permissions denied)?
- How does the system handle timezone differences when scheduling posts or appointments?
- What happens when the user reaches archived opportunity limits or has hundreds of active opportunities?
- How does the system suggest post topics when there are no saved ideas?
- What happens when the LinkedIn SSI score cannot be retrieved or is unavailable?
- How does the system handle duplicate appointments imported from iCalendar?
- What happens when recruiter search returns no results or LinkedIn rate limits the search API?
- How does the system handle tracking connections if the user sends some manually outside the system?
- What happens when a connection request is rejected or withdrawn?
- How does the system prevent duplicate connection requests to the same recruiter?

## Requirements *(mandatory)*

### Functional Requirements

#### Content Management

- **FR-001**: System MUST allow users to create and save post ideas with a title and description
- **FR-002**: System MUST generate LinkedIn post content (up to 500 words) based on a selected post idea
- **FR-003**: System MUST provide a kanban board to organize posts with columns for at least: Ideas, Draft, Scheduled, Published
- **FR-004**: System MUST track post metadata including title, content, status, scheduled date/time, and publication date/time
- **FR-005**: System MUST calculate weekly post count and display progress toward the 5-post weekly target
- **FR-006**: System MUST automatically suggest post topics when the user has fewer than 5 posts scheduled for the current week
- **FR-007**: System MUST allow users to schedule posts with a specific date and time
- **FR-008**: System MUST integrate with LinkedIn to automatically publish posts at scheduled times
- **FR-009**: System MUST retrieve and display LinkedIn SSI (Social Selling Index) score
- **FR-010**: System MUST track basic post engagement metrics (likes, comments, shares) for published posts

#### Job Application Pipeline

- **FR-011**: System MUST provide a kanban board for job opportunities with these columns: Initial Contacts, In Progress, Interview, Proposal, Negotiation, Deal Closed, Archived
- **FR-012**: System MUST allow users to create job opportunity entries with company name, position title, description, and contact information
- **FR-013**: System MUST allow users to move opportunities between pipeline stages by drag-and-drop or status update
- **FR-014**: System MUST timestamp each stage transition for tracking progress over time
- **FR-015**: System MUST allow users to add notes, attachments, and update details for each opportunity
- **FR-016**: System MUST separate archived opportunities from active view while keeping them accessible
- **FR-017**: System MUST display opportunity counts per stage on the dashboard

#### Calendar and Scheduling

- **FR-018**: System MUST provide a calendar view to display appointments and study sessions
- **FR-019**: System MUST allow users to manually create appointments with date, time, title, type (interview/study session), and description
- **FR-020**: System MUST support iCalendar format integration to import appointments from external calendar systems
- **FR-021**: System MUST distinguish between interview appointments and study/practice sessions visually
- **FR-022**: System MUST display today's and upcoming appointments on the dashboard
- **FR-023**: System MUST send notifications for upcoming appointments via email at minimum
- **FR-024**: System SHOULD support desktop and mobile notifications for appointments when technically feasible
- **FR-025**: System MUST send appointment reminders at configurable intervals (default: 1 hour before)

#### Dashboard

- **FR-026**: System MUST provide a dashboard as the main landing page
- **FR-027**: Dashboard MUST display weekly posting progress (X of 5 posts)
- **FR-028**: Dashboard MUST display LinkedIn SSI score when integration is active
- **FR-029**: Dashboard MUST display upcoming scheduled posts for the current week
- **FR-030**: Dashboard MUST display summary counts for each job pipeline stage
- **FR-031**: Dashboard MUST display today's and tomorrow's appointments
- **FR-032**: Dashboard MUST provide quick links to add new posts, opportunities, and appointments

#### Recruiter Discovery and Connection Management

- **FR-038**: System MUST allow users to search for LATAM recruiters based on configurable criteria (region, industry, company)
- **FR-039**: System MUST display recruiter profiles with name, current company, location, and industry information
- **FR-040**: System MUST generate 3-5 personalized connection message suggestions for each recruiter using AI/LLM
- **FR-041**: System MUST allow users to mark recruiters as "connection sent" with timestamp
- **FR-042**: System MUST track weekly connection count and display remaining connections before limit (configurable, default 100/week)
- **FR-043**: System MUST warn users when weekly connection limit is reached and suggest waiting until reset
- **FR-044**: System MUST reset weekly connection counter every Monday (aligned with weekly posting cycle)
- **FR-045**: System MUST allow users to update recruiter status to "connected" after connection acceptance
- **FR-046**: System SHOULD link connected recruiters to job opportunities in the pipeline when applicable
- **FR-047**: System MUST prevent duplicate connection tracking for the same recruiter
- **FR-048**: System MUST generate connection messages in English with professional tone, highlighting relevant skills and mutual interests
- **FR-049**: System SHOULD display recruiter discovery results on the dashboard with quick access to send connections

#### General System Requirements

- **FR-050**: System MUST present all user interface text in English
- **FR-051**: System MUST support user authentication to protect personal job search data
- **FR-052**: System MUST persist all data (posts, opportunities, appointments, recruiters) reliably
- **FR-053**: System MUST handle timezone conversions for scheduling and notifications [NEEDS CLARIFICATION: What is the user's primary timezone and should the system support multiple timezones for international interviews?]
- **FR-054**: System SHOULD validate LinkedIn API credentials and provide clear error messages when integration fails

### Key Entities

- **Post Idea**: Represents a concept for LinkedIn content with title, description, creation date, and tags/categories for organization
- **Post**: Represents actual LinkedIn content with generated text (up to 500 words), status (draft/scheduled/published), scheduled date/time, publication date/time, and engagement metrics
- **Job Opportunity**: Represents a potential job with company name, position title, description, stage (Initial Contacts through Archived), transition timestamps, contact information, notes, attachments, and optional linked recruiter
- **Appointment**: Represents a calendar event with date, time, title, type (interview/study session), description, source (manual/iCalendar import), company (for interviews), and notification preferences
- **Recruiter**: Represents a LinkedIn recruiter profile with name, current company, location, industry, LinkedIn profile URL, connection status (discovered/connection_sent/connected/rejected), connection sent date, connection accepted date, and notes
- **Connection Message**: Represents a generated or custom message for connecting with recruiters, including message text, recruiter context, and usage tracking
- **User Profile**: Represents the job seeker with authentication credentials, LinkedIn integration status, SSI score, notification preferences, timezone settings, weekly connection limit, and current week connection count

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a post idea and generate content in under 2 minutes
- **SC-002**: Users maintain an average of 5 LinkedIn posts per week with system assistance
- **SC-003**: Users can track at least 10 concurrent job opportunities without losing track of any application
- **SC-004**: Users receive appointment notifications with 95% reliability (delivered before the event)
- **SC-005**: Users can view their complete job search status (posts, pipeline, appointments) from the dashboard in under 5 seconds
- **SC-006**: LinkedIn posts are published automatically within 5 minutes of scheduled time 90% of the time
- **SC-007**: Users report a 50% reduction in time spent organizing job search activities
- **SC-008**: Users successfully complete their weekly posting target at least 80% of weeks
- **SC-009**: Zero missed interviews or appointments due to lack of notification or visibility
- **SC-010**: Users can import external calendar events and see them in the system within 10 minutes of connection
- **SC-011**: Users can discover and review at least 20 LATAM recruiter profiles per week
- **SC-012**: Users send connection requests to recruiters up to their weekly limit with AI-generated messages
- **SC-013**: System generates 3-5 unique, personalized connection messages for each recruiter in under 10 seconds
- **SC-014**: Users achieve at least 30% connection acceptance rate from recruiters contacted through the system
- **SC-015**: Zero duplicate connection requests sent to the same recruiter

## Assumptions

- **A-001**: User has an active LinkedIn account and is willing to grant API access for posting and SSI retrieval
- **A-002**: Content generation will use AI/LLM services for creating posts based on user-provided ideas
- **A-003**: User's primary timezone is UTC-3 (Brazil Standard Time) based on typical South American international job searches
- **A-004**: iCalendar integration refers to importing from iCal/Google Calendar via iCalendar URL format (webcal://)
- **A-005**: "SSI" refers to LinkedIn's Social Selling Index, which measures profile engagement and network growth
- **A-006**: Mobile notifications are a "nice-to-have" and email notifications are the minimum viable notification method
- **A-007**: User operates primarily from a desktop/laptop browser with optional mobile access
- **A-008**: Job search targets English-speaking countries (North America, Europe, Australia)
- **A-009**: System is for single-user use (individual job seeker, not team collaboration)
- **A-010**: Weekly posting cycle starts on Monday and ends on Sunday

## Suggested Enhancements

- **E-001**: Add analytics showing which types of posts generate the most engagement to guide future content strategy
- **E-002**: Integrate with job boards (LinkedIn Jobs, Indeed, Glassdoor) to automatically create opportunities from saved job listings
- **E-003**: Add interview preparation resources (common questions database, company research tools) linked to specific appointments
- **E-004**: Implement email parsing to automatically create opportunities from recruiter outreach emails
- **E-005**: Add progress tracking over time (weekly post consistency chart, pipeline velocity metrics, interview conversion rates)
- **E-006**: Support collaborative features (share pipeline with coach/mentor, request feedback on draft posts)
- **E-007**: Add AI-powered interview coaching with mock interview sessions and feedback
- **E-008**: Integrate with job search tools like Huntr or Trello for import/export compatibility
- **E-009**: Add salary negotiation calculator and offer comparison tools for the Negotiation stage
- **E-010**: Implement gamification (streaks for posting consistency, milestones for pipeline progress)
- **E-011**: LinkedIn recruiter discovery feature to find and connect with LATAM recruiters up to weekly connection limit, with AI-generated personalized connection messages
