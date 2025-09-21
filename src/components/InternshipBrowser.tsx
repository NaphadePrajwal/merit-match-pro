import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Users, Star, ExternalLink, Search, Filter, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InternshipBrowserProps {
  onBack: () => void;
  onBuildProfile: () => void;
}

const InternshipBrowser = ({ onBack, onBuildProfile }: InternshipBrowserProps) => {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast({
        title: "Error",
        description: "Failed to load internships. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || internship.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || internship.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "tech": return "bg-blue-500";
      case "business": return "bg-green-500";
      case "design": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const formatStipend = (stipend: number) => {
    return `₹${(stipend / 1000).toFixed(0)}K/month`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-4 animate-pulse"></div>
            <h3 className="text-xl font-semibold mb-2">Loading Internships</h3>
            <p className="text-muted-foreground">Fetching the latest opportunities...</p>
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
              <h1 className="text-2xl font-bold">Browse All Internships</h1>
              <p className="text-muted-foreground">
                Discover {internships.length} available opportunities
              </p>
            </div>
          </div>
          <Button onClick={onBuildProfile} className="bg-gradient-to-r from-primary to-primary-glow">
            Build Profile for Personalized Matches
          </Button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="pune">Pune</SelectItem>
              <SelectItem value="chennai">Chennai</SelectItem>
              <SelectItem value="hyderabad">Hyderabad</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredInternships.length} results
            </span>
          </div>
        </div>

        {/* Internships Grid */}
        <div className="grid gap-6">
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-xl">{internship.title}</CardTitle>
                      <Badge className={`${getBadgeColor(internship.category)} text-white`}>
                        {internship.category}
                      </Badge>
                      {internship.difficulty_level === 'beginner' && (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          Beginner Friendly
                        </Badge>
                      )}
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
                    <div className="text-lg font-semibold text-success">
                      {formatStipend(internship.stipend)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {internship.current_applications}/{internship.max_applications} applied
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">{internship.description}</p>
                
                {/* Required Skills */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.required_skills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                {internship.preferred_skills && internship.preferred_skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Preferred Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {internship.preferred_skills.map((skill: string) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deadlines */}
                <div className="bg-accent p-3 rounded-lg mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Application Deadline:</span>
                    <span className="font-medium">
                      {new Date(internship.application_deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Start Date:</span>
                    <span className="font-medium">
                      {new Date(internship.start_date).toLocaleDateString()}
                    </span>
                  </div>
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

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No internships found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setLocationFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-0">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Want Personalized Recommendations?</h2>
            <p className="text-lg opacity-90 mb-6">
              Build your profile to get AI-powered matches and see only the top 5 opportunities for you
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-4"
              onClick={onBuildProfile}
            >
              Build My Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InternshipBrowser;