import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Briefcase, Target, Award, ArrowLeft, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface GovernmentDashboardProps {
  onBack: () => void;
}

const GovernmentDashboard = ({ onBack }: GovernmentDashboardProps) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [skillTrends, setSkillTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("current");

  useEffect(() => {
    fetchAnalytics();
    fetchSkillTrends();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_dashboard')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setAnalytics(data[0]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    }
  };

  const fetchSkillTrends = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_trends')
        .select('*')
        .eq('month_year', '2024-12')
        .order('demand_count', { ascending: false });

      if (error) throw error;
      setSkillTrends(data || []);
    } catch (error) {
      console.error('Error fetching skill trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAnalytics = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('update-analytics');
      if (response.error) throw response.error;
      
      await fetchAnalytics();
      toast({
        title: "Success",
        description: "Analytics updated successfully",
      });
    } catch (error) {
      console.error('Error updating analytics:', error);
      toast({
        title: "Error",
        description: "Failed to update analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const industryData = analytics?.industry_distribution ? 
    Object.entries(analytics.industry_distribution).map(([key, value]) => ({
      name: key,
      value: value as number
    })) : [];

  const locationData = analytics?.location_distribution ?
    Object.entries(analytics.location_distribution).map(([key, value]) => ({
      name: key,
      value: value as number
    })) : [];

  const skillGapData = analytics?.skill_gaps || [];
  const trendingSkillsData = analytics?.trending_skills || [];

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-4 animate-pulse"></div>
            <h3 className="text-xl font-semibold mb-2">Loading Dashboard</h3>
            <p className="text-muted-foreground">Fetching government analytics...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Government Analytics Dashboard</h1>
              <p className="text-muted-foreground">PM Internship Scheme Performance Metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={updateAnalytics} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Internships</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics?.total_internships || 0}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold text-green-600">{analytics?.total_applications || 0}</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registered Students</p>
                  <p className="text-3xl font-bold text-purple-600">{analytics?.total_students || 0}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+15% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Placement Rate</p>
                  <p className="text-3xl font-bold text-orange-600">{analytics?.placement_rate?.toFixed(1) || 0}%</p>
                </div>
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">-2% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Industry Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Location Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Location Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Gaps Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Skill Gaps</CardTitle>
              <p className="text-sm text-muted-foreground">
                Skills with highest demand-supply gap percentage
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGapData.slice(0, 5).map((skill: any, index: number) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{skill.skill}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${skill.gap}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-red-600">{skill.gap}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Skills</CardTitle>
              <p className="text-sm text-muted-foreground">
                Skills with highest growth in demand
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingSkillsData.slice(0, 5).map((skill: any, index: number) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{skill.skill}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+{skill.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Skill Trends */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Real-time Skill Demand Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              Live tracking of skill demand across all internship postings
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={skillTrends.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill_name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand_count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Skills Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Most In-Demand Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(analytics?.top_skills || []).map((skill: string, index: number) => (
                <Badge 
                  key={skill} 
                  variant={index < 3 ? "default" : "secondary"}
                  className={index < 3 ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
                >
                  {index < 3 && `#${index + 1} `}{skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernmentDashboard;