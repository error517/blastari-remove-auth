import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, Clock, DollarSign, ExternalLink, Lightbulb, Target } from "lucide-react";
import AdPreview from "@/components/campaigns/AdPreview";
import { toast } from "sonner";
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";

const CampaignLaunch = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);
  const websiteUrl = localStorage.getItem('analyzedWebsiteUrl') || '';

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      // Demo data based on campaign ID
      const campaignData = {
        id,
        title: id === "1" ? "Product Showcase Campaign" : 
               id === "2" ? "Social Media Awareness" : 
               id === "3" ? "Short-Form Video Engagement" : 
               "Remarketing Campaign",
        platform: id === "1" ? "Google Ads" : 
                  id === "2" ? "Instagram" : 
                  id === "3" ? "TikTok" : 
                  "Facebook",
        description: "AI-generated campaign based on your website analysis.",
        objective: "Increase brand awareness and drive conversions",
        audience: "People aged 25-45 interested in your product category",
        budget: "$500-1000 per month",
        duration: "30 days",
        adPreviews: [
          {
            platform: id === "1" ? "Google" : 
                     id === "2" ? "Instagram" : 
                     id === "3" ? "TikTok" : 
                     "Facebook",
            type: id === "1" ? "Search Ad" : 
                 id === "2" ? "Feed Post" : 
                 id === "3" ? "Short Video" : 
                 "Carousel Ad",
            imageSrc: `https://placehold.co/600x400/e2e8f0/64748b?text=Ad+Preview+${id}`,
            title: "Your Ad Preview",
            description: "This is how your ad will look on the selected platform."
          },
          {
            platform: id === "1" ? "Google" : 
                     id === "2" ? "Instagram" : 
                     id === "3" ? "TikTok" : 
                     "Facebook",
            type: id === "1" ? "Display Ad" : 
                 id === "2" ? "Story" : 
                 id === "3" ? "Short Video (Alt)" : 
                 "Banner Ad",
            imageSrc: `https://placehold.co/600x400/e2e8f0/64748b?text=Alt+Preview+${id}`,
            title: "Alternative Format",
            description: "Another ad format option for your campaign."
          }
        ]
      };
      
      setCampaign(campaignData);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleLaunch = () => {
    toast.success("Campaign launched successfully! You'll receive analytics soon.");
    setTimeout(() => navigate("/"), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Loading campaign details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <Badge variant="outline" className="text-sm py-1">
          Campaign ID: {id}
        </Badge>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{campaign.title}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{campaign.platform}</Badge>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Preview</CardTitle>
              <CardDescription>
                Here's how your ads will appear on {campaign?.platform}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="previews" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="previews">Ad Previews</TabsTrigger>
                  <TabsTrigger value="details">Campaign Details</TabsTrigger>
                  <TabsTrigger value="analyzer">Website Analyzer</TabsTrigger>
                </TabsList>
                <TabsContent value="previews" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaign.adPreviews.map((preview: any, index: number) => (
                      <AdPreview
                        key={index}
                        platform={preview.platform}
                        type={preview.type}
                        imageSrc={preview.imageSrc}
                        title={preview.title}
                        description={preview.description}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Campaign Objective</h3>
                        <p className="text-sm text-muted-foreground">{campaign.objective}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M18 21a8 8 0 0 0-16 0" />
                          <circle cx="10" cy="8" r="5" />
                          <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Target Audience</h3>
                        <p className="text-sm text-muted-foreground">{campaign.audience}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Budget</h3>
                        <p className="text-sm text-muted-foreground">{campaign.budget}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Duration</h3>
                        <p className="text-sm text-muted-foreground">{campaign.duration}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="analyzer">
                  <WebsiteAnalyzer url={websiteUrl} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Campaign Setup</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Content Ready</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Audience Targeting</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Budget Allocation</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="flex items-start gap-3 mt-6">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-sm">
                  <h3 className="font-medium">AI Recommendation</h3>
                  <p className="text-muted-foreground">
                    Based on your website analysis, this campaign is ready to launch and 
                    expected to generate a positive ROI.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLaunch} className="w-full">
                Launch Campaign <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Campaign objective defined</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Target audience selected</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Ad creative generated</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Budget and schedule set</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Platform optimizations applied</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignLaunch;
