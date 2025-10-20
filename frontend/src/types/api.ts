export interface User {
  _id: string;
  email: string;
  name: string;
  timezone: string;
  skills: string[];
  targetIndustries: string[];
  targetRegions: string[];
  weeklyConnectionLimit: number;
  currentWeekConnectionCount: number;
  linkedinIntegration: {
    connected: boolean;
    ssiScore?: number;
    lastSsiUpdate?: string;
  };
  notifications: {
    email: {
      enabled: boolean;
      address: string;
    };
    desktop: {
      enabled: boolean;
    };
    appointmentReminder: {
      enabled: boolean;
      minutesBefore: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostIdea {
  _id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  status: 'active' | 'used' | 'archived';
  usedInPostIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  userId: string;
  postIdeaId?: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: string;
  publishedAt?: string;
  linkedinPostId?: string;
  linkedinUrl?: string;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    lastUpdated?: string;
  };
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobOpportunity {
  _id: string;
  userId: string;
  company: string;
  position: string;
  description: string;
  stage: 'initial_contacts' | 'in_progress' | 'interview' | 'proposal' | 'negotiation' | 'deal_closed' | 'archived';
  stageHistory: Array<{
    stage: string;
    timestamp: string;
    notes?: string;
  }>;
  contactEmail?: string;
  contactName?: string;
  contactPhone?: string;
  recruiterId?: string;
  jobPostingUrl?: string;
  companyWebsite?: string;
  notes: string;
  attachments: Array<{
    filename: string;
    url: string;
    uploadedAt: string;
  }>;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  location?: string;
  remoteType?: 'remote' | 'hybrid' | 'onsite';
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  userId: string;
  title: string;
  description: string;
  type: 'interview' | 'study_session';
  startTime: string;
  endTime: string;
  allDay: boolean;
  source: 'manual' | 'icalendar';
  externalEventId?: string;
  icalendarUrl?: string;
  jobOpportunityId?: string;
  company?: string;
  notificationSent: boolean;
  notificationSentAt?: string;
  location?: string;
  attendees?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Recruiter {
  _id: string;
  userId: string;
  name: string;
  company: string;
  location: string;
  industry?: string;
  linkedinProfileUrl: string;
  status: 'discovered' | 'connection_sent' | 'connected' | 'rejected';
  discoveredAt: string;
  connectionSentAt?: string;
  connectedAt?: string;
  rejectedAt?: string;
  connectionWeek?: string;
  generatedMessages: Array<{
    message: string;
    generatedAt: string;
    used: boolean;
  }>;
  notes: string;
  searchCriteria?: {
    region: string[];
    industry: string[];
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
