import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { LinkIcon, ArrowRight, Rocket } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

      // Show analyzing state
      setIsAnalyzing(true);

      // Store URL in localStorage
      localStorage.setItem('analyzedWebsiteUrl', url);

      // Navigate to marketing strategy page with URL as query parameter
      navigate(`/marketing-strategy?url=${encodeURIComponent(url)}`);

      // Reset state
      setIsAnalyzing(false);
    } catch (error) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20 min-h-screen flex items-center">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BLASTari</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`space-y-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-block bg-purple-100 px-4 py-1 rounded-full mb-4">
                <p className="text-purple-800 text-sm font-medium">AI-Powered Marketing</p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mx-auto max-w-3xl">
                Get a <span className="text-primary">professional marketing strategy</span> in seconds
              </h1>
              <p className="text-xl text-gray-600 mx-auto max-w-2xl mb-8">
                Blastari uses AI to analyze your website and generate a comprehensive marketing strategy tailored to your business.
              </p>
              
              <div className="pt-6 max-w-xl mx-auto">
                <Card className="border-2 border-purple-100 shadow-lg animate-[fade-in_0.7s_ease-out]">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <div className="flex items-center w-full gap-2 bg-white border rounded-md px-3">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                        <Input 
                          value={url} 
                          onChange={(e) => setUrl(e.target.value)} 
                          placeholder="Enter your website URL"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="relative overflow-hidden group mx-auto"
                        disabled={isAnalyzing}
                      >
                        <span className="absolute right-full w-12 h-32 -mt-12 bg-white opacity-10 transform rotate-12 group-hover:translate-x-96 transition-transform duration-1000 ease-out"></span>
                        {isAnalyzing ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Generate Marketing Strategy
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Blastari</h2>
              </div>
              <p className="text-gray-400">AI-powered ad campaign platform</p>
            </div>
            <div className="flex space-x-6">
              {/* <a href="#" className="hover:text-primary">Features</a>
              <a href="#" className="hover:text-primary">Pricing</a>
              <a href="#" className="hover:text-primary">Documentation</a>
              <a href="#" className="hover:text-primary">Contact</a> */}
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Blastari. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
