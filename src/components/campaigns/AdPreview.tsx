
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdPreviewProps {
  platform: string;
  type: string;
  imageSrc: string;
  title: string;
  description?: string;
}

const AdPreview: React.FC<AdPreviewProps> = ({
  platform,
  type,
  imageSrc,
  title,
  description,
}) => {
  return (
    <div className="ad-preview">
      <Card className="h-full">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {platform} {type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div
            className="w-full h-48 rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 h-3 w-3"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span>Est. clicks: 3.2K</span>
          <span className="mx-2">•</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 h-3 w-3"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>Duration: 30 days</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdPreview;
