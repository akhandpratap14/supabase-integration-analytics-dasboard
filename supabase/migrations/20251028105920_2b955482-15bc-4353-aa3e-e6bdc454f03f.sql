-- Create table for storing user analytics data
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  chart_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own data by email
CREATE POLICY "Users can view their own analytics data" 
ON public.user_analytics 
FOR SELECT 
USING (true);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert their own analytics data" 
ON public.user_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own analytics data" 
ON public.user_analytics 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_analytics_updated_at
BEFORE UPDATE ON public.user_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();