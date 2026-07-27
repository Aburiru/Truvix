export type ViewMode = 
  | 'landing' 
  | 'login' 
  | 'register'
  | 'overview' 
  | 'text-scan' 
  | 'image-forensic' 
  | 'text-report' 
  | 'image-report' 
  | 'settings' 
  | 'support';

export interface TextScanParagraph {
  text: string;
  isAi: boolean;
  reasoning: string;
}

export interface TextScanReport {
  id: string;
  title: string;
  timestamp: string;
  aiProbability: number;
  confidenceLabel: string;
  perplexityScore: string;
  perplexityDescription: string;
  burstiness: string;
  burstinessDescription: string;
  sentenceLength: string;
  avgSentenceLength: string;
  linguisticPatternSummary: string;
  highlightedTags: string[];
  paragraphs: TextScanParagraph[];
  originalText: string;
}

export interface HeatmapRegion {
  x: number;
  y: number;
  radius: number;
  intensity: number;
  label: string;
}

export interface ForensicFinding {
  risk: 'High Risk' | 'Medium Risk' | 'Low Risk';
  title: string;
  description: string;
}

export interface ImageForensicReport {
  id: string;
  fileName: string;
  imageUrl: string;
  timestamp: string;
  aiProbability: number;
  confidenceLabel: string;
  riskLevel: string;
  riskSummary: string;
  findings: {
    noisePattern: ForensicFinding;
    metadata: ForensicFinding;
    pixelArtifacts: ForensicFinding;
  };
  analysisSummary: string;
  heatmapRegions: HeatmapRegion[];
}
export interface UserCredits {
  used: number;
  max: number;
  isPro: boolean;
  totalDocuments: number;
  totalImages: number;
  aiTextPercentage: number;
  humanTextPercentage: number;
  syntheticImagePercentage: number;
  authenticImagePercentage: number;
}
