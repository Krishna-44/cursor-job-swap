import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  ArrowRight, 
  Play, 
  Shield, 
  Brain, 
  MapPin, 
  Users, 
  CheckCircle2,
  Clock,
  Leaf,
  Building2,
  FileText,
  UserCheck,
  Handshake
} from 'lucide-react';

const flowSteps = [
  { 
    icon: Users, 
    title: 'Login with LinkedIn/Google', 
    description: 'Secure authentication with your professional account' 
  },
  { 
    icon: MapPin, 
    title: 'Enter Locations', 
    description: 'Add your home and workplace addresses' 
  },
  { 
    icon: FileText, 
    title: 'Upload Resume', 
    description: 'AI extracts your skills and experience' 
  },
  { 
    icon: Brain, 
    title: 'AI Finds Best Match', 
    description: 'Instant matching with estimated time saved' 
  },
  { 
    icon: Handshake, 
    title: 'Send Swap Request', 
    description: 'Reach out to your perfect match' 
  },
  { 
    icon: UserCheck, 
    title: 'Peer Accepts', 
    description: 'Mutual agreement to swap locations' 
  },
  { 
    icon: Building2, 
    title: 'HR Approves', 
    description: 'Final verification and approval' 
  },
  { 
    icon: CheckCircle2, 
    title: 'Swap Complete!', 
    description: 'Enjoy your reduced commute' 
  },
];

const trustBadges = [
  { icon: Brain, label: 'AI-Powered Matching' },
  { icon: Shield, label: 'HR Verified Process' },
  { icon: Clock, label: 'Save 10+ Hours/Month' },
  { icon: Leaf, label: 'Reduce CO₂ Emissions' },
];

export default function Landing() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-primary-foreground rotate-180" />
              <ArrowRight className="h-5 w-5 text-primary-foreground -ml-3" />
            </div>
            <span className="text-2xl font-bold text-foreground">JobSwap</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up">
            <Leaf className="h-4 w-4" />
            Reduce commute time & carbon footprint
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Optimize Your{' '}
            <span className="text-gradient">Workforce Location</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Connect with colleagues who have the same role but work in different locations. 
            Swap positions, reduce your commute, and boost your work-life balance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
              Start Swapping
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => setShowDemoModal(true)}>
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex items-center justify-center gap-2 bg-card p-4 rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
              >
                <badge.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { value: '500+', label: 'Successful Swaps', color: 'text-primary' },
            { value: '12,000', label: 'Hours Saved Monthly', color: 'text-accent' },
            { value: '45%', label: 'Average Commute Reduction', color: 'text-success' },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-card rounded-2xl shadow-lg border border-border/30 card-hover animate-fade-in-up"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Modal */}
      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">
              How JobSwap Works
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flowSteps.map((step, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="hero" size="lg" onClick={() => {
              setShowDemoModal(false);
              navigate('/login');
            }}>
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
