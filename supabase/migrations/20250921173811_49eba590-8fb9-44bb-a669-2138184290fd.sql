-- Create internships table with comprehensive data
CREATE TABLE public.internships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL, -- remote, on-site, hybrid
  duration TEXT NOT NULL,
  stipend INTEGER,
  required_skills TEXT[] NOT NULL,
  preferred_skills TEXT[],
  application_deadline DATE,
  start_date DATE,
  is_active BOOLEAN DEFAULT true,
  category TEXT NOT NULL, -- tech, business, design, etc.
  difficulty_level TEXT NOT NULL, -- beginner, intermediate, advanced
  min_qualification TEXT NOT NULL,
  max_applications INTEGER DEFAULT 100,
  current_applications INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students/profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  education_level TEXT,
  institution TEXT,
  graduation_year INTEGER,
  gpa DECIMAL(3,2),
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  experience_level TEXT DEFAULT 'beginner',
  resume_text TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected, withdrawn
  match_score DECIMAL(5,2),
  ml_analysis JSONB,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, internship_id)
);

-- Create skills trending table for analytics
CREATE TABLE public.skill_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  demand_count INTEGER DEFAULT 0,
  trend_direction TEXT DEFAULT 'stable', -- rising, falling, stable
  category TEXT NOT NULL,
  month_year TEXT NOT NULL, -- format: YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(skill_name, month_year)
);

-- Create government analytics view table
CREATE TABLE public.analytics_dashboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_internships INTEGER DEFAULT 0,
  total_applications INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  placement_rate DECIMAL(5,2) DEFAULT 0,
  top_skills JSONB DEFAULT '[]',
  trending_skills JSONB DEFAULT '[]',
  skill_gaps JSONB DEFAULT '[]',
  industry_distribution JSONB DEFAULT '{}',
  location_distribution JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_dashboard ENABLE ROW LEVEL SECURITY;

-- Create policies for internships (public read, admin write)
CREATE POLICY "Anyone can view active internships" 
ON public.internships 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can view all internships" 
ON public.internships 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- Create policies for applications
CREATE POLICY "Users can manage their own applications" 
ON public.applications 
FOR ALL 
USING (student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create policies for analytics (read-only for authenticated users)
CREATE POLICY "Authenticated users can view skill trends" 
ON public.skill_trends 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view analytics dashboard" 
ON public.analytics_dashboard 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_internships_updated_at
BEFORE UPDATE ON public.internships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo internship data
INSERT INTO public.internships (title, company, description, location, type, duration, stipend, required_skills, preferred_skills, category, difficulty_level, min_qualification, application_deadline, start_date) VALUES
('Software Development Intern', 'TechCorp India', 'Work on full-stack web applications using React, Node.js, and MongoDB. Learn modern development practices and agile methodologies.', 'Bangalore', 'hybrid', '3 months', 25000, ARRAY['JavaScript', 'React', 'Node.js'], ARRAY['MongoDB', 'Git', 'AWS'], 'tech', 'beginner', 'Bachelor''s in Computer Science or related', '2024-12-31', '2025-01-15'),

('Data Science Intern', 'Analytics Pro', 'Analyze large datasets, build machine learning models, and create data visualizations using Python and R.', 'Mumbai', 'remote', '6 months', 30000, ARRAY['Python', 'Machine Learning', 'Statistics'], ARRAY['R', 'TensorFlow', 'SQL'], 'tech', 'intermediate', 'Bachelor''s in Data Science, Statistics, or Computer Science', '2024-12-25', '2025-02-01'),

('Digital Marketing Intern', 'Brand Builders', 'Create social media campaigns, analyze marketing metrics, and assist with content creation and SEO optimization.', 'Delhi', 'on-site', '4 months', 20000, ARRAY['Digital Marketing', 'Social Media', 'Content Writing'], ARRAY['SEO', 'Google Analytics', 'Adobe Creative Suite'], 'business', 'beginner', 'Bachelor''s in Marketing, Business, or Communications', '2024-12-20', '2025-01-20'),

('UI/UX Design Intern', 'Creative Studios', 'Design user interfaces and experiences for mobile and web applications using Figma and Adobe Creative Suite.', 'Pune', 'hybrid', '4 months', 22000, ARRAY['UI Design', 'UX Design', 'Figma'], ARRAY['Adobe XD', 'Prototyping', 'User Research'], 'design', 'beginner', 'Bachelor''s in Design, Fine Arts, or related', '2024-12-30', '2025-01-10'),

('Business Analyst Intern', 'ConsultPro', 'Analyze business processes, create reports, and assist with strategic planning and market research.', 'Chennai', 'on-site', '5 months', 28000, ARRAY['Business Analysis', 'Excel', 'Data Analysis'], ARRAY['SQL', 'PowerBI', 'Project Management'], 'business', 'intermediate', 'Bachelor''s in Business, Economics, or Engineering', '2024-12-28', '2025-02-05'),

('Cybersecurity Intern', 'SecureNet', 'Learn about network security, conduct vulnerability assessments, and assist with security audits.', 'Hyderabad', 'hybrid', '6 months', 35000, ARRAY['Cybersecurity', 'Network Security', 'Ethical Hacking'], ARRAY['Linux', 'Python', 'CISSP'], 'tech', 'advanced', 'Bachelor''s in Computer Science or Cybersecurity', '2024-12-15', '2025-01-25'),

('Content Writing Intern', 'Media House', 'Create engaging content for blogs, social media, and marketing materials. Research and write on various topics.', 'Remote', 'remote', '3 months', 18000, ARRAY['Content Writing', 'Research', 'SEO Writing'], ARRAY['WordPress', 'Canva', 'Social Media Management'], 'business', 'beginner', 'Bachelor''s in English, Journalism, or Communications', '2024-12-22', '2025-01-30'),

('Mobile App Development Intern', 'AppTech Solutions', 'Develop mobile applications for Android and iOS using React Native and Flutter frameworks.', 'Bangalore', 'on-site', '4 months', 32000, ARRAY['React Native', 'Flutter', 'Mobile Development'], ARRAY['Firebase', 'API Integration', 'Git'], 'tech', 'intermediate', 'Bachelor''s in Computer Science or Mobile Development', '2024-12-27', '2025-02-10'),

('Finance Intern', 'FinanceFirst', 'Assist with financial analysis, budget planning, and investment research. Learn about financial modeling and valuation.', 'Mumbai', 'hybrid', '5 months', 26000, ARRAY['Financial Analysis', 'Excel', 'Accounting'], ARRAY['Financial Modeling', 'Bloomberg', 'SQL'], 'business', 'intermediate', 'Bachelor''s in Finance, Accounting, or Economics', '2024-12-18', '2025-01-18'),

('AI/ML Research Intern', 'AI Innovations', 'Research and develop artificial intelligence and machine learning algorithms for real-world applications.', 'Bangalore', 'remote', '6 months', 40000, ARRAY['Machine Learning', 'Deep Learning', 'Python'], ARRAY['TensorFlow', 'PyTorch', 'Research'], 'tech', 'advanced', 'Master''s in Computer Science, AI, or related field', '2024-12-12', '2025-02-15');

-- Insert initial analytics data
INSERT INTO public.analytics_dashboard (total_internships, total_applications, total_students, placement_rate, top_skills, trending_skills, skill_gaps, industry_distribution, location_distribution) VALUES
(10, 0, 0, 0, 
'["JavaScript", "Python", "React", "Machine Learning", "Excel"]'::jsonb,
'[{"skill": "AI/ML", "growth": 45}, {"skill": "React", "growth": 32}, {"skill": "Python", "growth": 28}]'::jsonb,
'[{"skill": "Cloud Computing", "gap": 65}, {"skill": "DevOps", "gap": 58}, {"skill": "Blockchain", "gap": 72}]'::jsonb,
'{"tech": 50, "business": 30, "design": 20}'::jsonb,
'{"Bangalore": 30, "Mumbai": 25, "Delhi": 20, "Pune": 15, "Chennai": 10}'::jsonb
);

-- Insert trending skills data
INSERT INTO public.skill_trends (skill_name, demand_count, trend_direction, category, month_year) VALUES
('JavaScript', 85, 'rising', 'programming', '2024-12'),
('Python', 92, 'rising', 'programming', '2024-12'),
('React', 78, 'stable', 'frontend', '2024-12'),
('Machine Learning', 95, 'rising', 'ai', '2024-12'),
('Node.js', 67, 'stable', 'backend', '2024-12'),
('UI/UX Design', 73, 'rising', 'design', '2024-12'),
('Digital Marketing', 82, 'rising', 'marketing', '2024-12'),
('Data Analysis', 88, 'rising', 'analytics', '2024-12'),
('Cybersecurity', 91, 'rising', 'security', '2024-12'),
('Cloud Computing', 89, 'rising', 'infrastructure', '2024-12');