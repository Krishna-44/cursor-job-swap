# Job Swap - AI-Powered Job Exchange Platform

A production-ready web application that helps employees find perfect job swap matches using AI-powered matching, reducing commute time and improving work-life balance.

## 🚀 Features

### Core Features
- 🔐 **Secure Authentication** - Login with LinkedIn, Google, Email, or Demo mode
- 🎯 **AI-Powered Matching** - Intelligent matching using OpenAI embeddings and cosine similarity
- 📍 **Location-Based Matching** - Find swaps that significantly reduce commute time
- 📄 **AI Resume Parsing** - Automatic skill extraction using OpenAI GPT-4
- 👥 **Peer-to-Peer Requests** - Send and receive swap requests
- 🏢 **HR Portal** - Complete HR workflow with AI-assisted approval recommendations
- 📊 **Dashboard Analytics** - Track time saved, cost savings, and environmental impact

### AI Features
- 🤖 **Resume Parsing** - Extracts job title, skills, tools, experience, and certifications
- 🧠 **Embedding-Based Matching** - Vector similarity matching for optimal compatibility
- ⭐ **AI Recommendations** - Top 3 matches marked with AI recommendation badges
- 💡 **HR AI Assist** - AI-powered approve/review/reject recommendations for HR
- 📈 **Commute Impact Analysis** - Calculates hours saved, CO₂ reduction, and stress levels
- 🎯 **Compatibility Scoring** - Weighted algorithm combining skills, role, commute, and salary

## 📁 Project Structure

```
src/
├── ai/                    # AI modules
│   ├── resumeParser.ts    # OpenAI resume parsing
│   ├── embedding.ts        # Vector embeddings & similarity
│   ├── recommendationEngine.ts  # AI match recommendations
│   ├── commuteImpact.ts   # Commute impact calculator
│   └── hrAssist.ts        # HR AI recommendations
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── NavLink.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
│   ├── utils.ts
│   └── supabase.ts        # Supabase client (with mock fallback)
├── mock/                  # Mock data for development
├── pages/                 # Application pages
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Onboarding.tsx     # With AI resume parsing
│   ├── Dashboard.tsx      # With AI recommendations
│   ├── IncomingRequests.tsx
│   ├── HRPortal.tsx       # With AI assist
│   └── NotFound.tsx
└── state/                 # State management
    └── AppStateContext.tsx
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- (Optional) OpenAI API key for AI features
- (Optional) Supabase account for database

### Installation

```bash
# Clone the repository
git clone https://github.com/Krishna-44/cursor-job-swap.git
cd cursor-job-swap

# Install dependencies
npm install

# Copy environment example file
cp env.example .env.local

# Edit .env.local and add your API keys (optional for mock mode)
# VITE_OPENAI_API_KEY=your_key_here
# VITE_SUPABASE_URL=your_url_here
# VITE_SUPABASE_ANON_KEY=your_key_here

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Mock Mode

The app runs perfectly in **mock mode** without any API keys! All AI features will use intelligent fallback algorithms that simulate AI behavior.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file (see `env.example`):

```env
# OpenAI API (optional - uses mock parser if not set)
VITE_OPENAI_API_KEY=sk-...

# Supabase (optional - uses mock DB if not set)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Environment
VITE_ENV=development
```

### Getting API Keys

1. **OpenAI API Key** (for AI features):
   - Sign up at https://platform.openai.com
   - Navigate to API Keys section
   - Create a new secret key
   - Add to `.env.local`

2. **Supabase** (for database):
   - Sign up at https://supabase.com
   - Create a new project
   - Go to Settings > API
   - Copy URL and anon key
   - See `backend_todo.md` for database schema setup

## 🏗️ Build & Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings > Environment Variables
   - Add `VITE_OPENAI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

The `vercel.json` config file is already set up!

### Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site Settings > Environment Variables
   - Add your API keys

The `netlify.toml` config file is already set up!

### Deploy to Other Platforms

The app builds to static files in the `dist/` directory, so it can be deployed to:
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Cloudflare Pages
- Any static hosting service

## 🧪 Testing

The app includes mock fallback modes for all features:

- **Without OpenAI**: Uses intelligent mock resume parser
- **Without Supabase**: Uses in-memory mock database
- **All features work**: The app is fully functional in mock mode

## 📚 Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **AI/ML**: OpenAI API (GPT-4, Embeddings)
- **Database**: Supabase (PostgreSQL with vector support)
- **Icons**: Lucide React
- **Animations**: Tailwind CSS + Custom CSS

## 🎨 UI Features

- ✨ Modern, responsive design
- 🎯 AI recommendation badges
- 📊 Compatibility score tooltips
- 💫 Smooth animations and transitions
- 🌙 Dark mode support (via next-themes)
- 📱 Mobile-friendly interface
- 🎭 Loading states and skeletons

## 🔐 Security

- Environment variables for sensitive data
- No API keys exposed in client bundle
- Supabase Row Level Security (RLS) ready
- Secure authentication patterns

## 📖 Usage

1. **Landing Page**: Learn about the platform
2. **Login**: Use demo mode or authenticate
3. **Onboarding**: Complete profile with AI resume parsing
4. **Dashboard**: View AI-recommended matches
5. **Send Requests**: Connect with potential swap partners
6. **HR Portal**: Review and approve swaps with AI assistance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Backend Setup

See `backend_todo.md` for complete backend infrastructure setup guide including:
- Supabase database schema
- Vector similarity functions
- API endpoints
- Authentication setup
- File storage configuration

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- AI powered by [OpenAI](https://openai.com/)
- Database by [Supabase](https://supabase.com/)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check `backend_todo.md` for backend setup help
- Review environment variable configuration

---

**Made with ❤️ for better work-life balance**
