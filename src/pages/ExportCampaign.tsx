import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import { 
  Mail, 
  BarChart3, 
  Globe, 
  Lightbulb, 
  Rocket, 
  FileSpreadsheet, 
  PenTool,
  BarChart4,
  Share2,
  CheckCircle2
} from "lucide-react";

interface WebsiteAnalysis {
  productOverview: string;
  coreValueProposition: string;
  targetAudience: {
    type: "Consumers" | "Business" | "Government";
    segments: string[];
  };
  currentAwareness: string;
  goal: string[];
  budget: string;
  strengths: string[];
  constraints: string[];
  preferredChannels: string[];
  toneAndPersonality: string;
}

interface CampaignRecommendation {
  id: string;
  title: string;
  platform: string;
  description: string;
  insights: string[];
  roi: string;
  difficulty: "Easy" | "Medium" | "Hard";
  budget: string;
}

const ExportCampaign = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<CampaignRecommendation[]>([]);
  const [isEmailJsInitialized, setIsEmailJsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize EmailJS with your public key
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!publicKey) {
      console.error('EmailJS public key is not configured');
      toast.error('Email service is not properly configured');
      return;
    }

    try {
      emailjs.init(publicKey);
      setIsEmailJsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      toast.error('Failed to initialize email service');
    }
    
    // Retrieve stored data
    try {
      const storedAnalysis = localStorage.getItem('websiteAnalysis');
    const storedRecommendations = localStorage.getItem('campaignRecommendations');
    const storedUrl = localStorage.getItem('analyzedWebsiteUrl');
    
      if (storedAnalysis) {
        setAnalysis(JSON.parse(storedAnalysis));
      }
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    }
    if (storedUrl) {
      setWebsiteUrl(storedUrl);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      toast.error('Failed to load saved analysis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateEmailContent = () => {
    if (!analysis || !recommendations.length) return '';

    const implementationSteps = recommendations.map((rec, index) => `
      ${index + 1}. ${rec.title} (${rec.platform})
         - Budget: ${rec.budget}
         - Difficulty: ${rec.difficulty}
         - Expected ROI: ${rec.roi}
         - Implementation Steps:
           a. Set up ${rec.platform} account if not already done
           b. Create campaign following platform guidelines
           c. Implement targeting based on insights
           d. Set budget and schedule
           e. Launch and monitor performance
    `).join('\n\n');

    return `
      <h1>Website Analysis Report for ${websiteUrl}</h1>

      <h2>OVERVIEW</h2>
      <p><strong>Product Overview:</strong> ${analysis.productOverview}</p>
      <p><strong>Core Value Proposition:</strong> ${analysis.coreValueProposition}</p>

      <h2>TARGET AUDIENCE</h2>
      <p><strong>Type:</strong> ${analysis.targetAudience.type}</p>
      <p><strong>Segments:</strong> ${analysis.targetAudience.segments.join(', ')}</p>

      <h2>CURRENT STATUS</h2>
      <p><strong>Awareness Stage:</strong> ${analysis.currentAwareness}</p>
      <p><strong>Goals:</strong> ${analysis.goal.join(', ')}</p>
      <p><strong>Budget:</strong> ${analysis.budget}</p>

      <h2>STRENGTHS & CONSTRAINTS</h2>
      <h3>Strengths:</h3>
      <ul>
        ${analysis.strengths.map(s => `<li>${s}</li>`).join('\n')}
      </ul>

      <h3>Constraints:</h3>
      <ul>
        ${analysis.constraints.map(c => `<li>${c}</li>`).join('\n')}
      </ul>

      <h2>MARKETING APPROACH</h2>
      <p><strong>Preferred Channels:</strong> ${analysis.preferredChannels.join(', ')}</p>
      <p><strong>Tone and Personality:</strong> ${analysis.toneAndPersonality}</p>

      <h2>RECOMMENDED CAMPAIGNS</h2>
      ${recommendations.map(rec => `
        <div style="margin-bottom: 20px;">
          <h3>${rec.title}</h3>
          <p><strong>Platform:</strong> ${rec.platform}</p>
          <p><strong>Description:</strong> ${rec.description}</p>
          <h4>Key Insights:</h4>
          <ul>
            ${rec.insights.map(insight => `<li>${insight}</li>`).join('\n')}
          </ul>
          <p><strong>ROI:</strong> ${rec.roi}</p>
          <p><strong>Difficulty:</strong> ${rec.difficulty}</p>
          <p><strong>Budget:</strong> ${rec.budget}</p>
        </div>
      `).join('\n')}

      <h2>IMPLEMENTATION GUIDE</h2>
      ${implementationSteps}

      <h2>NEXT STEPS</h2>
      <ol>
        <li>Review the analysis and recommendations</li>
        <li>Prioritize campaigns based on your goals and resources</li>
        <li>Start with the highest ROI, lowest difficulty campaigns</li>
        <li>Set up tracking and analytics</li>
        <li>Monitor and optimize performance</li>
      </ol>

      <p>Need help implementing these campaigns? Contact our support team for assistance.</p>
    `;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailJsInitialized) {
      toast.error('Email service is not properly configured');
      return;
    }
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const emailContent = generateEmailContent();
      
      const templateParams = {
        to_email: email,
        message: emailContent,
        website_url: websiteUrl,
      };

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

      if (!serviceId || !templateId) {
        throw new Error('Email service configuration is incomplete');
      }

      await emailjs.send(serviceId, templateId, templateParams);
    toast.success("Campaign details sent to your email!");
    setEmail("");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define feature cards for the 3x3 grid
  const featureCards = [
    {
      title: "Website Analysis",
      description: "AI-powered analysis of your website content and structure",
      icon: <Globe className="h-10 w-10 text-primary/80" />,
      isActive: true,
    },
    {
      title: "Campaign Launch",
      description: "One-click campaign launch across platforms",
      icon: <Rocket className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time performance tracking",
      icon: <BarChart3 className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Content Creation",
      description: "AI-generated ad creative and messaging",
      icon: <PenTool className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Audience Targeting",
      description: "Precision audience segmentation",
      icon: <BarChart4 className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Budget Optimization",
      description: "Smart budget allocation across channels",
      icon: <FileSpreadsheet className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Multi-Channel Campaigns",
      description: "Unified campaigns across all platforms",
      icon: <Share2 className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Campaign Templates",
      description: "Ready-to-use campaign templates",
      icon: <FileSpreadsheet className="h-10 w-10 text-gray-400" />,
      isActive: false,
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Loading your campaign data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Export Your Campaign</h1>
      
      {/* Active Features - Website Analysis */}
      {analysis && recommendations.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Website Analysis
            </CardTitle>
            <CardDescription>
              We've analyzed {websiteUrl || "your website"} and generated tailored campaign recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our AI has examined your website's structure, content, and target audience to create
              custom campaign recommendations designed to maximize your marketing ROI.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Feature Grid - 3x3 layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {featureCards?.map((feature, index) => (
          <Card 
            key={index} 
            className={`transition-all ${
              feature.isActive ? "bg-white" : "bg-muted/50"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                {feature.icon}
                {!feature.isActive && (
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    Coming Soon
                  </span>
                )}
              </div>
              <CardTitle className="mt-2">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      {/* Email subscription form */}
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Get Your Campaign Details
          </CardTitle>
          <CardDescription>
            Enter your email to receive a detailed report of your campaign recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting || !isEmailJsInitialized || !analysis || !recommendations.length} 
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send to Email
                  </>
                )}
              </Button>
            </div>
            {!isEmailJsInitialized && (
              <p className="text-sm text-red-500">
                Email service is not properly configured. Please check your environment variables.
              </p>
            )}
            {!analysis && (
              <p className="text-sm text-yellow-500">
                No analysis data available. Please analyze a website first.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportCampaign;
