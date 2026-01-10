import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppState } from '@/state/AppStateContext';
import { CountUpNumber } from '@/hooks/useCountUp';
import { HRRequest } from '@/mock/data';
import { 
  ArrowLeft, 
  Building2,
  Clock,
  DollarSign,
  CheckCircle2,
  X,
  Search,
  Download,
  FileText,
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

export default function HRPortal() {
  const navigate = useNavigate();
  const { state, hrApprove, hrReject } = useAppState();
  const { hrRequests } = state;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<HRRequest | null>(null);

  // Filter requests
  const filteredRequests = hrRequests.filter(req => {
    const matchesSearch = 
      req.fromUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.toUserName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate KPIs
  const pendingCount = hrRequests.filter(r => r.status === 'hr_review' || r.status === 'peer_accepted').length;
  const approvedCount = hrRequests.filter(r => r.status === 'approved').length;
  const totalTimeSaved = hrRequests
    .filter(r => r.status === 'approved')
    .reduce((acc, r) => acc + r.commuteSavingsMinutes * 2 * 22, 0); // Monthly minutes
  const totalCostSaved = hrRequests
    .filter(r => r.status === 'approved')
    .reduce((acc, r) => acc + r.estimatedCostSavings, 0);

  const handleApprove = (requestId: string) => {
    hrApprove(requestId);
    toast.success('Request approved!', {
      description: 'The job swap has been approved and employees will be notified.',
    });
    setSelectedRequest(null);
  };

  const handleReject = (requestId: string) => {
    hrReject(requestId);
    toast.info('Request rejected', {
      description: 'The swap request has been rejected.',
    });
    setSelectedRequest(null);
  };

  const handleExportCSV = () => {
    toast.info('Export started', {
      description: 'CSV export functionality will be available with backend integration.',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      peer_accepted: 'bg-info/10 text-info',
      hr_review: 'bg-primary/10 text-primary',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-destructive/10 text-destructive',
    };
    
    const labels = {
      pending: 'Pending',
      peer_accepted: 'Peer Accepted',
      hr_review: 'HR Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-muted text-muted-foreground'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

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
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">HR Portal</h1>
              <p className="text-muted-foreground">
                Manage and approve job swap requests
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-3xl font-bold text-foreground">
                    <CountUpNumber end={pendingCount} duration={1500} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved Swaps</p>
                  <p className="text-3xl font-bold text-foreground">
                    <CountUpNumber end={approvedCount} duration={1500} delay={200} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Saved (Monthly)</p>
                  <p className="text-3xl font-bold text-foreground">
                    <CountUpNumber end={Math.round(totalTimeSaved / 60)} duration={1500} delay={400} suffix="h" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost Saved</p>
                  <p className="text-3xl font-bold text-foreground">
                    $<CountUpNumber end={totalCostSaved} duration={1500} delay={600} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="peer_accepted">Peer Accepted</SelectItem>
                    <SelectItem value="hr_review">HR Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Swap Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRequests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requester</TableHead>
                    <TableHead>Counterparty</TableHead>
                    <TableHead className="text-center">Compatibility</TableHead>
                    <TableHead className="text-center">Commute Savings</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.fromUserName.replace(' ', '')}`}
                            alt={request.fromUserName}
                            className="h-8 w-8 rounded-full bg-secondary"
                          />
                          <div>
                            <p className="font-medium text-foreground">{request.fromUserName}</p>
                            <p className="text-xs text-muted-foreground">{request.fromUserJobTitle}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.toUserName.replace(' ', '')}`}
                            alt={request.toUserName}
                            className="h-8 w-8 rounded-full bg-secondary"
                          />
                          <div>
                            <p className="font-medium text-foreground">{request.toUserName}</p>
                            <p className="text-xs text-muted-foreground">{request.toUserJobTitle}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-bold ${
                          request.compatibilityScore >= 90 ? 'text-success' : 
                          request.compatibilityScore >= 80 ? 'text-primary' : 'text-warning'
                        }`}>
                          {request.compatibilityScore}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-success font-medium">
                          {request.commuteSavingsMinutes * 2} min/day
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(request.status === 'peer_accepted' || request.status === 'hr_review') && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReject(request.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleApprove(request.id)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No requests found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Request Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Swap Request Details</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Participants */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-2">Requester</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.fromUserName.replace(' ', '')}`}
                      alt={selectedRequest.fromUserName}
                      className="h-12 w-12 rounded-full bg-secondary"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{selectedRequest.fromUserName}</p>
                      <p className="text-sm text-muted-foreground">{selectedRequest.fromUserJobTitle}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-2">Counterparty</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.toUserName.replace(' ', '')}`}
                      alt={selectedRequest.toUserName}
                      className="h-12 w-12 rounded-full bg-secondary"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{selectedRequest.toUserName}</p>
                      <p className="text-sm text-muted-foreground">{selectedRequest.toUserJobTitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-success/10 rounded-xl text-center">
                  <p className="text-3xl font-bold text-success">{selectedRequest.compatibilityScore}%</p>
                  <p className="text-xs text-muted-foreground">Compatibility</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-xl text-center">
                  <p className="text-3xl font-bold text-primary">{selectedRequest.commuteSavingsMinutes * 2}m</p>
                  <p className="text-xs text-muted-foreground">Daily Savings</p>
                </div>
                <div className="p-4 bg-accent/10 rounded-xl text-center">
                  <p className="text-3xl font-bold text-accent">${selectedRequest.estimatedCostSavings}</p>
                  <p className="text-xs text-muted-foreground">Monthly Cost Saved</p>
                </div>
              </div>

              {/* Resume Access */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View {selectedRequest.fromUserName.split(' ')[0]}'s Resume
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View {selectedRequest.toUserName.split(' ')[0]}'s Resume
                </Button>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Status:</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                {(selectedRequest.status === 'peer_accepted' || selectedRequest.status === 'hr_review') && (
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => handleReject(selectedRequest.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      variant="success"
                      onClick={() => handleApprove(selectedRequest.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
