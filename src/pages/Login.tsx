import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppState } from '@/state/AppStateContext';
import { 
  Linkedin, 
  Mail, 
  UserCircle, 
  ArrowRight,
  Shield,
  ArrowLeft
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppState();

  const handleLogin = (provider: 'linkedin' | 'google' | 'email' | 'demo') => {
    if (provider === 'demo') {
      login('demo');
      navigate('/dashboard');
    } else {
      login(provider);
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-primary-foreground rotate-180" />
                <ArrowRight className="h-6 w-6 text-primary-foreground -ml-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to JobSwap</CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to find your perfect location swap
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-6">
            {/* LinkedIn Login */}
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start gap-3 h-14"
              onClick={() => handleLogin('linkedin')}
            >
              <div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center">
                <Linkedin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="flex-1 text-left">Continue with LinkedIn</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Google Login */}
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start gap-3 h-14"
              onClick={() => handleLogin('google')}
            >
              <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span className="flex-1 text-left">Continue with Google</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Email Login */}
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start gap-3 h-14"
              onClick={() => handleLogin('email')}
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left">Continue with Email</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or try a demo</span>
              </div>
            </div>

            {/* Demo Login */}
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full h-14"
              onClick={() => handleLogin('demo')}
            >
              <UserCircle className="h-5 w-5" />
              <span>Demo Employee Login</span>
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-6 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              Your data is securely encrypted and never shared without consent
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
