
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Bold, Italic, Underline, Image as ImageIcon, Type, Square, Circle, 
  Palette, Minus, Plus, Save, Upload, Download, Undo, Redo
} from "lucide-react";
import { toast } from "sonner";

interface CanvasEditorProps {
  onSave: (data: any) => void;
  mode: "image" | "video";
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ onSave, mode }) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  
  const handleSave = () => {
    // In a real implementation, this would save the canvas state
    onSave({ text, fontSize, color, backgroundColor });
    toast.success(`${mode === 'image' ? 'Image' : 'Video'} saved successfully`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border rounded-lg p-4 bg-white shadow-sm mb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" size="sm">
            <Undo className="h-4 w-4 mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="h-4 w-4 mr-1" /> Redo
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" /> Upload
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="shapes">Shapes</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Underline className="h-4 w-4" />
              </Button>
              <Input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 p-0 border-none"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Font Size</span>
                <span>{fontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4" />
                <Slider
                  value={[fontSize]}
                  min={8}
                  max={72}
                  step={1}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="flex-1"
                />
                <Plus className="h-4 w-4" />
              </div>
            </div>
            
            <Input
              placeholder="Enter text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button variant="outline" className="w-full">
              <Type className="h-4 w-4 mr-2" /> Add Text
            </Button>
          </TabsContent>
          
          <TabsContent value="shapes" className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Square className="h-4 w-4 mr-2" /> Rectangle
            </Button>
            <Button variant="outline">
              <Circle className="h-4 w-4 mr-2" /> Circle
            </Button>
          </TabsContent>
          
          <TabsContent value="images">
            <Button variant="outline" className="w-full">
              <ImageIcon className="h-4 w-4 mr-2" /> Upload Image
            </Button>
          </TabsContent>
          
          <TabsContent value="background">
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium">Background Color</span>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 p-0 h-8 border-none"
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {["#ffffff", "#f3f4f6", "#fee2e2", "#e0f2fe", "#dcfce7"].map((color) => (
                  <div
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className="w-full aspect-square rounded-md cursor-pointer border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div 
        className="content-editor-canvas flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
        style={{ backgroundColor }}
      >
        {text ? (
          <div style={{ fontSize: `${fontSize}px`, color }}>
            {text}
          </div>
        ) : (
          <div className="text-muted-foreground text-center p-4">
            {mode === "image" ? (
              <div>
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Design your image here</p>
                <p className="text-sm">Add text, shapes, and images from the tools above</p>
              </div>
            ) : (
              <div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mx-auto mb-2 opacity-20"
                >
                  <path d="M13 3H8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-7" />
                  <path d="M18 2v8h8" />
                  <path d="m18 10 5-5" />
                </svg>
                <p>Create your video content here</p>
                <p className="text-sm">Add scenes, transitions, and effects from the tools above</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasEditor;
