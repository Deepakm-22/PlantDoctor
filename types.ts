export enum View {
  Home = 'home',
  Scan = 'scan',
  Camera = 'camera',
  Analyzing = 'analyzing',
  Result = 'result',
  CareTips = 'careTips',
  History = 'history',
  SoilScan = 'soilScan',
  AnalyzingSoil = 'analyzingSoil',
  SoilResult = 'soilResult',
}

export interface PotentialIssue {
  issue: string;
  description: string;
  remedy: string;
}

export interface AnalysisResult {
  plantName: string;
  healthStatus: 'Healthy' | 'Unhealthy' | 'Needs Care';
  confidence: number;
  potentialIssues: PotentialIssue[];
  careRecommendations: string[];
}

export interface CareTip {
    title: string;
    content: string;
    keyTakeaway: string;
}

export interface AnalysisHistoryItem {
  id: string;
  image: string;
  date: string;
  analysis: AnalysisResult;
}

export interface RecommendedPlant {
  plantName: string;
  reasoning: string;
}

export interface SoilAnalysisResult {
  soilType: string;
  description: string;
  recommendedPlants: RecommendedPlant[];
}
