import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, ExternalLink, Play, Clock, Star } from "lucide-react";

interface SkillGapAnalysisProps {
  userProfile: any;
  language: string;
  onBack: () => void;
}

const skillDatabase = {
  "Data Analytics Intern": {
    required: ["Python", "SQL", "Excel", "Statistics", "Power BI"],
    preferred: ["Machine Learning", "R", "Tableau", "Data Visualization"]
  },
  "Software Development Intern": {
    required: ["JavaScript", "HTML", "CSS", "Git", "Problem Solving"],
    preferred: ["React", "Node.js", "TypeScript", "Database Design"]
  },
  "Digital Marketing Intern": {
    required: ["Digital Marketing", "Content Writing", "Social Media", "Analytics"],
    preferred: ["SEO", "Google Ads", "Graphic Design", "Video Editing"]
  },
  "Financial Analyst Intern": {
    required: ["Finance", "Excel", "Financial Modeling", "Accounting"],
    preferred: ["Python", "VBA", "Bloomberg Terminal", "Investment Analysis"]
  },
  "UI/UX Design Intern": {
    required: ["Figma", "User Research", "Wireframing", "Prototyping"],
    preferred: ["Adobe Creative Suite", "HTML/CSS", "User Testing", "Design Systems"]
  }
};

const learningResources = {
  "Python": [
    { name: "Python for Everybody (Coursera)", type: "Course", duration: "8 weeks", free: true, url: "#" },
    { name: "Python Programming Tutorial", type: "YouTube", duration: "12 hours", free: true, url: "#" }
  ],
  "SQL": [
    { name: "SQL Basics (SWAYAM)", type: "Course", duration: "6 weeks", free: true, url: "#" },
    { name: "SQL Tutorial for Beginners", type: "YouTube", duration: "4 hours", free: true, url: "#" }
  ],
  "Excel": [
    { name: "Excel Skills for Business", type: "Coursera", duration: "6 weeks", free: true, url: "#" },
    { name: "Advanced Excel Tutorial", type: "YouTube", duration: "8 hours", free: true, url: "#" }
  ],
  "JavaScript": [
    { name: "JavaScript Fundamentals", type: "freeCodeCamp", duration: "10 weeks", free: true, url: "#" },
    { name: "JS Complete Course", type: "YouTube", duration: "22 hours", free: true, url: "#" }
  ],
  "React": [
    { name: "React Official Tutorial", type: "Documentation", duration: "2 weeks", free: true, url: "#" },
    { name: "React Full Course", type: "YouTube", duration: "12 hours", free: true, url: "#" }
  ],
  "Digital Marketing": [
    { name: "Google Digital Marketing Course", type: "Google", duration: "8 weeks", free: true, url: "#" },
    { name: "Digital Marketing Masterclass", type: "YouTube", duration: "15 hours", free: true, url: "#" }
  ],
  "Machine Learning": [
    { name: "ML for Everyone (SWAYAM)", type: "Course", duration: "12 weeks", free: true, url: "#" },
    { name: "Machine Learning Basics", type: "YouTube", duration: "20 hours", free: true, url: "#" }
  ],
  "Figma": [
    { name: "Figma Academy", type: "Official", duration: "4 weeks", free: true, url: "#" },
    { name: "Figma Complete Tutorial", type: "YouTube", duration: "6 hours", free: true, url: "#" }
  ]
};

const SkillGapAnalysis = ({ userProfile, language, onBack }: SkillGapAnalysisProps) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Analyze skill gaps based on user profile and top internship categories
      const userSkills = userProfile?.skills || [];
      const userInterests = userProfile?.interests || [];
      
      // Find relevant job categories based on interests
      const relevantJobs = Object.keys(skillDatabase).filter(job => 
        userInterests.some((interest: string) => 
          job.toLowerCase().includes(interest.toLowerCase())
        )
      );

      if (relevantJobs.length === 0) {
        // Default to popular categories
        relevantJobs.push("Data Analytics Intern", "Software Development Intern");
      }

      const skillGaps = relevantJobs.map(job => {
        const jobSkills = skillDatabase[job as keyof typeof skillDatabase];
        const missingRequired = jobSkills.required.filter(skill => !userSkills.includes(skill));
        const missingPreferred = jobSkills.preferred.filter(skill => !userSkills.includes(skill));
        const hasRequired = jobSkills.required.filter(skill => userSkills.includes(skill));
        
        return {
          jobTitle: job,
          missingRequired,
          missingPreferred,
          hasRequired,
          completionScore: Math.round((hasRequired.length / jobSkills.required.length) * 100)
        };
      });

      // Get all missing skills with learning resources
      const allMissingSkills = Array.from(new Set([
        ...skillGaps.flatMap(gap => gap.missingRequired),
        ...skillGaps.flatMap(gap => gap.missingPreferred)
      ]));

      const prioritySkills = allMissingSkills
        .filter(skill => learningResources[skill as keyof typeof learningResources])
        .slice(0, 6);

      setAnalysis({
        skillGaps,
        prioritySkills,
        totalMissingSkills: allMissingSkills.length,
        averageCompletion: Math.round(skillGaps.reduce((acc, gap) => acc + gap.completionScore, 0) / skillGaps.length)
      });
      setLoading(false);
    }, 1500);
  }, [userProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-success to-secondary rounded-full mx-auto mb-4 animate-pulse"></div>
            <h3 className="text-xl font-semibold mb-2">Analyzing Your Skills</h3>
            <p className="text-muted-foreground mb-4">Identifying gaps and growth opportunities...</p>
            <Progress value={60} className="w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recommendations
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Skill Gap Analysis</h1>
            <p className="text-muted-foreground">Personalized learning path for {userProfile?.name}</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success">{analysis.averageCompletion}%</div>
              <div className="text-sm text-muted-foreground">Skills Complete</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-secondary">{analysis.prioritySkills.length}</div>
              <div className="text-sm text-muted-foreground">Priority Skills</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{analysis.skillGaps.length}</div>
              <div className="text-sm text-muted-foreground">Career Paths</div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Gap by Job Category */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Skills by Career Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysis.skillGaps.map((gap: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{gap.jobTitle}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Completion:</span>
                      <Badge variant={gap.completionScore > 70 ? "default" : "secondary"} className="bg-success">
                        {gap.completionScore}%
                      </Badge>
                    </div>
                  </div>
                  
                  <Progress value={gap.completionScore} className="mb-4" />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-success mb-2">✓ Skills You Have ({gap.hasRequired.length})</h4>
                      <div className="flex flex-wrap gap-1">
                        {gap.hasRequired.map((skill: string) => (
                          <Badge key={skill} className="bg-success/10 text-success border-success">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-destructive mb-2">⚠ Missing Required ({gap.missingRequired.length})</h4>
                      <div className="flex flex-wrap gap-1">
                        {gap.missingRequired.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-destructive text-destructive">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {gap.missingPreferred.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-secondary mb-2">💡 Nice to Have ({gap.missingPreferred.length})</h4>
                      <div className="flex flex-wrap gap-1">
                        {gap.missingPreferred.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-secondary text-secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Learning Path */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-secondary" />
              Your Priority Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysis.prioritySkills.map((skill: string, index: number) => {
                const resources = learningResources[skill as keyof typeof learningResources] || [];
                return (
                  <Card key={skill} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{skill}</CardTitle>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {resources.slice(0, 2).map((resource, idx) => (
                          <div key={idx} className="border rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm">{resource.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {resource.type}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mb-3">
                              <Clock className="w-3 h-3 mr-1" />
                              {resource.duration}
                              {resource.free && <Badge variant="secondary" className="ml-2 text-xs">Free</Badge>}
                            </div>
                            <Button size="sm" className="w-full">
                              <Play className="w-3 h-3 mr-2" />
                              Start Learning
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Section */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Bridge the Gap?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start with the highest priority skills to maximize your internship opportunities. 
              Each skill you learn increases your match score significantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow">
                <ExternalLink className="w-4 h-4 mr-2" />
                Create Learning Plan
              </Button>
              <Button size="lg" variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;