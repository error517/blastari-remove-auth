import { supabase } from './supabaseClient';
import { generateTextContent, parseJsonResponse } from './geminiClient';

export interface WebsiteAnalysis {
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

export interface CampaignRecommendation {
  id: string;
  title: string;
  platform: string;
  description: string;
  insights: string[];
  roi: string;
  difficulty: "Easy" | "Medium" | "Hard";
  budget: string;
}

const campaignTypes = [
  "Viral Marketing",
  "Public Relations",
  "Unconventional PR",
  "Search Engine Marketing",
  "Social & Display Ads",
  "Offline Ads",
  "Search Engine Optimization",
  "Content Marketing",
  "Email Marketing",
  "Engineering as Marketing",
  "Targeting Blogs",
  "Business Development",
  "Sales",
  "Affiliate Programs",
  "Existing Platforms",
  "Trade Shows",
  "Offline Events",
  "Speaking Engagements",
  "Community Building"
];

export async function analyzeWebsite(url: string): Promise<{ analysis: WebsiteAnalysis; recommendations: CampaignRecommendation[] }> {
  console.log('Starting website fetch for:', url);

  try {
    // Fetch website content using a CORS proxy
    console.log('Fetching website content...');
    const corsProxy = 'https://api.codetabs.com/v1/proxy?quest=';
    const response = await fetch(`${corsProxy}${url}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Successfully fetched website content');

    // Extract and clean text content
    console.log('Cleaning content...');
    let content = html
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove style tags and their content
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove all HTML tags
      .replace(/<[^>]*>/g, ' ')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove common UI elements
      .replace(/(menu|navigation|header|footer|sidebar|button|link|search|login|sign up|sign in|register|subscribe|newsletter|cookie|privacy|terms|copyright|all rights reserved)/gi, '')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '')
      // Remove email addresses
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, '')
      // Remove special characters
      .replace(/[^\w\s.,!?-]/g, ' ')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Remove multiple periods
      .replace(/\.+/g, '.')
      // Remove multiple commas
      .replace(/,+/g, ',')
      // Remove multiple dashes
      .replace(/-+/g, '-')
      // Remove multiple question marks
      .replace(/\?+/g, '?')
      // Remove multiple exclamation marks
      .replace(/!+/g, '!')
      // Trim whitespace
      .trim();

    // Remove short lines (likely UI elements or navigation)
    content = content
      .split('\n')
      .filter(line => line.trim().length > 20)
      .join('\n');

    // Remove duplicate lines
    content = [...new Set(content.split('\n'))].join('\n');

    // Limit content to 1000 characters
    content = content.slice(0, 1000);
    console.log('Content cleaned and limited, length:', content.length);

    if (content.length < 100) {
      throw new Error('Extracted content is too short. The website might be blocking access.');
    }

    // Call Gemini API for analysis
    console.log('Analyzing content with Gemini...');

    const systemPrompt = 'You are a marketing analysis expert. Analyze the website content and provide a structured analysis in JSON format with the following fields:\n1. productOverview: Brief description in 1-2 sentences\n2. coreValueProposition: Most unique/urgent benefit\n3. targetAudience: { type: "Consumers" | "Business" | "Government", segments: string[] }\n4. currentAwareness: Stage of product (e.g., "Just an idea", "MVP live", "Some beta users", "Public launch", "Revenue generating")\n5. goal: string[] (e.g., ["Awareness", "Waitlist signups", "App downloads"])\n6. budget: Suggested budget range based on market and product stage\n7. strengths: string[] (Key advantages)\n8. constraints: string[] (Limitations and risks)\n9. preferredChannels: string[] (e.g., ["Paid ads", "Content marketing", "PR"])\n10. toneAndPersonality: How the brand should feel in marketing materials';

    const userPrompt = `Analyze this website content:\n\n${content}`;

    const analysisResult = await generateTextContent(userPrompt, systemPrompt);
    console.log('Gemini analysis received');

    // Parse the response
    const analysis = await parseJsonResponse<WebsiteAnalysis>(analysisResult);
    console.log('Analysis parsed successfully');

    // Generate initial campaign recommendations with default budget
    console.log('Generating campaign recommendations...');

    const recommendationsSystemPrompt = `You are a marketing campaign expert. Based on the company analysis, recommend the best 3 campaign types from this list: ${campaignTypes.join(', ')}. For each campaign, provide:
1. A title that includes the campaign type
2. A suitable platform (e.g., "Google Ads", "Instagram", "LinkedIn", etc.)
3. A brief description
4. 3 specific insights about why this campaign would work for this company
5. A realistic ROI estimate (e.g., "2.5x")
6. Difficulty level ("Easy", "Medium", or "Hard")
7. Budget range (e.g., "$500-1000")

Make concise recommendations. (150 words or less)
Format the response as a JSON array of campaign objects.`;

    const recommendationsUserPrompt = `Here's the company analysis:\n\n${JSON.stringify(analysis, null, 2)}`;

    const recommendationsResult = await generateTextContent(recommendationsUserPrompt, recommendationsSystemPrompt);

    const recommendations = await parseJsonResponse<CampaignRecommendation[]>(recommendationsResult);
    console.log('Campaign recommendations generated successfully');

    return { analysis, recommendations };
  } catch (error) {
    console.error('Error in analyzeWebsite:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

export async function generateAllCampaigns(analysis: WebsiteAnalysis, budget: number): Promise<CampaignRecommendation[]> {
  console.log('Generating all campaign recommendations...');

  const systemPrompt = `You are a marketing campaign expert. Based on the company analysis and the specified budget of $${budget}, create detailed campaign recommendations for ALL campaign types from this list: ${campaignTypes.join(', ')}. For each campaign, provide:
1. A title that includes the campaign type
2. A suitable platform (e.g., "Google Ads", "Instagram", "LinkedIn", etc.)
3. A brief description
4. 3 specific insights about why this campaign would work for this company
5. A realistic ROI estimate (e.g., "2.5x")
6. Difficulty level ("Easy", "Medium", or "Hard")
7. Budget range that fits within the total budget of $${budget}

Make concise recommendations. (150 words or less)
Format the response as a JSON array of campaign objects.`;

  const userPrompt = `Here's the company analysis:\n\n${JSON.stringify(analysis, null, 2)}`;

  try {
    const result = await generateTextContent(userPrompt, systemPrompt);
    const recommendations = await parseJsonResponse<CampaignRecommendation[]>(result);
    console.log('All campaign recommendations generated successfully');
    return recommendations;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export interface MarketingStrategy {
  // Overview section
  companyOverview: string;
  valueProposition: string;
  targetAudience: {
    description: string;
    segments: string[];
  };
  industryInsights: string[];

  // Strategy section
  strategicObjectives: string[];
  keyMarketingGoals: {
    shortTerm: string[];
    longTerm: string[];
  };
  positioning: string;

  // Tactics section
  recommendedChannels: {
    name: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    estimatedROI: string;
  }[];

  // Content strategy
  contentPillars: string[];
  contentIdeas: string[];

  // Implementation
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];

  // Budget allocation
  budgetRecommendation: {
    totalBudget: string;
    breakdown: {
      category: string;
      allocation: string;
      description: string;
    }[];
  };

  // Success metrics
  keyMetrics: {
    metric: string;
    target: string;
    measurementMethod: string;
  }[];
}

export async function generateMarketingStrategy(analysis: WebsiteAnalysis): Promise<MarketingStrategy> {
  console.log('Generating comprehensive marketing strategy...');

  const systemPrompt = `You are a senior marketing strategist for a top digital marketing agency. Create a detailed, professional marketing strategy plan based on the provided website analysis. The plan should be comprehensive, actionable, and include the following sections in JSON format:

1. companyOverview: A concise overview of the company (2-3 sentences)
2. valueProposition: The core unique selling proposition (1-2 sentences)
3. targetAudience:
   - description: Overall description of the ideal customer
   - segments: Array of specific audience segments to target
4. industryInsights: Array of 3-5 key insights about the industry landscape
5. strategicObjectives: Array of 3-5 primary strategic marketing objectives
6. keyMarketingGoals:
   - shortTerm: Array of 3-4 goals achievable in 3-6 months
   - longTerm: Array of 3-4 goals achievable in 6-18 months
7. positioning: How the brand should position itself against competitors
8. recommendedChannels: Array of 4-6 recommended marketing channels, each with:
   - name: Channel name (e.g., "Social Media - Instagram")
   - description: Brief description of how to use this channel
   - priority: "High", "Medium", or "Low"
   - estimatedROI: Estimated ROI as a multiple (e.g., "3.5x")
9. contentPillars: Array of 3-5 content themes/topics to focus on
10. contentIdeas: Array of 6-10 specific content pieces to create
11. timeline: Implementation timeline with 3-4 phases, each containing:
    - phase: Name/number of the phase
    - duration: Timeframe (e.g., "Months 1-2")
    - activities: Array of key activities for this phase
12. budgetRecommendation:
    - totalBudget: Recommended total budget
    - breakdown: Array of budget categories with:
      - category: Name of category (e.g., "Paid Advertising")
      - allocation: Percentage or amount (e.g., "30%" or "$3,000")
      - description: Brief explanation
13. keyMetrics: Array of 5-8 KPIs to track, each with:
    - metric: Name of metric
    - target: Target value
    - measurementMethod: How to measure

The strategy should be sophisticated yet practical, with actionable insights tailored to the company's specific situation. Use professional marketing terminology while keeping recommendations clear and implementable.`;

  const userPrompt = `Here's the website analysis to base the marketing strategy on:\n\n${JSON.stringify(analysis, null, 2)}`;

  try {
    const result = await generateTextContent(userPrompt, systemPrompt);
    const marketingStrategy = await parseJsonResponse<MarketingStrategy>(result);
    console.log('Marketing strategy generated successfully');
    return marketingStrategy;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}