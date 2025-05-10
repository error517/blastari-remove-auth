import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Share2, 
  Download, 
  Check,
  BarChart3,
  Target,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Lightbulb,
  LineChart,
  LinkIcon,
  Send
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { analyzeWebsite, generateMarketingStrategy } from '@/lib/websiteAnalyzer';
import { MarketingStrategy as MarketingStrategyType, WebsiteAnalysis } from '@/lib/websiteAnalyzer';
import LoadingAnimation from '@/components/LoadingAnimation';
import emailjs from '@emailjs/browser';

const MarketingStrategy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [strategy, setStrategy] = useState<MarketingStrategyType | null>(null);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    overview: true,
    strategy: true,
    tactics: true,
    content: true,
    timeline: true,
    budget: true,
    metrics: true
  });
  const [isEmailJsInitialized, setIsEmailJsInitialized] = useState(false);
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get('url');
    
    if (!url) {
      navigate('/');
      return;
    }
    
    // Initialize EmailJS
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      try {
        emailjs.init(publicKey);
        setIsEmailJsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
      }
    }

    // Check for existing analysis in localStorage
    const cachedAnalysis = localStorage.getItem(`analysis_${url}`);
    const cachedStrategy = localStorage.getItem(`strategy_${url}`);
    
    if (cachedAnalysis && cachedStrategy) {
      try {
        setAnalysis(JSON.parse(cachedAnalysis));
        setStrategy(JSON.parse(cachedStrategy));
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing cached data:', error);
        generateNewStrategy(url);
      }
    } else {
      generateNewStrategy(url);
    }
  }, [location.search, navigate]);
  
  const generateNewStrategy = async (url: string) => {
    setIsLoading(true);
    try {
      // Step 1: Analyze the website
      const { analysis: newAnalysis } = await analyzeWebsite(url);
      setAnalysis(newAnalysis);
      
      // Step 2: Generate the marketing strategy
      const newStrategy = await generateMarketingStrategy(newAnalysis);
      setStrategy(newStrategy);
      
      // Cache the results
      localStorage.setItem(`analysis_${url}`, JSON.stringify(newAnalysis));
      localStorage.setItem(`strategy_${url}`, JSON.stringify(newStrategy));
      localStorage.setItem('analyzedWebsiteUrl', url);
      
      toast.success('Marketing strategy generated successfully');
    } catch (error) {
      console.error('Error generating marketing strategy:', error);
      toast.error('Failed to generate marketing strategy');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!isEmailJsInitialized) {
      toast.error('Email service is not properly configured');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Format the strategy content for email
      const url = new URLSearchParams(location.search).get('url') || '';
      const emailContent = formatStrategyForEmail(strategy, analysis, url);
      
      const templateParams = {
        to_email: email,
        subject: `Marketing Strategy for ${url}`,
        content: emailContent,
      };
      
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
      );
      
      toast.success('Marketing strategy sent to your email');
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };
  
  const formatStrategyForEmail = (
    strategy: MarketingStrategyType | null, 
    analysis: WebsiteAnalysis | null,
    url: string
  ): string => {
    if (!strategy || !analysis) return '';
    
    return `
# Marketing Strategy for ${url}

## Company Overview
${strategy.companyOverview}

## Value Proposition
${strategy.valueProposition}

## Target Audience
${strategy.targetAudience.description}

Segments:
${strategy.targetAudience.segments.map(segment => `- ${segment}`).join('\n')}

## Strategic Objectives
${strategy.strategicObjectives.map(objective => `- ${objective}`).join('\n')}

## Key Marketing Goals
Short-term goals:
${strategy.keyMarketingGoals.shortTerm.map(goal => `- ${goal}`).join('\n')}

Long-term goals:
${strategy.keyMarketingGoals.longTerm.map(goal => `- ${goal}`).join('\n')}

## Recommended Channels
${strategy.recommendedChannels.map(channel => 
  `### ${channel.name} (Priority: ${channel.priority}, ROI: ${channel.estimatedROI})
${channel.description}`).join('\n\n')}

## Budget Recommendation
Total Budget: ${strategy.budgetRecommendation.totalBudget}

Breakdown:
${strategy.budgetRecommendation.breakdown.map(item => 
  `- ${item.category} (${item.allocation}): ${item.description}`
).join('\n')}

## Key Metrics
${strategy.keyMetrics.map(metric => 
  `- ${metric.metric}: Target ${metric.target}, measured via ${metric.measurementMethod}`
).join('\n')}

Generated by Blastari Marketing Strategy Generator
    `;
  };
  
  if (isLoading) {
    return <LoadingAnimation />;
  }
  
  if (!strategy || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to generate marketing strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              We couldn't generate a marketing strategy. Please try again with a different URL.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Your Professional Marketing Strategy
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on the analysis of your website, we've created a comprehensive marketing strategy to help you achieve your business goals.
          </p>
        </div>
        
        {/* Email Capture Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Get Your Strategy by Email
            </CardTitle>
            <CardDescription>
              Receive your complete marketing strategy in your inbox for easy reference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendEmail} className="flex gap-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending || emailSent}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isSending || emailSent || !isEmailJsInitialized}
              >
                {emailSent ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Sent
                  </>
                ) : isSending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Strategy
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Company Overview Section */}
        <div className="space-y-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('overview')}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <BarChart3 className="mr-2 h-6 w-6" />
              Company Overview
            </h2>
            {expandedSections.overview ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
          
          {expandedSections.overview && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">Company Snapshot</h3>
                      <p className="text-muted-foreground">{strategy.companyOverview}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">Value Proposition</h3>
                      <p className="text-muted-foreground">{strategy.valueProposition}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">Target Audience</h3>
                      <p className="text-muted-foreground mb-2">{strategy.targetAudience.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {strategy.targetAudience.segments.map((segment, index) => (
                          <Badge key={index} variant="outline">{segment}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">Industry Insights</h3>
                      <ul className="list-disc list-inside text-muted-foreground pl-2">
                        {strategy.industryInsights.map((insight, index) => (
                          <li key={index} className="mt-1">{insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Strategy Section */}
        <div className="space-y-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('strategy')}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <Target className="mr-2 h-6 w-6" />
              Strategic Foundation
            </h2>
            {expandedSections.strategy ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
          
          {expandedSections.strategy && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg">Strategic Objectives</h3>
                      <ul className="list-disc list-inside text-muted-foreground pl-2">
                        {strategy.strategicObjectives.map((objective, index) => (
                          <li key={index} className="mt-1">{objective}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">Key Marketing Goals</h3>
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <h4 className="font-medium">Short-Term (3-6 months)</h4>
                          <ul className="list-disc list-inside text-muted-foreground pl-2">
                            {strategy.keyMarketingGoals.shortTerm.map((goal, index) => (
                              <li key={index}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Long-Term (6-18 months)</h4>
                          <ul className="list-disc list-inside text-muted-foreground pl-2">
                            {strategy.keyMarketingGoals.longTerm.map((goal, index) => (
                              <li key={index}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">Positioning Strategy</h3>
                      <p className="text-muted-foreground">{strategy.positioning}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Tactics Section */}
        <div className="space-y-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('tactics')}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Tactical Approach
            </h2>
            {expandedSections.tactics ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
          
          {expandedSections.tactics && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {strategy.recommendedChannels.map((channel, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge 
                            variant={
                              channel.priority === "High" ? "destructive" : 
                              channel.priority === "Medium" ? "default" : 
                              "secondary"
                            }
                          >
                            {channel.priority} Priority
                          </Badge>
                          <Badge variant="outline">ROI: {channel.estimatedROI}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{channel.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Content Strategy Section */}
        <div className="space-y-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('content')}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <Lightbulb className="mr-2 h-6 w-6" />
              Content Strategy
            </h2>
            {expandedSections.content ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
          
          {expandedSections.content && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg">Content Pillars</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {strategy.contentPillars.map((pillar, index) => (
                          <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                            {pillar}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">Content Ideas</h3>
                      <div className="grid sm:grid-cols-2 gap-2 mt-2">
                        {strategy.contentIdeas.map((idea, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                              <LinkIcon className="h-3 w-3" />
                            </div>
                            <span className="text-muted-foreground text-sm">{idea}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Timeline Section */}
        <div className="space-y-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('timeline')}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <Calendar className="mr-2 h-6 w-6" />
              Implementation Timeline
            </h2>
            {expandedSections.timeline ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
          
          {expandedSections.timeline && (
            <div className="space-y-4">
              <div className="space-y-6">
                {strategy.timeline.map((phase, phaseIndex) => (
                  <Card key={phaseIndex}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {phase.phase} ({phase.duration})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-muted-foreground pl-2">
                        {phase.activities.map((activity, activityIndex) => (
                          <li key={activityIndex} className="mt-1">{activity}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Budget Section */}
        <div className="space-y-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('budget')}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <DollarSign className="mr-2 h-6 w-6" />
              Budget Allocation
            </h2>
            {expandedSections.budget ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
          
          {expandedSections.budget && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Recommended Budget: {strategy.budgetRecommendation.totalBudget}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategy.budgetRecommendation.breakdown.map((item, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.category}</span>
                          <Badge variant="outline">{item.allocation}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {index < strategy.budgetRecommendation.breakdown.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Metrics Section */}
        <div className="space-y-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('metrics')}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <LineChart className="mr-2 h-6 w-6" />
              Success Metrics
            </h2>
            {expandedSections.metrics ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
          
          {expandedSections.metrics && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {strategy.keyMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold">{metric.metric}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Target</Badge>
                          <span className="text-sm text-muted-foreground">{metric.target}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Measurement</Badge>
                          <span className="text-sm text-muted-foreground">{metric.measurementMethod}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            This marketing strategy was generated based on automated analysis of your website.
            For a more tailored approach, consider working with a marketing professional.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Analyze Another Website
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending || emailSent || !isEmailJsInitialized}>
              {emailSent ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Sent to Email
                </>
              ) : isSending ? (
                'Sending...'
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Email This Strategy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingStrategy;