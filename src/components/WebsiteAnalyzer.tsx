import { useState, useEffect } from 'react';
import { analyzeWebsite, generateAllCampaigns } from '@/lib/websiteAnalyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import LoadingAnimation from '@/components/LoadingAnimation';

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

interface WebsiteAnalyzerProps {
  url: string;
}

const getDifficultyColor = (difficulty: "Easy" | "Medium" | "Hard") => {
  switch (difficulty) {
    case "Easy":
      return "border-green-500 bg-green-50";
    case "Medium":
      return "border-yellow-500 bg-yellow-50";
    case "Hard":
      return "border-red-500 bg-red-50";
    default:
      return "";
  }
};

const getRoiColor = (roi: string | undefined) => {
  if (!roi) return "text-gray-600";
  const roiValue = parseFloat(roi);
  if (isNaN(roiValue)) return "text-gray-600";
  if (roiValue >= 5) return "text-green-600";
  if (roiValue >= 3) return "text-yellow-600";
  return "text-red-600";
};

const getBudgetColor = (budget: string | undefined) => {
  if (!budget) return "text-gray-600";
  const budgetValue = parseInt(budget.replace(/[^0-9]/g, '') || '0');
  if (isNaN(budgetValue)) return "text-gray-600";
  if (budgetValue <= 500) return "text-green-600";
  if (budgetValue <= 1500) return "text-yellow-600";
  return "text-red-600";
};

const BUDGET_RANGES = [
  { min: 0, max: 1000, label: "Startup ($0-1k)" },
  { min: 1000, max: 5000, label: "Growth ($1k-5k)" },
  { min: 5000, max: 20000, label: "Scale ($5k-20k)" },
  { min: 20000, max: 50000, label: "Enterprise ($20k-50k)" },
];

const formatBudget = (amount: number) => {
  if (isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function WebsiteAnalyzer({ url }: WebsiteAnalyzerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<CampaignRecommendation[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(5000); // Default to $5k
  const [tempBudget, setTempBudget] = useState(5000); // For slider value
  const [error, setError] = useState<string | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  useEffect(() => {
    if (url) {
      handleAnalyze();
    }
  }, [url]);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setIsAnalysisComplete(false);
    setError(null);
    try {
      console.log('Checking if website analysis exists for:', url);
      
      // First check if the URL exists in the database
      const { data: existingAnalysis, error: fetchError } = await supabase
        .from('website_analyses')
        .select('*')
        .eq('website_url', url)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error checking existing analysis:', fetchError);
        toast.error('Failed to check existing analysis');
        return;
      }

      if (existingAnalysis) {
        console.log('Found existing analysis:', existingAnalysis);
        
        // Get existing recommendations
        const { data: existingRecommendations, error: recommendationsError } = await supabase
          .from('campaign_recommendations')
          .select('*')
          .eq('website_url', url);

        if (recommendationsError) {
          console.error('Error fetching existing recommendations:', recommendationsError);
          toast.error('Failed to fetch existing recommendations');
          return;
        }

        // Convert database format to component format
        const analysis: WebsiteAnalysis = {
          productOverview: existingAnalysis.product_overview,
          coreValueProposition: existingAnalysis.core_value_proposition,
          targetAudience: {
            type: existingAnalysis.target_audience_type as "Consumers" | "Business" | "Government",
            segments: existingAnalysis.target_audience_segments
          },
          currentAwareness: existingAnalysis.current_stage,
          goal: existingAnalysis.goals,
          budget: existingAnalysis.suggested_budget,
          strengths: existingAnalysis.strengths,
          constraints: existingAnalysis.constraints,
          preferredChannels: existingAnalysis.preferred_channels,
          toneAndPersonality: existingAnalysis.tone_and_personality
        };

        const recommendations: CampaignRecommendation[] = existingRecommendations.map(rec => ({
          id: rec.id,
          title: rec.title,
          platform: rec.platform,
          description: rec.description,
          insights: rec.insights,
          roi: rec.roi,
          difficulty: rec.difficulty as "Easy" | "Medium" | "Hard",
          budget: rec.budget
        }));

        setAnalysis(analysis);
        setRecommendations(recommendations);
        setSelectedBudget(parseInt(analysis.budget.replace(/[^0-9]/g, '')));
        setTempBudget(parseInt(analysis.budget.replace(/[^0-9]/g, '')));
        setShowAll(false);
        toast.success('Loaded existing analysis and recommendations');
        setIsAnalysisComplete(true);
        return;
      }

      // If no existing analysis, proceed with Gemini analysis
      console.log('No existing analysis found, proceeding with Gemini analysis');
      const { analysis: newAnalysis, recommendations: newRecommendations } = await analyzeWebsite(url);
      console.log('Analysis received:', newAnalysis);
      console.log('Recommendations received:', newRecommendations);

      setAnalysis(newAnalysis);
      setRecommendations(newRecommendations);
      setSelectedBudget(parseInt(newAnalysis.budget.replace(/[^0-9]/g, '')));
      setTempBudget(parseInt(newAnalysis.budget.replace(/[^0-9]/g, '')));
      setShowAll(false);

      // Store website analysis in Supabase
      console.log('Attempting to store website analysis...');
      const analysisData = {
        website_url: url,
        product_overview: newAnalysis.productOverview,
        core_value_proposition: newAnalysis.coreValueProposition,
        target_audience_type: newAnalysis.targetAudience.type,
        target_audience_segments: newAnalysis.targetAudience.segments,
        current_stage: newAnalysis.currentAwareness,
        goals: newAnalysis.goal,
        suggested_budget: newAnalysis.budget,
        strengths: newAnalysis.strengths,
        constraints: newAnalysis.constraints,
        preferred_channels: newAnalysis.preferredChannels,
        tone_and_personality: newAnalysis.toneAndPersonality
      };
      console.log('Analysis data to be stored:', analysisData);

      const { data: analysisResult, error: analysisError } = await supabase
        .from('website_analyses')
        .insert(analysisData)
        .select();

      if (analysisError) {
        console.error('Error storing website analysis:', analysisError);
        toast.error(`Failed to store website analysis: ${analysisError.message}`);
      } else {
        console.log('Website analysis stored successfully:', analysisResult);
      }

      // Store new recommendations in Supabase
      console.log('Storing new recommendations...');
      console.log('New recommendations to store:', JSON.stringify(newRecommendations, null, 2));

      try {
        const recommendationsToInsert = newRecommendations.map(rec => ({
          website_url: url,
          title: rec.title || '',
          platform: rec.platform || '',
          description: rec.description || '',
          insights: Array.isArray(rec.insights) ? rec.insights : [],
          roi: rec.roi || '',
          difficulty: rec.difficulty || 'Medium',
          budget: rec.budget || ''
        }));

        console.log('Formatted recommendations for insertion:', JSON.stringify(recommendationsToInsert, null, 2));

        const { data: recommendationsResult, error: insertError } = await supabase
          .from('campaign_recommendations')
          .insert(recommendationsToInsert)
          .select();

        if (insertError) {
          console.error('Error storing recommendations:', insertError);
          console.error('Error details:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          });
          toast.error(`Failed to store recommendations: ${insertError.message}`);
        } else {
          console.log('Successfully stored recommendations:', recommendationsResult);
          toast.success(`Stored ${newRecommendations.length} recommendations`);
        }
      } catch (err) {
        console.error('Error in recommendation storage process:', err);
        toast.error('Failed to store recommendations');
      }

      toast.success('Website analyzed successfully');
      setIsAnalysisComplete(true);
    } catch (err) {
      console.error('Error analyzing website:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze website');
      toast.error('Failed to analyze website');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetChange = (value: number[]) => {
    setTempBudget(value[0]);
  };

  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''));
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, 0), 50000);
      setTempBudget(clampedValue);
    }
  };

  const handleUpdateCampaigns = async () => {
    if (!analysis) return;
    
    setSelectedBudget(tempBudget);
    setIsLoading(true);
    try {
      const allRecommendations = await generateAllCampaigns(analysis, tempBudget);
      setRecommendations(allRecommendations);
      setShowAll(true);
      toast.success('Campaigns updated for new budget');
    } catch (error) {
      console.error('Error generating campaigns:', error);
      toast.error('Failed to update campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAll = async () => {
    if (!analysis) return;

    setIsLoading(true);
    try {
      const allRecommendations = await generateAllCampaigns(analysis, selectedBudget);
      setRecommendations(allRecommendations);
      setShowAll(true);
    } catch (error) {
      console.error('Error generating all campaigns:', error);
      toast.error('Failed to generate all campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowLess = () => {
    setShowAll(false);
    setRecommendations(recommendations.slice(0, 3));
  };

  const handleForceReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      // Delete existing analysis and recommendations
      const { error: deleteAnalysisError } = await supabase
        .from('website_analyses')
        .delete()
        .eq('website_url', url);

      if (deleteAnalysisError) {
        console.error('Error deleting existing analysis:', deleteAnalysisError);
        toast.error('Failed to delete existing analysis');
        return;
      }

      const { error: deleteRecommendationsError } = await supabase
        .from('campaign_recommendations')
        .delete()
        .eq('website_url', url);

      if (deleteRecommendationsError) {
        console.error('Error deleting existing recommendations:', deleteRecommendationsError);
        toast.error('Failed to delete existing recommendations');
        return;
      }

      // Proceed with new analysis
      await handleAnalyze();
      toast.success('Website re-analyzed successfully');
    } catch (err) {
      console.error('Error in force reanalyze:', err);
      toast.error('Failed to re-analyze website');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleShowMoreRecommendations = async () => {
    if (!analysis) return;
    
    setIsLoading(true);
    try {
      const allRecommendations = await generateAllCampaigns(analysis, selectedBudget);
      setRecommendations(allRecommendations);
      setShowAll(true);
      toast.success('Generated additional recommendations');
    } catch (error) {
      console.error('Error generating more recommendations:', error);
      toast.error('Failed to generate more recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingAnimation isComplete={isAnalysisComplete} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">
          <AlertCircle className="h-12 w-12" />
        </div>
        <p className="text-lg font-semibold mb-2">Analysis Failed</p>
        <p className="text-muted-foreground text-center mb-4">{error}</p>
        <Button onClick={handleAnalyze} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Website Analysis</CardTitle>
            <Button
              variant="outline"
              onClick={handleForceReanalyze}
              disabled={isReanalyzing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
              {isReanalyzing ? 'Re-analyzing...' : 'Force Re-analysis'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Product Overview</h3>
            <p className="text-muted-foreground">{analysis.productOverview}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Core Value Proposition</h3>
            <p className="text-muted-foreground">{analysis.coreValueProposition}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Target Audience</h3>
            <p className="text-muted-foreground">
              Type: {analysis.targetAudience.type}
            </p>
            <p className="text-muted-foreground">
              Segments: {analysis.targetAudience.segments.join(', ')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Current Stage</h3>
            <p className="text-muted-foreground">{analysis.currentAwareness}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Goals</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.goal?.map((goal, index) => (
                <li key={`goal-${index}`}>{goal}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Suggested Budget</h3>
            <p className="text-muted-foreground">{analysis.budget}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Strengths</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.strengths?.map((strength, index) => (
                <li key={`strength-${index}`}>{strength}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Constraints</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.constraints?.map((constraint, index) => (
                <li key={`constraint-${index}`}>{constraint}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Preferred Channels</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.preferredChannels?.map((channel, index) => (
                <li key={`channel-${index}`}>{channel}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tone and Personality</h3>
            <p className="text-muted-foreground">{analysis.toneAndPersonality}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Campaign Recommendations</CardTitle>
            {recommendations.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={showAll ? handleShowLess : handleShowMoreRecommendations}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {showAll ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show More Campaigns <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Adjust Budget</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={formatBudget(tempBudget)}
                    onChange={handleBudgetInputChange}
                    className="w-32 text-right"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpdateCampaigns}
                  disabled={isLoading || tempBudget === selectedBudget}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Update Campaigns
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Slider
                value={[tempBudget]}
                onValueChange={handleBudgetChange}
                min={0}
                max={50000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                {BUDGET_RANGES.map((range) => (
                  <span key={range.label}>{range.label}</span>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((recommendation, index) => (
                <Card 
                  key={`${recommendation.id || index}-${recommendation.title}`}
                  className={cn(
                    "transition-all duration-200 hover:shadow-lg",
                    getDifficultyColor(recommendation.difficulty)
                  )}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{recommendation.platform}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{recommendation.description}</p>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Insights</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {recommendation.insights?.map((insight, index) => (
                          <li key={`insight-${index}`}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="font-semibold">ROI</p>
                        <p className={cn("font-medium", getRoiColor(recommendation.roi))}>
                          {recommendation.roi || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Difficulty</p>
                        <p className={cn(
                          "font-medium",
                          recommendation.difficulty === "Easy" && "text-green-600",
                          recommendation.difficulty === "Medium" && "text-yellow-600",
                          recommendation.difficulty === "Hard" && "text-red-600"
                        )}>
                          {recommendation.difficulty || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Budget</p>
                        <p className={cn("font-medium", getBudgetColor(recommendation.budget))}>
                          {recommendation.budget || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recommendations available yet. Adjust the budget or try analyzing again.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 