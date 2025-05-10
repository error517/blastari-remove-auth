import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import emailjs from '@emailjs/browser';

const Dashboard = () => {
  const { user } = useAuth();
  const websiteUrl = localStorage.getItem('analyzedWebsiteUrl') || '';
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExportForm, setShowExportForm] = useState(false);
  const [isEmailJsInitialized, setIsEmailJsInitialized] = useState(false);

  React.useEffect(() => {
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
  }, []);

  const handleExportToEmail = () => {
    setShowExportForm(true);
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
      const storedAnalysis = localStorage.getItem('websiteAnalysis');
      const storedRecommendations = localStorage.getItem('campaignRecommendations');
      
      if (!storedAnalysis || !storedRecommendations) {
        throw new Error('No analysis data available');
      }

      const analysis = JSON.parse(storedAnalysis);
      const recommendations = JSON.parse(storedRecommendations);
      
      const emailContent = generateEmailContent(analysis, recommendations);
      
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
      setShowExportForm(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateEmailContent = (analysis: any, recommendations: any[]) => {
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
        ${analysis.strengths.map((s: string) => `<li>${s}</li>`).join('\n')}
      </ul>

      <h3>Constraints:</h3>
      <ul>
        ${analysis.constraints.map((c: string) => `<li>${c}</li>`).join('\n')}
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
            ${rec.insights.map((insight: string) => `<li>${insight}</li>`).join('\n')}
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Blastari Campaign Dashboard</h1>
        <p className="text-muted-foreground">
          Launch high-performing ad campaigns with AI-powered recommendations
        </p>
      </div>

      {websiteUrl ? (
        <>
          <WebsiteAnalyzer url={websiteUrl} />
          
          <div className="flex justify-center">
            {!showExportForm ? (
              <Button 
                onClick={() => {
                  toast.success("Campaign details sent to your email!");
                }}
                size="lg"
                className="gap-2"
                disabled
              >
                <Mail className="h-5 w-5" />
                Export to Email
              </Button>
            ) : (
              <Card className="w-full max-w-xl">
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
                        disabled={isSubmitting || !isEmailJsInitialized} 
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
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Please enter a website URL on the landing page to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;