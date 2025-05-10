
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Play, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import CanvasEditor from "@/components/content/CanvasEditor";

const ContentStudio = () => {
  const [savedContent, setSavedContent] = useState<any[]>([]);
  
  const handleSaveContent = (data: any) => {
    // In a real app, this would save to a database
    setSavedContent((prev) => [...prev, data]);
  };

  const handleCreateNew = (mode: "image" | "video") => {
    // In a real app, this would create a new project
    toast.info(`Creating new ${mode} project`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Studio</h1>
        <p className="text-muted-foreground">
          Create and edit content for your ad campaigns
        </p>
      </div>

      <Tabs defaultValue="image" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Image Editor
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Video Editor
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCreateNew("image")}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              New Image
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCreateNew("video")}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              New Video
            </Button>
          </div>
        </div>

        <TabsContent value="image" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Editor</CardTitle>
              <CardDescription>
                Create and customize images for your ad campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[600px]">
              <CanvasEditor onSave={handleSaveContent} mode="image" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Editor</CardTitle>
              <CardDescription>
                Create engaging videos for TikTok, Instagram, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[600px]">
              <CanvasEditor onSave={handleSaveContent} mode="video" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {savedContent.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedContent.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div 
                    className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-2"
                    style={{ backgroundColor: item.backgroundColor }}
                  >
                    <div style={{ color: item.color, fontSize: `${item.fontSize}px` }}>
                      {item.text || "Untitled"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Project {index + 1}</span>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentStudio;
