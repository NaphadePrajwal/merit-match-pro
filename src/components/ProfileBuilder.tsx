import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Mic, User, GraduationCap, MapPin, Briefcase } from "lucide-react";
import VoiceInput from "./VoiceInput";
import { toast } from "@/hooks/use-toast";

interface ProfileBuilderProps {
  language: string;
  onComplete: (profile: any) => void;
  onBack: () => void;
}

const ProfileBuilder = ({ language, onComplete, onBack }: ProfileBuilderProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    institute: '',
    year: '',
    skills: [] as string[],
    interests: [] as string[],
    location: '',
    pincode: '',
    experience: '',
    resume: null as File | null
  });

  const skillSuggestions = [
    'Python', 'JavaScript', 'Data Analysis', 'Machine Learning', 'React', 'Node.js',
    'SQL', 'Excel', 'Communication', 'Leadership', 'Project Management', 'Marketing',
    'Content Writing', 'Graphic Design', 'Digital Marketing', 'Finance', 'Accounting'
  ];

  const interestAreas = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Sales',
    'Design', 'Data Science', 'Software Development', 'Consulting', 'Research',
    'Government', 'NGO', 'Startups', 'Media', 'Environment'
  ];

  const addSkill = (skill: string) => {
    if (!profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addInterest = (interest: string) => {
    if (!profile.interests.includes(interest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, resume: file }));
      // Simulate skill extraction from resume
      toast({
        title: "Resume Uploaded!",
        description: "Extracting skills from your resume...",
      });
      
      // Mock skill extraction
      setTimeout(() => {
        const extractedSkills = ['Python', 'Data Analysis', 'Communication'];
        setProfile(prev => ({
          ...prev,
          skills: [...new Set([...prev.skills, ...extractedSkills])]
        }));
        toast({
          title: "Skills Extracted!",
          description: `Found ${extractedSkills.length} skills in your resume.`,
        });
      }, 2000);
    }
  };

  const renderStep1 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-primary" />
          <span>Personal Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={profile.pincode}
              onChange={(e) => setProfile(prev => ({ ...prev, pincode: e.target.value }))}
              placeholder="Enter your pincode"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Preferred Location</Label>
          <Input
            id="location"
            value={profile.location}
            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, State"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <span>Education & Experience</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="education">Education Level</Label>
          <Select value={profile.education} onValueChange={(value) => setProfile(prev => ({ ...prev, education: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12th">12th Grade</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
              <SelectItem value="master">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="institute">Institute/College</Label>
            <Input
              id="institute"
              value={profile.institute}
              onChange={(e) => setProfile(prev => ({ ...prev, institute: e.target.value }))}
              placeholder="Your institute name"
            />
          </div>
          <div>
            <Label htmlFor="year">Year of Study</Label>
            <Select value={profile.year} onValueChange={(value) => setProfile(prev => ({ ...prev, year: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st">1st Year</SelectItem>
                <SelectItem value="2nd">2nd Year</SelectItem>
                <SelectItem value="3rd">3rd Year</SelectItem>
                <SelectItem value="4th">4th Year</SelectItem>
                <SelectItem value="final">Final Year</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="experience">Previous Experience (Optional)</Label>
          <Textarea
            id="experience"
            value={profile.experience}
            onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
            placeholder="Describe any previous internships, projects, or work experience..."
            rows={3}
          />
        </div>

        <div>
          <Label>Upload Resume (Optional)</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload your resume to auto-extract skills
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
            />
            <Button variant="outline" onClick={() => document.getElementById('resume-upload')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            {profile.resume && (
              <p className="text-sm text-success mt-2">✓ {profile.resume.name}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <span>Skills & Interests</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Your Skills</Label>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="cursor-pointer"
                onClick={() => removeSkill(skill)}
              >
                {skill} ×
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skillSuggestions.filter(skill => !profile.skills.includes(skill)).map((skill) => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill)}
                className="text-xs"
              >
                + {skill}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Interest Areas</Label>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.interests.map((interest) => (
              <Badge 
                key={interest} 
                variant="default" 
                className="cursor-pointer bg-success"
                onClick={() => removeInterest(interest)}
              >
                {interest} ×
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestAreas.filter(interest => !profile.interests.includes(interest)).map((interest) => (
              <Button
                key={interest}
                variant="outline"
                size="sm"
                onClick={() => addInterest(interest)}
                className="text-xs"
              >
                + {interest}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Mic className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Voice Input for Skills & Interests</span>
          </div>
          <VoiceInput 
            onTranscript={(text) => {
              // Add to skills and interests based on content
              const words = text.split(',').map(w => w.trim()).filter(w => w);
              const newSkills = words.filter(word => 
                skillSuggestions.some(skill => 
                  skill.toLowerCase().includes(word.toLowerCase()) || 
                  word.toLowerCase().includes(skill.toLowerCase())
                ) && !profile.skills.includes(word)
              );
              const newInterests = words.filter(word => 
                interestAreas.some(interest => 
                  interest.toLowerCase().includes(word.toLowerCase()) ||
                  word.toLowerCase().includes(interest.toLowerCase())
                ) && !profile.interests.includes(word)
              );
              
              setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, ...newSkills],
                interests: [...prev.interests, ...newInterests]
              }));
            }}
            language={language}
            placeholder="Say your skills and interests separated by commas..."
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 p-4">
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Build Your Profile</h1>
            <p className="text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  num <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`flex-1 h-2 mx-2 rounded ${
                    num < step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="max-w-2xl mx-auto mt-8 flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!profile.name || !profile.email)}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={() => onComplete(profile)}
              className="bg-gradient-to-r from-primary to-primary-glow"
              disabled={profile.skills.length === 0 || profile.interests.length === 0}
            >
              Get Recommendations
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileBuilder;