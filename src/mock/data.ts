// =====================================================
// MOCK DATA FOR JOBSWAP PLATFORM
// =====================================================
// This file contains all mock data for the frontend.
// When connecting real APIs, replace these with actual API calls.
// =====================================================

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  salaryBand: string;
  homeLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  workLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  skills: string[];
  resumeUrl?: string;
  profileComplete: boolean;
  avatarUrl?: string;
}

export interface Match {
  id: string;
  userId: string;
  name: string;
  company: string;
  jobTitle: string;
  skills: string[];
  sector: string;
  location: string;
  commuteBeforeMinutes: number;
  commuteAfterMinutes: number;
  compatibilityScore: number;
  salaryCompatible: boolean;
  avatarUrl?: string;
  // AI Placeholder: This would be calculated from embedding similarity
  // embeddingSimilarity?: number;
}

export interface SwapRequest {
  id: string;
  matchId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserCompany: string;
  fromUserJobTitle: string;
  fromUserSkills: string[];
  toUserId: string;
  toUserName: string;
  toUserCompany: string;
  toUserJobTitle: string;
  message: string;
  status: 'pending' | 'peer_accepted' | 'hr_review' | 'approved' | 'rejected';
  shareResume: boolean;
  shareContact: boolean;
  compatibilityScore: number;
  commuteSavingsMinutes: number;
  createdAt: string;
}

export interface HRRequest extends SwapRequest {
  requesterResumeUrl?: string;
  counterpartyResumeUrl?: string;
  estimatedCostSavings: number;
}

// =====================================================
// MOCK USER (Rajesh from TechCorp)
// =====================================================
export const mockUser: User = {
  id: 'user-001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@techcorp.com',
  company: 'TechCorp Solutions',
  jobTitle: 'Senior Software Engineer',
  salaryBand: '$120,000 - $150,000',
  homeLocation: {
    address: '456 Oak Avenue, San Jose, CA 95128',
    lat: 37.3382,
    lng: -121.8863
  },
  workLocation: {
    address: '1 Market Street, San Francisco, CA 94105',
    lat: 37.7749,
    lng: -122.4194
  },
  skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'PostgreSQL'],
  resumeUrl: '/resumes/rajesh-kumar.pdf',
  profileComplete: true,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
};

// =====================================================
// MOCK MATCHES
// AI Placeholder: In production, these would be generated from:
// - Resume embedding similarity scores
// - Role matching algorithms
// - Commute calculation from Google Maps API
// =====================================================
export const mockMatches: Match[] = [
  {
    id: 'match-001',
    userId: 'user-002',
    name: 'Priya Sharma',
    company: 'TechCorp Solutions',
    jobTitle: 'Senior Software Engineer',
    skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Docker'],
    sector: 'Technology',
    location: 'San Francisco, CA',
    commuteBeforeMinutes: 75,
    commuteAfterMinutes: 25,
    compatibilityScore: 94,
    salaryCompatible: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: 'match-002',
    userId: 'user-003',
    name: 'Michael Chen',
    company: 'TechCorp Solutions',
    jobTitle: 'Senior Software Engineer',
    skills: ['React', 'TypeScript', 'GraphQL', 'AWS', 'Kubernetes'],
    sector: 'Technology',
    location: 'Mountain View, CA',
    commuteBeforeMinutes: 60,
    commuteAfterMinutes: 20,
    compatibilityScore: 87,
    salaryCompatible: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  {
    id: 'match-003',
    userId: 'user-004',
    name: 'Sarah Williams',
    company: 'TechCorp Solutions',
    jobTitle: 'Software Engineer II',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'React'],
    sector: 'Technology',
    location: 'Palo Alto, CA',
    commuteBeforeMinutes: 55,
    commuteAfterMinutes: 30,
    compatibilityScore: 78,
    salaryCompatible: false,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'match-004',
    userId: 'user-005',
    name: 'David Park',
    company: 'TechCorp Solutions',
    jobTitle: 'Senior Software Engineer',
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'React'],
    sector: 'Technology',
    location: 'Sunnyvale, CA',
    commuteBeforeMinutes: 50,
    commuteAfterMinutes: 15,
    compatibilityScore: 91,
    salaryCompatible: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  },
  {
    id: 'match-005',
    userId: 'user-006',
    name: 'Emily Rodriguez',
    company: 'TechCorp Solutions',
    jobTitle: 'Senior Software Engineer',
    skills: ['React', 'Vue.js', 'Node.js', 'PostgreSQL', 'TypeScript'],
    sector: 'Technology',
    location: 'Fremont, CA',
    commuteBeforeMinutes: 45,
    commuteAfterMinutes: 20,
    compatibilityScore: 85,
    salaryCompatible: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
  }
];

// =====================================================
// MOCK SWAP REQUESTS
// =====================================================
export const initialSwapRequestsOutgoing: SwapRequest[] = [
  {
    id: 'req-out-001',
    matchId: 'match-002',
    fromUserId: 'user-001',
    fromUserName: 'Rajesh Kumar',
    fromUserCompany: 'TechCorp Solutions',
    fromUserJobTitle: 'Senior Software Engineer',
    fromUserSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    toUserId: 'user-003',
    toUserName: 'Michael Chen',
    toUserCompany: 'TechCorp Solutions',
    toUserJobTitle: 'Senior Software Engineer',
    message: 'Hi Michael, I noticed we have similar roles and swapping locations would reduce both our commutes significantly. Would you be interested in discussing a job swap?',
    status: 'pending',
    shareResume: true,
    shareContact: true,
    compatibilityScore: 87,
    commuteSavingsMinutes: 40,
    createdAt: '2024-01-15T10:30:00Z'
  }
];

export const initialSwapRequestsIncoming: SwapRequest[] = [
  {
    id: 'req-in-001',
    matchId: 'match-001',
    fromUserId: 'user-002',
    fromUserName: 'Priya Sharma',
    fromUserCompany: 'TechCorp Solutions',
    fromUserJobTitle: 'Senior Software Engineer',
    fromUserSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
    toUserId: 'user-001',
    toUserName: 'Rajesh Kumar',
    toUserCompany: 'TechCorp Solutions',
    toUserJobTitle: 'Senior Software Engineer',
    message: 'Hello Rajesh! Our work locations are practically reversed compared to where we live. A swap could save us both over an hour daily. Interested?',
    status: 'pending',
    shareResume: true,
    shareContact: true,
    compatibilityScore: 94,
    commuteSavingsMinutes: 50,
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 'req-in-002',
    matchId: 'match-004',
    fromUserId: 'user-005',
    fromUserName: 'David Park',
    fromUserCompany: 'TechCorp Solutions',
    fromUserJobTitle: 'Senior Software Engineer',
    fromUserSkills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
    toUserId: 'user-001',
    toUserName: 'Rajesh Kumar',
    toUserCompany: 'TechCorp Solutions',
    toUserJobTitle: 'Senior Software Engineer',
    message: 'Hi Rajesh, I saw we have a high compatibility score. My commute to the SF office is tough - would love to swap to your location in Sunnyvale!',
    status: 'pending',
    shareResume: true,
    shareContact: false,
    compatibilityScore: 91,
    commuteSavingsMinutes: 35,
    createdAt: '2024-01-13T09:15:00Z'
  }
];

// =====================================================
// MOCK HR REQUESTS
// =====================================================
export const initialHRRequests: HRRequest[] = [
  {
    id: 'hr-req-001',
    matchId: 'match-005',
    fromUserId: 'user-007',
    fromUserName: 'Alex Thompson',
    fromUserCompany: 'TechCorp Solutions',
    fromUserJobTitle: 'Senior Software Engineer',
    fromUserSkills: ['React', 'Angular', 'Node.js'],
    toUserId: 'user-008',
    toUserName: 'Jessica Martinez',
    toUserCompany: 'TechCorp Solutions',
    toUserJobTitle: 'Senior Software Engineer',
    message: 'Mutual swap request for commute optimization.',
    status: 'peer_accepted',
    shareResume: true,
    shareContact: true,
    compatibilityScore: 89,
    commuteSavingsMinutes: 45,
    createdAt: '2024-01-12T11:00:00Z',
    requesterResumeUrl: '/resumes/alex-thompson.pdf',
    counterpartyResumeUrl: '/resumes/jessica-martinez.pdf',
    estimatedCostSavings: 2400
  },
  {
    id: 'hr-req-002',
    matchId: 'match-006',
    fromUserId: 'user-009',
    fromUserName: 'Kevin Liu',
    fromUserCompany: 'TechCorp Solutions',
    fromUserJobTitle: 'Software Engineer',
    fromUserSkills: ['Python', 'Django', 'AWS'],
    toUserId: 'user-010',
    toUserName: 'Amanda Foster',
    toUserCompany: 'TechCorp Solutions',
    toUserJobTitle: 'Software Engineer',
    message: 'Both employees have approved this swap.',
    status: 'hr_review',
    shareResume: true,
    shareContact: true,
    compatibilityScore: 92,
    commuteSavingsMinutes: 55,
    createdAt: '2024-01-11T16:30:00Z',
    requesterResumeUrl: '/resumes/kevin-liu.pdf',
    counterpartyResumeUrl: '/resumes/amanda-foster.pdf',
    estimatedCostSavings: 3200
  },
  {
    id: 'hr-req-003',
    matchId: 'match-007',
    fromUserId: 'user-011',
    fromUserName: 'Rachel Green',
    fromUserCompany: 'TechCorp Solutions',
    fromUserJobTitle: 'Senior Software Engineer',
    fromUserSkills: ['JavaScript', 'React', 'GraphQL'],
    toUserId: 'user-012',
    toUserName: 'Tom Wilson',
    toUserCompany: 'TechCorp Solutions',
    toUserJobTitle: 'Senior Software Engineer',
    message: 'Approved swap - pending final HR sign-off.',
    status: 'approved',
    shareResume: true,
    shareContact: true,
    compatibilityScore: 96,
    commuteSavingsMinutes: 60,
    createdAt: '2024-01-10T08:45:00Z',
    requesterResumeUrl: '/resumes/rachel-green.pdf',
    counterpartyResumeUrl: '/resumes/tom-wilson.pdf',
    estimatedCostSavings: 4100
  }
];

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Calculate commute savings in minutes per day
 * AI Placeholder: In production, use Google Maps Distance Matrix API
 */
export const calculateCommuteSavings = (beforeMinutes: number, afterMinutes: number): number => {
  return (beforeMinutes - afterMinutes) * 2; // Round trip
};

/**
 * Calculate monthly time savings in hours
 */
export const calculateMonthlyTimeSavings = (dailySavingsMinutes: number, workingDays: number = 22): number => {
  return (dailySavingsMinutes * workingDays) / 60;
};

/**
 * Estimate CO2 savings based on commute reduction
 * AI Placeholder: Could integrate with carbon footprint APIs
 */
export const calculateCO2Savings = (savedMinutes: number): number => {
  // Rough estimate: 0.5 kg CO2 per 30 minutes of driving
  return (savedMinutes / 30) * 0.5;
};

/**
 * Estimate cost savings based on commute reduction
 */
export const calculateCostSavings = (savedMinutes: number, costPerHour: number = 25): number => {
  return (savedMinutes / 60) * costPerHour * 22; // Monthly savings
};

/**
 * Generate a unique ID (UUID-like)
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// =====================================================
// AI PARSING PLACEHOLDERS
// =====================================================

/**
 * Mock parsed skills from resume
 * AI Placeholder: Would use OpenAI/Claude for resume parsing
 */
export const mockParsedSkills = [
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'Python',
  'Machine Learning',
  'Agile/Scrum'
];

/**
 * Mock embedding similarity calculation
 * AI Placeholder: Would use vector embeddings for semantic matching
 */
export const mockEmbeddingSimilarity = (skills1: string[], skills2: string[]): number => {
  const intersection = skills1.filter(s => skills2.includes(s));
  const union = [...new Set([...skills1, ...skills2])];
  return Math.round((intersection.length / union.length) * 100);
};
