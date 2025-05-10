
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PenLine, 
  Mic, 
  Film, 
  Copy, 
  MessageCircle, 
  Search, 
  BarChart, 
  Mail, 
  Code, 
  Target, 
  Users, 
  ShoppingBag, 
  Layers, 
  Map, 
  CalendarDays, 
  Megaphone, 
  Building 
} from "lucide-react";

interface CampaignCardProps {
  title: string;
  platform: string;
  description: string;
  onClick: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  title,
  platform,
  description,
  onClick
}) => {
  const getIconForCampaign = (title: string, platform: string) => {
    // Check campaign type based on title and platform
    const campaignType = title.toLowerCase();
    const platformType = platform.toLowerCase();
    
    if (campaignType.includes('viral') || platformType.includes('viral')) return <MessageCircle className="h-4 w-4" />;
    if (campaignType.includes('pr') || platformType.includes('pr')) return <Megaphone className="h-4 w-4" />;
    if (campaignType.includes('search engine') || platformType.includes('google')) return <Search className="h-4 w-4" />;
    if (campaignType.includes('social') || platformType.includes('facebook') || platformType.includes('instagram')) return <Users className="h-4 w-4" />;
    if (campaignType.includes('content') || platformType.includes('blog')) return <PenLine className="h-4 w-4" />;
    if (campaignType.includes('email')) return <Mail className="h-4 w-4" />;
    if (campaignType.includes('engineering') || campaignType.includes('code')) return <Code className="h-4 w-4" />;
    if (campaignType.includes('target') || campaignType.includes('blog')) return <Target className="h-4 w-4" />;
    if (campaignType.includes('business') || campaignType.includes('b2b')) return <Building className="h-4 w-4" />;
    if (campaignType.includes('sales')) return <ShoppingBag className="h-4 w-4" />;
    if (campaignType.includes('affiliate')) return <Layers className="h-4 w-4" />;
    if (campaignType.includes('trade') || campaignType.includes('show')) return <Map className="h-4 w-4" />;
    if (campaignType.includes('event')) return <CalendarDays className="h-4 w-4" />;
    if (campaignType.includes('seo')) return <BarChart className="h-4 w-4" />;
    if (campaignType.includes('video') || platformType.includes('youtube')) return <Film className="h-4 w-4" />;
    if (campaignType.includes('audio') || platformType.includes('podcast')) return <Mic className="h-4 w-4" />;
    
    // Default icon
    return <Copy className="h-4 w-4" />;
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            {getIconForCampaign(title, platform)}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-muted-foreground">{platform}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
