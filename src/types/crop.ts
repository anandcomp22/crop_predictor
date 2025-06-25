export interface CropFormData {
  year: string;
  averageRainfall: string;
  pesticides: string;
  avgTemp: string;
  area: string;
  item: string;
}

export interface CropPredictionInput {
  year: number;
  averageRainfall: number;
  pesticides: number;
  avgTemp: number;
  area: string;
  item: string;
}

export interface EnvironmentalFactor {
  name: string;
  value: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
}

export interface PredictionResultType {
  predictedYield: number;
  confidence: number;
  cropType: string;
  region: string;
  year: number;
  factors: EnvironmentalFactor[];
  recommendations: string[];
}