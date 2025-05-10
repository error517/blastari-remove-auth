import React, { useState, useEffect, useRef } from 'react';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const loadingMessages = [
  "Finding your unfair advantage…",
  "Deploying battle-tested marketing tactics…",
  "Reverse-engineering virality…",
  "Digging through the internet for low-cost leverage…",
  "Sniffing out the channels where you might just pop off.",
  "Testing the waters so you don't shout into the void.",
  "Skimming the socials for signals worth chasing…",
  "Checking where your people already hang out…",
  "Gathering guerrilla tactics — quietly powerful, loudly effective.",
  "Scouting paths to attention — no guarantees, just insights.",
  "Looking for channels that don't cost a dime, just some hustle.",
  "Surfacing the playgrounds where brands go viral sometimes.",
  "Pulling from playbooks, not promising fireworks.",
  "Tracking down channels with whisper-level noise and word-of-mouth potential.",
  "Compiling places where smart brands quietly win big.",
  "Finding the paths of least resistance — and most curiosity.",
  "Mapping opportunities, not illusions.",
  "Hunting for the next organic breakout — cautiously optimistic.",
  "Analyzing market gaps and opportunities…",
  "Evaluating channel effectiveness and ROI potential…",
  "Identifying low-hanging fruit in your market…",
  "Calculating optimal budget allocation…",
  "Discovering untapped audience segments…",
  "Mapping out competitive advantages…",
  "Finding your brand's unique voice…",
  "Identifying growth levers and multipliers…",
  "Analyzing successful case studies in your space…",
  "Evaluating channel saturation and opportunity…",
  "Discovering viral content patterns…",
  "Mapping customer journey touchpoints…"
];

interface LoadingAnimationProps {
  isComplete?: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isComplete = false }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isFading, setIsFading] = useState(false);
  const messageIndexRef = useRef(0);
  const selectedMessagesRef = useRef<string[]>([]);
  const messageIntervalRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize messages only once
  useEffect(() => {
    const shuffled = [...loadingMessages].sort(() => 0.5 - Math.random());
    selectedMessagesRef.current = shuffled.slice(0, 4);
    setCurrentMessage(shuffled[0]);
  }, []); // Empty dependency array - only run once

  // Handle progress updates
  useEffect(() => {
    progressIntervalRef.current = setInterval(() => {
      setProgress((currentProgress) => {
        const maxProgress = isComplete ? 100 : 95;
        if (currentProgress >= maxProgress) {
          return maxProgress;
        }
        return currentProgress + .2;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isComplete]); // Only depend on isComplete

  // Handle message rotation
  useEffect(() => {
    const rotateMessages = () => {
      setIsFading(true);
      setTimeout(() => {
        messageIndexRef.current = (messageIndexRef.current + 1) % selectedMessagesRef.current.length;
        setCurrentMessage(selectedMessagesRef.current[messageIndexRef.current]);
        setIsFading(false);
      }, 500);
    };

    messageIntervalRef.current = setInterval(rotateMessages, 3000);

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, []); // Empty dependency array - only run once

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="relative w-64 h-64">
        {/* Rocket container */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-48">
          {/* Progress bar background */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-48 bg-gray-200 rounded-full">
            {/* Progress fill */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ height: `${progress}%` }}
            />
          </div>
          {/* Rocket */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-300"
            style={{ bottom: `${progress}%` }}
          >
            <Rocket className="w-8 h-8 text-blue-500 transform -rotate-45" />
          </div>
        </div>
      </div>

      {/* Loading message with fade transition */}
      <div className="text-center min-h-[4rem]">
        <p 
          className={cn(
            "text-lg font-medium text-gray-700 transition-opacity duration-500",
            isFading ? "opacity-0" : "opacity-100"
          )}
        >
          {currentMessage}
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation; 