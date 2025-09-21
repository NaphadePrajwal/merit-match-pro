import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Clock, Users, Star, ExternalLink, TrendingUp, MessageCircle, Volume2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface RecommendationEngineProps {
  userProfile: any;
  language: string;
  onBack: () => void;
  onNavigateToSkills: () => void;
  onNavigateToChat: () => void;
}

const mockInternships = [
  {
    id: 1,
    title: "Data Analytics Intern",
    company: "TechCorp India",
    location: "Mumbai, Maharashtra",
    duration: "3 months",
    stipend: "₹20,000/month",
    skills: ["Python", "Data Analysis", "Excel"],
    description: "Work with real datasets to derive business insights",
    matchScore: 95,
    badges: ["Top Match", "High Stipend"],
    type: "Full-time",
    applyUrl: "#"
  },
  {
    id: 2,
    title: "Software Development Intern",
    company: "StartupXYZ",
    location: "Bangalore, Karnataka",
    duration: "6 months",
    stipend: "₹25,000/month",
    skills: ["JavaScript", "React", "Node.js"],
    description: "Build scalable web applications using modern tech stack",
    matchScore: 88,
    badges: ["Tech Heavy", "Mentorship"],
    type: "Full-time",
    applyUrl: "#"
  },
  {
    id: 3,
    title: "Digital Marketing Intern",
    company: "MediaCorp",
    location: "Delhi, NCR",
    duration: "4 months",
    stipend: "₹15,000/month",
    skills: ["Digital Marketing", "Content Writing", "Communication"],
    description: "Create and execute digital marketing campaigns",
    matchScore: 82,
    badges: ["Creative", "Nearby"],
    type: "Hybrid",
    applyUrl: "#"
  },
  {
    id: 4,
    title: "Financial Analyst Intern",
    company: "FinanceHub",
    location: "Pune, Maharashtra",
    duration: "4 months",
    stipend: "₹18,000/month",
    skills: ["Finance", "Excel", "Data Analysis"],
    description: "Support financial planning and analysis activities",
    matchScore: 78,
    badges: ["Growth Focused"],
    type: "Full-time",
    applyUrl: "#"
  },
  {
    id: 5,
    title: "UI/UX Design Intern",
    company: "DesignStudio",
    location: "Chennai, Tamil Nadu",
    duration: "3 months",
    stipend: "₹22,000/month",
    skills: ["Graphic Design", "Communication", "Creativity"],
    description: "Design user interfaces for mobile and web applications",
    matchScore: 75,
    badges: ["Portfolio Builder"],
    type: "Remote",
    applyUrl: "#"
  }
];

const RecommendationEngine = ({ userProfile, language, onBack, onNavigateToSkills, onNavigateToChat }: RecommendationEngineProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { speak } = useTextToSpeech();

  useEffect(() => {
    fetchInternshipsAndAnalyze();
  }, [userProfile]);

  const fetchInternshipsAndAnalyze = async () => {
    setLoading(true);
    try {
      // Fetch internships from database
      const { data: internships, error } = await supabase
        .from('internships')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!internships || internships.length === 0) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      // Use ML-powered analysis for each internship
      const analysisPromises = internships.map(async (internship) => {
        try {
          const { data: mlAnalysis } = await supabase.functions.invoke('ml-resume-analysis', {
            body: {
              resumeText: userProfile?.experience || `Skills: ${userProfile?.skills?.join(', ')}. Interests: ${userProfile?.interests?.join(', ')}. Education: ${userProfile?.education} from ${userProfile?.institute}`,
              requiredSkills: internship.required_skills || [],
              preferredSkills: internship.preferred_skills || [],
              internshipDescription: internship.description
            }
          });

          const matchScore = mlAnalysis?.analysis?.overall_match_score || 
            calculateFallbackScore(internship, userProfile);

          return {
            ...internship,
            matchScore,
            mlAnalysis: mlAnalysis?.analysis,
            stipend: `₹${(internship.stipend / 1000).toFixed(0)}K/month`,
            skills: [...(internship.required_skills || []), ...(internship.preferred_skills || [])],
            badges: generateBadges(internship, matchScore)
          };
        } catch (error) {
          console.error('ML analysis error for internship:', internship.id, error);
          // Fallback to simple matching
          const matchScore = calculateFallbackScore(internship, userProfile);
          return {
            ...internship,
            matchScore,
            stipend: `₹${(internship.stipend / 1000).toFixed(0)}K/month`,
            skills: [...(internship.required_skills || []), ...(internship.preferred_skills || [])],
            badges: generateBadges(internship, matchScore)
          };
        }
      });

      const analyzedInternships = await Promise.all(analysisPromises);
      
      const sortedRecommendations = analyzedInternships
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);
      
      setRecommendations(sortedRecommendations);
      
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations. Using fallback data.",
        variant: "destructive",
      });
      // Fallback to mock data
      const fallbackRecommendations = mockInternships.map(internship => ({
        ...internship,
        matchScore: Math.floor(Math.random() * 40) + 60
      })).slice(0, 5);
      setRecommendations(fallbackRecommendations);
    } finally {
      setLoading(false);
    }
  };

  const calculateFallbackScore = (internship: any, profile: any) => {
    let score = 60; // Base score
    const userSkills = profile?.skills || [];
    const userInterests = profile?.interests || [];
    
    // Skill matching (40 points max)
    const requiredSkills = internship.required_skills || [];
    const preferredSkills = internship.preferred_skills || [];
    const allSkills = [...requiredSkills, ...preferredSkills];
    
    const matchedSkills = userSkills.filter(skill => 
      allSkills.some(reqSkill => reqSkill.toLowerCase().includes(skill.toLowerCase()))
    );
    score += (matchedSkills.length / Math.max(allSkills.length, 1)) * 30;
    
    // Interest matching (20 points max)
    const interestMatch = userInterests.some(interest => 
      internship.title.toLowerCase().includes(interest.toLowerCase()) ||
      internship.description.toLowerCase().includes(interest.toLowerCase())
    );
    if (interestMatch) score += 15;
    
    // Location preference (10 points max)
    if (profile?.location && internship.location.toLowerCase().includes(profile.location.toLowerCase())) {
      score += 10;
    }
    
    return Math.min(Math.max(score, 60), 95);
  };

  const generateBadges = (internship: any, matchScore: number) => {
    const badges = [];
    if (matchScore >= 90) badges.push("Top Match");
    if (internship.stipend >= 25000) badges.push("High Stipend");
    if (internship.type === "remote") badges.push("Remote");
    if (internship.difficulty_level === "beginner") badges.push("Beginner Friendly");
    if (internship.category === "tech") badges.push("Tech Heavy");
    return badges;
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Top Match": return "bg-success";
      case "High Stipend": return "bg-secondary";
      case "Nearby": return "bg-primary";
      case "Tech Heavy": return "bg-purple-500";
      case "Creative": return "bg-pink-500";
      default: return "bg-muted";
    }
  };

  const getMatchingSkills = (internshipSkills: string[]) => {
    const userSkills = userProfile?.skills || [];
    return internshipSkills.filter(skill => userSkills.includes(skill));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-4 animate-pulse"></div>
            <h3 className="text-xl font-semibold mb-2">Finding Your Perfect Match</h3>
            <p className="text-muted-foreground mb-4">Our AI is analyzing thousands of internships...</p>
            <Progress value={75} className="w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Your Recommendations</h1>
              <p className="text-muted-foreground">
                Found {recommendations.length} perfect matches for {userProfile?.name}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onNavigateToSkills}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Skill Gap
            </Button>
            <Button variant="outline" onClick={onNavigateToChat}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(recommendations.reduce((acc, r) => acc + r.matchScore, 0) / recommendations.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Match</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success">
                {recommendations.filter(r => r.matchScore > 85).length}
              </div>
              <div className="text-sm text-muted-foreground">High Matches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-secondary">
                ₹{Math.round(recommendations.reduce((acc, r) => acc + parseInt(r.stipend.replace(/[^\d]/g, '')), 0) / recommendations.length / 1000)}K
              </div>
              <div className="text-sm text-muted-foreground">Avg Stipend</div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations List */}
        <div className="space-y-6">
          {recommendations.map((internship, index) => (
            <Card key={internship.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-xl">{internship.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => speak(`${internship.title} at ${internship.company}. ${internship.description}`, language)}
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                      {index === 0 && <Badge className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">🏆 Best Match</Badge>}
                    </div>
                    <p className="text-lg font-medium text-primary">{internship.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {internship.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {internship.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {internship.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-bold">{Math.round(internship.matchScore)}%</span>
                    </div>
                    <div className="text-lg font-semibold text-success">{internship.stipend}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{internship.description}</p>
                
                {/* Skills Match */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Skills Match:</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill: string) => {
                      const isMatched = getMatchingSkills(internship.skills).includes(skill);
                      return (
                        <Badge 
                          key={skill} 
                          variant={isMatched ? "default" : "outline"}
                          className={isMatched ? "bg-success" : ""}
                        >
                          {isMatched && "✓ "}{skill}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Match Score Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Match Score</span>
                    <span>{Math.round(internship.matchScore)}%</span>
                  </div>
                  <Progress value={internship.matchScore} className="w-full" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {internship.badges.map((badge: string) => (
                    <Badge 
                      key={badge} 
                      className={`${
                        badge.includes('Top Match') ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground' :
                        badge.includes('High Stipend') ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white' :
                        badge.includes('Nearby') ? 'bg-success text-success-foreground' :
                        badge.includes('Tech Heavy') ? 'bg-purple-500 text-white' :
                        badge.includes('Creative') ? 'bg-pink-500 text-white' :
                        'bg-accent'
                      }`}
                    >
                      {badge.includes('Top Match') && '🏆 '}
                      {badge.includes('High Stipend') && '💰 '}
                      {badge.includes('Nearby') && '📍 '}
                      {badge.includes('Tech Heavy') && '💻 '}
                      {badge.includes('Creative') && '🎨 '}
                      {badge.includes('Growth') && '📈 '}
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Why Recommended */}
                <div className="bg-accent p-3 rounded-lg mb-4">
                  <h5 className="font-medium text-sm mb-1">Why this matches you:</h5>
                  <p className="text-sm text-muted-foreground">
                    {getMatchingSkills(internship.skills).length > 0 && 
                      `Matches ${getMatchingSkills(internship.skills).length} of your skills. `
                    }
                    {userProfile?.interests?.some((interest: string) => 
                      internship.title.toLowerCase().includes(interest.toLowerCase())
                    ) && "Aligns with your interests. "}
                    Good growth opportunity in {internship.company}.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-primary-glow">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                  <Button variant="outline">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Missing Skills?</h3>
              <p className="text-muted-foreground mb-4">
                Discover what skills you need to unlock even better opportunities
              </p>
              <Button onClick={onNavigateToSkills} className="bg-success hover:bg-success/90">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Skill Gap Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Need Guidance?</h3>
              <p className="text-muted-foreground mb-4">
                Chat with our AI career guide for personalized advice
              </p>
              <Button onClick={onNavigateToChat} variant="outline" className="border-primary hover:bg-primary/10">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with AI Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;