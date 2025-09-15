import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Users, Brain, BookOpen, MapPin, MessageCircle } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import ProfileBuilder from "@/components/ProfileBuilder";
import RecommendationEngine from "@/components/RecommendationEngine";
import SkillGapAnalysis from "@/components/SkillGapAnalysis";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'profile' | 'recommendations' | 'skills' | 'chat'>('landing');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userProfile, setUserProfile] = useState(null);

  const features = [
    {
      icon: Brain,
      title: "Smart Recommendations",
      description: "AI-powered matching based on your skills and interests"
    },
    {
      icon: Mic,
      title: "Voice Support",
      description: "Speak in your preferred language"
    },
    {
      icon: BookOpen,
      title: "Skill Gap Analysis",
      description: "Find missing skills and get learning resources"
    },
    {
      icon: MapPin,
      title: "Location-Based",
      description: "Find internships near you"
    },
    {
      icon: MessageCircle,
      title: "AI Career Guide",
      description: "Get personalized career guidance"
    },
    {
      icon: Users,
      title: "Inclusive Design",
      description: "Built for all literacy levels"
    }
  ];

  if (currentStep === 'profile') {
    return (
      <ProfileBuilder 
        language={selectedLanguage}
        onComplete={(profile) => {
          setUserProfile(profile);
          setCurrentStep('recommendations');
        }}
        onBack={() => setCurrentStep('landing')}
      />
    );
  }

  if (currentStep === 'recommendations') {
    return (
      <RecommendationEngine 
        userProfile={userProfile}
        language={selectedLanguage}
        onViewSkillGap={() => setCurrentStep('skills')}
        onOpenChat={() => setCurrentStep('chat')}
      />
    );
  }

  if (currentStep === 'skills') {
    return (
      <SkillGapAnalysis 
        userProfile={userProfile}
        language={selectedLanguage}
        onBack={() => setCurrentStep('recommendations')}
      />
    );
  }

  if (currentStep === 'chat') {
    return (
      <ChatBot 
        language={selectedLanguage}
        userProfile={userProfile}
        onBack={() => setCurrentStep('recommendations')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">InternMatch AI</h1>
              <p className="text-sm text-muted-foreground">PM Internship Scheme</p>
            </div>
          </div>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            🚀 Smart Career Matching
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              PM Internship
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            AI-powered recommendations that match your skills, interests, and location. 
            Speak in your language. Learn what you need. Grow your career.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={() => setCurrentStep('profile')}
            >
              <Brain className="w-5 h-5 mr-2" />
              Start Profile
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-accent"
              onClick={() => setCurrentStep('chat')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Ask AI Guide
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-16">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Internships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">95%</div>
              <div className="text-sm text-muted-foreground">Match Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">12</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Designed for Every Student
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From voice input to skill analysis, every feature is built to help you succeed
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-0 shadow-2xl">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Future?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who've found their perfect internship match
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 rounded-xl"
              onClick={() => setCurrentStep('profile')}
            >
              <Users className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>© 2024 InternMatch AI - PM Internship Scheme. Built for student success.</p>
      </footer>
    </div>
  );
};

export default Index;