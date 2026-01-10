import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppState } from '@/state/AppStateContext';
import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  CheckCircle2, 
  X,
  Inbox,
  Users,
  TrendingUp,
  Briefcase,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

export default function IncomingRequests() {
  const navigate = useNavigate();
  const { state, acceptIncomingRequest, declineIncomingRequest } = useAppState();
  const { swapRequestsIncoming } = state;
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const pendingRequests = swapRequestsIncoming.filter(req => req.status === 'pending');
  const processedRequests = swapRequestsIncoming.filter(req => req.status !== 'pending');

  const handleAccept = (requestId: string) => {
    acceptIncomingRequest(requestId);
    toast.success('Request accepted!', {
      description: 'The swap request has been forwarded to HR for review.',
    });
    setSelectedRequest(null);
  };

  const handleDecline = (requestId: string) => {
    declineIncomingRequest(requestId);
    toast.info('Request declined', {
      description: 'The swap request has been removed.',
    });
    setSelectedRequest(null);
  };

  const selectedRequestData = selectedRequest 
    ? swapRequestsIncoming.find(req => req.id === selectedRequest)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Inbox className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Incoming Swap Requests</h1>
              <p className="text-muted-foreground">
                Review and respond to swap requests from other employees
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-foreground">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                  <p className="text-3xl font-bold text-foreground">
                    {processedRequests.filter(r => r.status === 'peer_accepted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-3xl font-bold text-foreground">{swapRequestsIncoming.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Pending Requests</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.fromUserName.replace(' ', '')}`}
                          alt={request.fromUserName}
                          className="h-12 w-12 rounded-full bg-secondary"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">{request.fromUserName}</h3>
                          <p className="text-sm text-muted-foreground">{request.fromUserCompany}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-success">{request.compatibilityScore}%</div>
                        <p className="text-xs text-muted-foreground">match</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{request.fromUserJobTitle}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {request.fromUserSkills.slice(0, 4).map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Commute Savings */}
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">Time Saved</span>
                      </div>
                      <span className="font-bold text-success">
                        {request.commuteSavingsMinutes * 2} min/day
                      </span>
                    </div>

                    {/* Message */}
                    {request.message && (
                      <div className="p-3 bg-muted rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Message</span>
                        </div>
                        <p className="text-sm text-foreground">{request.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDecline(request.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                      <Button 
                        variant="success" 
                        className="flex-1"
                        onClick={() => handleAccept(request.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                    </div>

                    <Button 
                      variant="ghost" 
                      className="w-full mt-2"
                      onClick={() => setSelectedRequest(request.id)}
                    >
                      View Compatibility Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Inbox className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any incoming swap requests at the moment.
              </p>
              <Button variant="hero" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Processed Requests</h2>
            <div className="space-y-4">
              {processedRequests.map((request) => (
                <Card key={request.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.fromUserName.replace(' ', '')}`}
                          alt={request.fromUserName}
                          className="h-10 w-10 rounded-full bg-secondary"
                        />
                        <div>
                          <h3 className="font-medium text-foreground">{request.fromUserName}</h3>
                          <p className="text-sm text-muted-foreground">{request.fromUserJobTitle}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'peer_accepted' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        {request.status === 'peer_accepted' ? 'Accepted - HR Review' : request.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Compatibility Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Compatibility Details</DialogTitle>
          </DialogHeader>

          {selectedRequestData && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="text-6xl font-bold text-success mb-2">
                  {selectedRequestData.compatibilityScore}%
                </div>
                <p className="text-muted-foreground">Overall Match Score</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-success" />
                    <span className="font-medium">Daily Commute Savings</span>
                  </div>
                  <span className="text-lg font-bold text-success">
                    {selectedRequestData.commuteSavingsMinutes * 2} min
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="font-medium">Est. Monthly Savings</span>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    ${Math.round((selectedRequestData.commuteSavingsMinutes * 2 * 22 / 60) * 25)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-info" />
                    <span className="font-medium">Role Match</span>
                  </div>
                  <span className="text-lg font-bold text-info">100%</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleDecline(selectedRequestData.id)}
                >
                  Decline
                </Button>
                <Button 
                  variant="success" 
                  className="flex-1"
                  onClick={() => handleAccept(selectedRequestData.id)}
                >
                  Accept Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
