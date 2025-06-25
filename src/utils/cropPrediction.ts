import { CropPredictionInput, PredictionResultType, EnvironmentalFactor } from '../types/crop';

export const predictCropYield = (input: CropPredictionInput): PredictionResultType => {
  // Simulate machine learning prediction with realistic calculations
  const {
    year,
    averageRainfall,
    pesticides,
    avgTemp,
    area,
    item
  } = input;

  // Base yield varies by crop type
  const cropBaseYields: { [key: string]: number } = {
    'Wheat': 3500,
    'Maize (Corn)': 6000,
    'Rice': 4500,
    'Soybeans': 2800,
    'Barley': 3200,
    'Sorghum': 3800,
    'Oats': 2900,
    'Millet': 1800,
    'Rye': 2700,
    'Sunflower Seed': 2200,
    'Cotton': 1600,
    'Sugar Beet': 4800,
    'Potatoes': 8500,
    'Sweet Potatoes': 7200,
    'Cassava': 5800,
    'Beans': 2100,
    'Peas': 2400,
    'Chickpeas': 1900,
    'Lentils': 1700,
    'Groundnuts': 2600
  };

  // Regional multipliers
  const regionalMultipliers: { [key: string]: number } = {
    'United States': 1.15,
    'China': 1.05,
    'India': 0.85,
    'Brazil': 1.10,
    'Argentina': 1.08,
    'Russia': 0.95,
    'Ukraine': 1.02,
    'Australia': 1.12,
    'Canada': 1.08,
    'France': 1.18,
    'Germany': 1.16,
    'Turkey': 0.92,
    'Pakistan': 0.78,
    'Poland': 1.01,
    'Romania': 0.98,
    'Kazakhstan': 0.88,
    'United Kingdom': 1.14,
    'Italy': 1.09,
    'Spain': 1.06,
    'Mexico': 0.89
  };

  let baseYield = cropBaseYields[item] || 3000;
  let regionalMultiplier = regionalMultipliers[area] || 1.0;

  // Calculate environmental impacts
  let rainfallFactor = 1.0;
  if (averageRainfall < 300) rainfallFactor = 0.4;
  else if (averageRainfall < 600) rainfallFactor = 0.7;
  else if (averageRainfall < 1200) rainfallFactor = 1.0;
  else if (averageRainfall < 2000) rainfallFactor = 1.1;
  else rainfallFactor = 0.8; // Too much rain

  let tempFactor = 1.0;
  if (avgTemp < 5) tempFactor = 0.3;
  else if (avgTemp < 15) tempFactor = 0.7;
  else if (avgTemp < 25) tempFactor = 1.0;
  else if (avgTemp < 35) tempFactor = 0.9;
  else tempFactor = 0.4; // Too hot

  let pesticideFactor = Math.min(1.0 + (pesticides * 0.02), 1.3); // Diminishing returns

  // Year trend (modern agricultural improvements)
  let yearFactor = 1.0 + ((year - 2000) * 0.005);

  // Calculate final yield
  let predictedYield = baseYield * regionalMultiplier * rainfallFactor * tempFactor * pesticideFactor * yearFactor;
  
  // Add some realistic variance
  const variance = (Math.random() - 0.5) * 0.2;
  predictedYield = Math.max(100, Math.round(predictedYield * (1 + variance)));

  // Calculate confidence based on how optimal conditions are
  const optimalityScore = (rainfallFactor + tempFactor + Math.min(pesticideFactor, 1.2)) / 3;
  const confidence = Math.round(75 + (optimalityScore - 0.8) * 100);

  // Generate environmental factors analysis
  const factors: EnvironmentalFactor[] = [
    {
      name: 'Rainfall',
      value: `${averageRainfall} mm/year`,
      impact: averageRainfall >= 600 && averageRainfall <= 2000 ? 'Positive' : 
              averageRainfall < 300 || averageRainfall > 2500 ? 'Negative' : 'Neutral'
    },
    {
      name: 'Temperature',
      value: `${avgTemp}°C`,
      impact: avgTemp >= 15 && avgTemp <= 25 ? 'Positive' : 
              avgTemp < 5 || avgTemp > 35 ? 'Negative' : 'Neutral'
    },
    {
      name: 'Pesticide Usage',
      value: `${pesticides} tonnes`,
      impact: pesticides > 0 && pesticides < 50 ? 'Positive' : 
              pesticides > 100 ? 'Negative' : 'Neutral'
    },
    {
      name: 'Regional Conditions',
      value: area,
      impact: regionalMultiplier > 1.05 ? 'Positive' : 
              regionalMultiplier < 0.95 ? 'Negative' : 'Neutral'
    }
  ];

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (averageRainfall < 600) {
    recommendations.push('Consider implementing irrigation systems to supplement rainfall');
  }
  if (averageRainfall > 2000) {
    recommendations.push('Implement proper drainage systems to prevent waterlogging');
  }
  if (avgTemp > 30) {
    recommendations.push('Consider heat-resistant crop varieties or shade management');
  }
  if (avgTemp < 10) {
    recommendations.push('Consider using greenhouses or selecting cold-tolerant varieties');
  }
  if (pesticides > 50) {
    recommendations.push('Optimize pesticide usage to prevent environmental damage');
  }
  if (pesticides < 5) {
    recommendations.push('Consider integrated pest management strategies');
  }
  
  recommendations.push('Monitor soil health and consider crop rotation practices');
  recommendations.push('Stay updated with weather forecasts for optimal planting timing');

  return {
    predictedYield,
    confidence: Math.max(65, Math.min(95, confidence)),
    cropType: item,
    region: area,
    year,
    factors,
    recommendations
  };
};