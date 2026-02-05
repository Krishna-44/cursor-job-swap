import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppState } from '@/state/AppStateContext';
import { CountUpNumber } from '@/hooks/useCountUp';
import { Match, calculateCommuteSavings } from '@/mock/data';
import { getAIRecommendations, AIRecommendation } from '@/ai/recommendationEngine';
import { calculateCommuteImpact } from '@/ai/commuteImpact';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Users, 
  Send,
  CheckCircle2,
  Leaf,
  DollarSign,
  Briefcase,
  List,
  Map,
  X,
  LogOut,
  Inbox,
  Building2,
  TrendingUp,
  Sparkles,
  Brain,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, sendSwapRequest, logout } = useAppState();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [shareResume, setShareResume] = useState(true);
  const [shareContact, setShareContact] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const { currentUser, matches, swapRequestsOutgoing, swapRequestsIncoming } = state;

  // Load AI recommendations when matches change
  useEffect(() => {
    if (currentUser && matches.length > 0) {
      setIsLoadingAI(true);
      getAIRecommendations(
        currentUser.skills,
        currentUser.jobTitle,
        matches
      ).then(recommendations => {
        setAiRecommendations(recommendations);
        setIsLoadingAI(false);
      }).catch(error => {
        console.error('Error loading AI recommendations:', error);
        setIsLoadingAI(false);
      });
    }
  }, [currentUser, matches]);

  // Helper to check if match is AI recommended
  const isAIRecommended = (matchId: string): boolean => {
    return aiRecommendations.some(rec => rec.match.id === matchId && rec.isRecommended);
  };

  // Helper to get AI reasoning for a match
  const getAIReasoning = (matchId: string): string => {
    const rec = aiRecommendations.find(r => r.match.id === matchId);
    return rec?.reasoning || '';
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Calculate dynamic metrics
  const matchesFound = matches.length;
  const requestsSent = swapRequestsOutgoing.length;
  const averageTimeSaved = matches.length > 0 
    ? Math.round(matches.reduce((acc, m) => acc + calculateCommuteSavings(m.commuteBeforeMinutes, m.commuteAfterMinutes), 0) / matches.length)
    : 0;

  const handleSendRequest = () => {
    if (!selectedMatch) return;

    sendSwapRequest(selectedMatch.id, {
      message: requestMessage,
      shareResume,
      shareContact
    });

    toast.success('Swap request sent successfully!', {
      description: `Your request has been sent to ${selectedMatch.name}`,
    });

    setShowRequestModal(false);
    setSelectedMatch(null);
    setRequestMessage('');
    setShareResume(true);
    setShareContact(true);
  };

  const openRequestModal = (match: Match) => {
    setSelectedMatch(match);
    setRequestMessage(`Hi ${match.name.split(' ')[0]}, I noticed we have similar roles and swapping locations could significantly reduce our commutes. Would you be interested in discussing a job swap?`);
    setShowRequestModal(true);
  };

  const hasAlreadySentRequest = (matchId: string) => {
    return swapRequestsOutgoing.some(req => req.matchId === matchId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-primary-foreground rotate-180" />
                <ArrowRight className="h-5 w-5 text-primary-foreground -ml-3" />
              </div>
              <span className="text-xl font-bold text-foreground">JobSwap</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/incoming-requests')}
                className="relative"
              >
                <Inbox className="h-4 w-4 mr-2" />
                Incoming Requests
                {swapRequestsIncoming.filter(r => r.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {swapRequestsIncoming.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" onClick={() => navigate('/hr-portal')}>
                <Building2 className="h-4 w-4 mr-2" />
                HR Portal
              </Button>
              <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Find your perfect job swap match and reduce your commute
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matches Found</p>
                  <p className="text-3xl font-bold text-foreground">
                    <CountUpNumber end={matchesFound} duration={1500} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Send className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requests Sent</p>
                  <p className="text-3xl font-bold text-foreground">
                    <CountUpNumber end={requestsSent} duration={1500} delay={200} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Time Saved/Day</p>
                  <p className="text-3xl font-bold text-foreground">
                    <CountUpNumber end={averageTimeSaved} duration={1500} delay={400} suffix=" min" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ Reduction</p>
                  <p className="text-3xl font-bold text-foreground">
                    <CountUpNumber end={Math.round(averageTimeSaved * 0.5)} duration={1500} delay={600} suffix=" kg" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle & Matches */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Your Matches</h2>
          <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Map View Coming Soon</p>
              <p className="text-sm">Google Maps integration will show matches on a map</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card key={match.id} className="card-hover overflow-hidden">
                <CardContent className="p-0">
                  {/* Header with avatar and compatibility */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={match.avatarUrl} 
                          alt={match.name}
                          className="h-12 w-12 rounded-full bg-secondary"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{match.name}</h3>
                            {isAIRecommended(match.id) && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="default" className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      AI Recommended
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="font-medium mb-1">AI Recommendation</p>
                                    <p className="text-xs">{getAIReasoning(match.id) || 'Top match based on compatibility analysis'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{match.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className={`text-2xl font-bold ${
                                match.compatibilityScore >= 90 ? 'text-success' : 
                                match.compatibilityScore >= 80 ? 'text-primary' : 'text-warning'
                              }`}>
                                {match.compatibilityScore}%
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Compatibility Score</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Based on skills, role, commute, and salary match
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <p className="text-xs text-muted-foreground">match</p>
                      </div>
                    </div>

                    {/* Job Title */}
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{match.jobTitle}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {match.skills.slice(0, 4).map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {match.skills.length > 4 && (
                        <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full">
                          +{match.skills.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Commute Comparison with AI Impact */}
                    <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Commute</span>
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-destructive line-through">
                          {match.commuteBeforeMinutes}m
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg font-semibold text-success">
                          {match.commuteAfterMinutes}m
                        </span>
                        <span className="text-sm text-success ml-auto">
                          -{match.commuteBeforeMinutes - match.commuteAfterMinutes}m/day
                        </span>
                      </div>
                      {(() => {
                        const impact = calculateCommuteImpact(
                          match.commuteBeforeMinutes,
                          match.commuteAfterMinutes
                        );
                        return (
                          <div className="pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Brain className="h-3 w-3" />
                              <span>AI Impact:</span>
                              <span className="text-success font-medium">
                                {impact.monthlyHoursSaved}h/month saved
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-success font-medium">
                                {impact.co2SavedEstimate}kg CO₂
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Salary Compatibility Badge */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      match.salaryCompatible 
                        ? 'bg-success/10 text-success' 
                        : 'bg-warning/10 text-warning'
                    }`}>
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {match.salaryCompatible ? 'Salary Compatible' : 'Salary Variance'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-4 pt-0">
                    {hasAlreadySentRequest(match.id) ? (
                      <Button variant="secondary" className="w-full" disabled>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Request Sent
                      </Button>
                    ) : (
                      <Button 
                        variant="hero" 
                        className="w-full"
                        onClick={() => openRequestModal(match)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Request
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Send Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Send Swap Request
            </DialogTitle>
          </DialogHeader>

          {selectedMatch && (
            <div className="space-y-6">
              {/* Match Details */}
              <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                <img 
                  src={selectedMatch.avatarUrl} 
                  alt={selectedMatch.name}
                  className="h-14 w-14 rounded-full bg-secondary"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{selectedMatch.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMatch.jobTitle}</p>
                  <p className="text-sm text-muted-foreground">{selectedMatch.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">{selectedMatch.compatibilityScore}%</div>
                  <p className="text-xs text-muted-foreground">compatibility</p>
                </div>
              </div>

              {/* Commute Savings */}
              <div className="flex items-center justify-between p-4 bg-success/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-success" />
                  <span className="font-medium text-success">Time Saved</span>
                </div>
                <span className="text-lg font-bold text-success">
                  {calculateCommuteSavings(selectedMatch.commuteBeforeMinutes, selectedMatch.commuteAfterMinutes)} min/day
                </span>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Message (optional)</Label>
                <Textarea 
                  placeholder="Add a personal message..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Consent Toggles */}
              <div className="space-y-3">
                <Label>Sharing Preferences</Label>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <Checkbox 
                    id="shareResume" 
                    checked={shareResume}
                    onCheckedChange={(checked) => setShareResume(checked as boolean)}
                  />
                  <Label htmlFor="shareResume" className="cursor-pointer flex-1">
                    Share resume with HR for review
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <Checkbox 
                    id="shareContact" 
                    checked={shareContact}
                    onCheckedChange={(checked) => setShareContact(checked as boolean)}
                  />
                  <Label htmlFor="shareContact" className="cursor-pointer flex-1">
                    Share contact info with peer
                  </Label>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-muted rounded-xl">
                <h4 className="font-medium text-foreground mb-2">What will be shared:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Your job title and company
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Commute compatibility score
                  </li>
                  {shareResume && (
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Your resume (to HR only)
                    </li>
                  )}
                  {shareContact && (
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Your contact information
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="hero" 
                  className="flex-1"
                  onClick={handleSendRequest}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
