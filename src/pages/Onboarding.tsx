import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppState } from '@/state/AppStateContext';
import { mockMatches, mockParsedSkills, generateId } from '@/mock/data';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  MapPin, 
  FileText, 
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Personal Info', icon: FileText },
  { id: 2, title: 'Locations', icon: MapPin },
  { id: 3, title: 'Resume', icon: Upload },
  { id: 4, title: 'Review', icon: CheckCircle2 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeProfile, dispatch } = useAppState();
  const [currentStep, setCurrentStep] = useState(1);
  const [isParsing, setIsParsing] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [consentParsing, setConsentParsing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    jobTitle: '',
    salaryBand: '',
    homeAddress: '',
    workAddress: '',
    skills: [] as string[],
  });

  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      if (consentParsing) {
        await parseResume();
      }
    }
  };

  const parseResume = async () => {
    setIsParsing(true);
    // Simulate AI parsing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormData(prev => ({ ...prev, skills: mockParsedSkills }));
    setIsParsing(false);
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const user = {
      id: generateId(),
      name: formData.name,
      email: formData.email,
      company: formData.company,
      jobTitle: formData.jobTitle,
      salaryBand: formData.salaryBand,
      homeLocation: {
        address: formData.homeAddress,
        lat: 37.3382,
        lng: -121.8863
      },
      workLocation: {
        address: formData.workAddress,
        lat: 37.7749,
        lng: -122.4194
      },
      skills: formData.skills,
      profileComplete: true,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.replace(' ', '')}`
    };

    completeProfile(user);
    dispatch({ type: 'SET_MATCHES', payload: mockMatches });
    navigate('/dashboard');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.company && formData.jobTitle && formData.salaryBand;
      case 2:
        return formData.homeAddress && formData.workAddress;
      case 3:
        return resumeFile && consentParsing;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen gradient-hero p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Help us find the best job swap matches for you
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex items-center gap-2 ${
                  step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : step.id === currentStep 
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-secondary text-muted-foreground'
                }`}>
                  {step.id < currentStep ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return <StepIcon className="h-5 w-5 text-primary" />;
              })()}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Company Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input 
                    id="company"
                    name="company"
                    placeholder="Acme Corporation"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Role</Label>
                    <Input 
                      id="jobTitle"
                      name="jobTitle"
                      placeholder="Senior Software Engineer"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryBand">Salary Band</Label>
                    <Input 
                      id="salaryBand"
                      name="salaryBand"
                      placeholder="$120,000 - $150,000"
                      value={formData.salaryBand}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Locations */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="homeAddress" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-success" />
                    Home Location
                  </Label>
                  <Input 
                    id="homeAddress"
                    name="homeAddress"
                    placeholder="Enter your home address"
                    value={formData.homeAddress}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    This is used to calculate commute time - not shared publicly
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workAddress" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Work Location
                  </Label>
                  <Input 
                    id="workAddress"
                    name="workAddress"
                    placeholder="Enter your office address"
                    value={formData.workAddress}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Map Placeholder */}
                <div className="h-48 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Map preview will appear here</p>
                    <p className="text-xs">Google Maps integration coming soon</p>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Resume Upload */}
            {currentStep === 3 && (
              <>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileText className="h-12 w-12 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{resumeFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(resumeFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setResumeFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="font-medium text-foreground mb-1">
                        Upload your resume
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        PDF or DOCX, max 10MB
                      </p>
                      <Label htmlFor="resume" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                      <Input 
                        id="resume"
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl">
                  <Checkbox 
                    id="consent" 
                    checked={consentParsing}
                    onCheckedChange={(checked) => {
                      setConsentParsing(checked as boolean);
                      if (checked && resumeFile) {
                        parseResume();
                      }
                    }}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="consent" className="cursor-pointer font-medium">
                      I consent to AI resume parsing
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Your resume will be analyzed to extract skills and experience for better matching. 
                      Data is encrypted and never shared without explicit consent.
                    </p>
                  </div>
                </div>

                {isParsing && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-primary/5 rounded-xl">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    <span className="text-sm font-medium text-primary">Parsing resume...</span>
                  </div>
                )}

                {formData.skills.length > 0 && !isParsing && (
                  <div className="space-y-3">
                    <Label>Extracted Skills (editable)</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill}
                          <button 
                            onClick={() => handleSkillRemove(skill)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{formData.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Job Role</p>
                    <p className="font-medium">{formData.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary Band</p>
                    <p className="font-medium">{formData.salaryBand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resume</p>
                    <p className="font-medium">{resumeFile?.name || 'Not uploaded'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Home Location</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-success" />
                    {formData.homeAddress}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Work Location</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {formData.workAddress}
                  </p>
                </div>

                {formData.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-success/10 rounded-xl border border-success/30">
                  <div className="flex items-center gap-2 text-success font-medium mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Ready to find matches!
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your profile is complete. Click below to start finding job swap opportunities.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                variant="hero"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                {currentStep === steps.length ? 'Complete Profile' : 'Continue'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
