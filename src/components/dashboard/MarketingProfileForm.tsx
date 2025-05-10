
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface MarketingProfileFormProps {
  websiteUrl: string;
  onSubmit: (profileData: any) => void;
  isSubmitting: boolean;
}

const MarketingProfileForm: React.FC<MarketingProfileFormProps> = ({ 
  websiteUrl, 
  onSubmit, 
  isSubmitting 
}) => {
  const [productOverview, setProductOverview] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [targetAudience, setTargetAudience] = useState<string[]>(["Consumers"]);
  const [consumerSegments, setConsumerSegments] = useState<string[]>([]);
  const [currentAwareness, setCurrentAwareness] = useState("MVP live");
  const [goals, setGoals] = useState<string[]>([]);
  const [budget, setBudget] = useState("$1,000");
  const [strengths, setStrengths] = useState("");
  const [constraints, setConstraints] = useState("");
  const [preferredChannels, setPreferredChannels] = useState<string[]>([]);
  const [tone, setTone] = useState("");

  const handleAudienceChange = (value: string) => {
    if (targetAudience.includes(value)) {
      setTargetAudience(targetAudience.filter(item => item !== value));
    } else {
      setTargetAudience([...targetAudience, value]);
    }
  };

  const handleConsumerSegmentChange = (value: string) => {
    if (consumerSegments.includes(value)) {
      setConsumerSegments(consumerSegments.filter(item => item !== value));
    } else {
      setConsumerSegments([...consumerSegments, value]);
    }
  };
  
  const handleGoalChange = (value: string) => {
    if (goals.includes(value)) {
      setGoals(goals.filter(item => item !== value));
    } else {
      setGoals([...goals, value]);
    }
  };
  
  const handleChannelChange = (value: string) => {
    if (preferredChannels.includes(value)) {
      setPreferredChannels(preferredChannels.filter(item => item !== value));
    } else {
      setPreferredChannels([...preferredChannels, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productOverview) {
      toast.error("Please provide a product overview");
      return;
    }
    
    if (!valueProposition) {
      toast.error("Please provide a value proposition");
      return;
    }
    
    if (targetAudience.length === 0) {
      toast.error("Please select at least one target audience");
      return;
    }
    
    if (goals.length === 0) {
      toast.error("Please select at least one goal");
      return;
    }
    
    const profileData = {
      product_overview: productOverview,
      core_value_proposition: valueProposition,
      target_audience: targetAudience,
      consumer_segments: consumerSegments,
      current_awareness: currentAwareness,
      goals: goals,
      budget: budget,
      strengths: strengths,
      constraints: constraints,
      preferred_channels: preferredChannels,
      tone: tone
    };
    
    onSubmit(profileData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tell us more about {websiteUrl}</CardTitle>
        <CardDescription>
          Help us create better recommendations by sharing more about your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product-overview">Product Overview</Label>
            <Textarea 
              id="product-overview" 
              placeholder="Briefly describe your product or service in 1-2 sentences"
              value={productOverview}
              onChange={(e) => setProductOverview(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value-proposition">Core Value Proposition</Label>
            <Textarea 
              id="value-proposition" 
              placeholder="What's the most unique, urgent, or emotionally resonant benefit of this product?"
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="audience-consumers" 
                  checked={targetAudience.includes("Consumers")}
                  onCheckedChange={() => handleAudienceChange("Consumers")}
                />
                <Label htmlFor="audience-consumers">Consumers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="audience-business" 
                  checked={targetAudience.includes("Business")}
                  onCheckedChange={() => handleAudienceChange("Business")}
                />
                <Label htmlFor="audience-business">Business</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="audience-government" 
                  checked={targetAudience.includes("Government")}
                  onCheckedChange={() => handleAudienceChange("Government")}
                />
                <Label htmlFor="audience-government">Government</Label>
              </div>
            </div>
          </div>
          
          {targetAudience.includes("Consumers") && (
            <div className="space-y-2">
              <Label>Consumer Segments</Label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {["Gen Z", "Gen Alpha", "Millennials", "Parents", "Techies", "Students"].map(segment => (
                  <div key={segment} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`segment-${segment.toLowerCase().replace(" ", "-")}`}
                      checked={consumerSegments.includes(segment)}
                      onCheckedChange={() => handleConsumerSegmentChange(segment)}
                    />
                    <Label htmlFor={`segment-${segment.toLowerCase().replace(" ", "-")}`}>{segment}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="awareness">Current Awareness/Validation</Label>
            <Select defaultValue={currentAwareness} onValueChange={setCurrentAwareness}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Just an idea">Just an idea</SelectItem>
                <SelectItem value="MVP live">MVP live</SelectItem>
                <SelectItem value="Some beta users">Some beta users</SelectItem>
                <SelectItem value="Public launch">Public launch</SelectItem>
                <SelectItem value="Revenue generating">Revenue generating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Goal</Label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {["Awareness", "Waitlist signups", "App downloads", "Purchases/Users", "Feedback/Validation", "Brand credibility"].map(goal => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`goal-${goal.toLowerCase().replace("/", "-").replace(" ", "-")}`}
                    checked={goals.includes(goal)}
                    onCheckedChange={() => handleGoalChange(goal)}
                  />
                  <Label htmlFor={`goal-${goal.toLowerCase().replace("/", "-").replace(" ", "-")}`}>{goal}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <RadioGroup defaultValue={budget} onValueChange={setBudget}>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="$100" id="budget-100" />
                  <Label htmlFor="budget-100">$100</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="$1,000" id="budget-1000" />
                  <Label htmlFor="budget-1000">$1,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="$50,000" id="budget-50000" />
                  <Label htmlFor="budget-50000">$50,000</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strengths">Strengths to Leverage</Label>
            <Textarea 
              id="strengths" 
              placeholder="What advantages or assets do you already have?"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="constraints">Major Constraints or Risks</Label>
            <Textarea 
              id="constraints" 
              placeholder="Any limitations in time, money, team, legal, or platform?"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Preferred Channel Types</Label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {[
                "Paid ads", "Partnerships/affiliates", "Content marketing", 
                "Community building", "PR", "SEM", "SEO", "Viral/referral mechanics"
              ].map(channel => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`channel-${channel.toLowerCase().replace("/", "-").replace(" ", "-")}`}
                    checked={preferredChannels.includes(channel)}
                    onCheckedChange={() => handleChannelChange(channel)}
                  />
                  <Label htmlFor={`channel-${channel.toLowerCase().replace("/", "-").replace(" ", "-")}`}>{channel}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tone">Tone & Brand Personality</Label>
            <Textarea 
              id="tone" 
              placeholder="How should the brand feel in marketing materials?"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Submitting...
              </span>
            ) : (
              "Generate Recommendations"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MarketingProfileForm;
