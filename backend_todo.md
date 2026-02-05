# Backend Infrastructure TODO

This document outlines the backend infrastructure needed to fully deploy the JobSwap platform.

## Required Services

### 1. Supabase Setup

#### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  salary_band TEXT,
  home_location JSONB NOT NULL,
  work_location JSONB NOT NULL,
  skills TEXT[] DEFAULT '{}',
  profile_complete BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resumes table with vector column
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  embedding vector(384), -- OpenAI text-embedding-3-small dimension
  parsed_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL,
  commute_before_minutes INTEGER NOT NULL,
  commute_after_minutes INTEGER NOT NULL,
  salary_compatible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_user_id)
);

-- Swap requests table
CREATE TABLE swap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  share_resume BOOLEAN DEFAULT false,
  share_contact BOOLEAN DEFAULT false,
  commute_savings_minutes INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HR requests table
CREATE TABLE hr_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  estimated_cost_savings DECIMAL(10, 2),
  requester_resume_url TEXT,
  counterparty_resume_url TEXT,
  status TEXT NOT NULL DEFAULT 'hr_review',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vector similarity function
CREATE OR REPLACE FUNCTION match_profiles(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  company text,
  job_title text,
  skills text[],
  compatibility_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.id as user_id,
    u.name,
    u.company,
    u.job_title,
    u.skills,
    1 - (r.embedding <=> query_embedding) as compatibility_score
  FROM users u
  JOIN resumes r ON r.user_id = u.id
  WHERE 1 - (r.embedding <=> query_embedding) > match_threshold
  ORDER BY r.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create indexes
CREATE INDEX ON resumes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON users(email);
CREATE INDEX ON matches(user_id);
CREATE INDEX ON swap_requests(from_user_id);
CREATE INDEX ON swap_requests(to_user_id);
```

#### Row Level Security (RLS)

Enable RLS on all tables and create policies for authenticated users.

### 2. OpenAI API Integration

- Set up API key in environment variables
- Implement rate limiting
- Add error handling and retries
- Consider using OpenAI's batch API for cost optimization

### 3. Google Maps API

- Set up Google Maps JavaScript API
- Implement geocoding for address conversion
- Add Distance Matrix API for commute calculations
- Set up API key restrictions

### 4. Authentication

Options:
- Supabase Auth (recommended)
- Auth0
- Firebase Auth
- Custom JWT implementation

### 5. File Storage

For resume uploads:
- Supabase Storage
- AWS S3
- Cloudinary

### 6. Email Service

For notifications:
- SendGrid
- Resend
- AWS SES
- Postmark

### 7. Background Jobs

For async processing:
- Supabase Edge Functions
- Vercel Cron Jobs
- AWS Lambda
- BullMQ with Redis

## API Endpoints Needed

### User Management
- `POST /api/users` - Create user profile
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Resume Processing
- `POST /api/resumes/upload` - Upload resume
- `POST /api/resumes/parse` - Parse resume with AI
- `GET /api/resumes/:id` - Get resume

### Matching
- `GET /api/matches` - Get user matches
- `POST /api/matches/generate` - Generate new matches
- `GET /api/matches/:id` - Get match details

### Swap Requests
- `POST /api/swap-requests` - Create swap request
- `GET /api/swap-requests` - List swap requests
- `PUT /api/swap-requests/:id/accept` - Accept request
- `PUT /api/swap-requests/:id/decline` - Decline request

### HR Portal
- `GET /api/hr/requests` - Get HR requests
- `PUT /api/hr/requests/:id/approve` - Approve request
- `PUT /api/hr/requests/:id/reject` - Reject request

## Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google Maps
GOOGLE_MAPS_API_KEY=AIza...

# Email Service
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@jobswap.com

# App
APP_URL=https://jobswap.com
NODE_ENV=production
```

## Deployment Checklist

- [ ] Set up Supabase project
- [ ] Create database schema
- [ ] Configure RLS policies
- [ ] Set up OpenAI API account
- [ ] Set up Google Maps API
- [ ] Configure authentication
- [ ] Set up file storage
- [ ] Configure email service
- [ ] Set up environment variables
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN
- [ ] Set up backups
- [ ] Load testing
- [ ] Security audit

## Cost Estimates (Monthly)

- Supabase: Free tier → $25/month (Pro)
- OpenAI API: ~$50-200/month (depending on usage)
- Google Maps: ~$50-100/month
- Email Service: ~$15/month
- Hosting (Vercel): Free tier → $20/month (Pro)
- **Total**: ~$160-400/month

## Next Steps

1. Set up Supabase project and database
2. Configure authentication
3. Implement API endpoints
4. Set up file uploads
5. Integrate Google Maps
6. Deploy to production
