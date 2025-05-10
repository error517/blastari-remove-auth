
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";
import MarketingProfileForm from "./MarketingProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [validatedUrl, setValidatedUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a website URL");
      return;
    }
    
    // Simple URL validation
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith("http")) {
        throw new Error("Invalid URL");
      }
      
      setValidatedUrl(url);
      setShowProfileForm(true);
      
      // For now, we'll use test data and skip the form for simplicity
      // In a production app, we'd show the form and wait for user input
      // Just send the URL directly to onAnalyze for this demo
      onAnalyze(url);
    } catch (error) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  const handleProfileSubmit = async (profileData: any) => {
    // In a production app, we would store the profile data in Supabase here
    if (user) {
      try {
        // Create a test marketing profile (this would normally come from the form)
        const testMarketingProfile = {
          productOverview: "An AI-powered marketing campaign recommendation tool",
          coreValueProposition: "Save time and increase ROI with AI-generated marketing campaigns",
          targetAudience: {
            type: "Business",
            segments: ["Marketers", "Startups", "SMBs"]
          },
          currentAwareness: "MVP live",
          goal: ["Awareness", "Signups", "Revenue"],
          budget: "$1,000",
          strengths: ["AI technology", "User-friendly interface", "Actionable recommendations"],
          constraints: ["Limited brand awareness", "Competitive market"],
          preferredChannels: ["Content marketing", "Social ads", "Email marketing"],
          toneAndPersonality: "Professional, helpful, innovative"
        };
        
        // Update user profile with website URL and marketing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            updated_at: new Date().toISOString(),
            username: user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
            website_url: validatedUrl,
            marketing_profile: testMarketingProfile
          })
          .eq('id', user.id);
        
        if (error) {
          console.error("Error storing profile data:", error);
          toast.error("Failed to save profile data");
        } else {
          toast.success("Profile data saved successfully");
        }
      } catch (error) {
        console.error("Error storing profile data:", error);
        toast.error("Failed to save profile data");
      }
    }
    
    // Pass the URL to the parent component to generate recommendations
    onAnalyze(validatedUrl);
  };

  return (
    <>
      {!showProfileForm ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Start Your Ad Campaign</CardTitle>
            <CardDescription>
              Enter your website URL to get AI-powered campaign recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex-1">
                <Input
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Analyze Website
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <MarketingProfileForm 
          websiteUrl={validatedUrl}
          onSubmit={handleProfileSubmit}
          isSubmitting={isAnalyzing}
        />
      )}
    </>
  );
};

export default UrlInput;
