import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RecommendationProps {
  id: string;
  title: string;
  platform: string;
  description: string;
  insights: string[];
  roi: string;
  difficulty: "Easy" | "Medium" | "Hard";
  budget: string;
  website_url: string;
}

const CampaignRecommendation: React.FC<RecommendationProps> = ({
  id,
  title,
  platform,
  description,
  insights,
  roi,
  difficulty,
  budget,
  website_url,
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const storeRecommendation = async () => {
      try {
        // First check if this recommendation already exists
        const { data: existingRec, error: fetchError } = await supabase
          .from('campaign_recommendations')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking existing recommendation:', fetchError);
          return;
        }

        if (existingRec) {
          console.log('Recommendation already exists:', existingRec);
          return;
        }

        // Store the recommendation
        const { error: insertError } = await supabase
          .from('campaign_recommendations')
          .insert({
            id,
            website_url,
            title,
            platform,
            description,
            insights,
            roi,
            difficulty,
            budget
          });

        if (insertError) {
          console.error('Error storing recommendation:', insertError);
          toast.error(`Failed to store recommendation: ${insertError.message}`);
        } else {
          console.log('Recommendation stored successfully');
        }
      } catch (err) {
        console.error('Error in storeRecommendation:', err);
      }
    };

    storeRecommendation();
  }, [id, website_url, title, platform, description, insights, roi, difficulty, budget]);

  // Map difficulty to color
  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }[difficulty];

  return (
    <Card className="w-full h-full animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary">{platform}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-1">AI Insights:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {insights.map((insight, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {insight}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
            ROI: {roi}
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${difficultyColor}`}>
            {difficulty}
          </div>
          <div className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs">
            Budget: {budget}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/campaigns/launch/${id}`)}
        >
          Launch Campaign <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignRecommendation;
