import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { PredictionResultType } from '../types/crop';

interface PredictionResultProps {
  result: PredictionResultType;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const getYieldCategory = (cropYield: number) => {
    if (cropYield < 1000) return { label: 'Low', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: AlertTriangle };
    if (cropYield < 3000) return { label: 'Moderate', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: TrendingUp };
    if (cropYield < 5000) return { label: 'Good', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: CheckCircle };
    return { label: 'Excellent', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: Award };
  };

  const yieldCategory = getYieldCategory(result.predictedYield);
  const CategoryIcon = yieldCategory.icon;

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Main Result Card */}
      <Card className="shadow-2xl border border-green-500/20 bg-black/40 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Prediction Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="mb-4">
              <CategoryIcon className="w-12 h-12 mx-auto text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {result.predictedYield.toLocaleString()} kg/ha
            </h2>
            <Badge className={`${yieldCategory.color} px-3 py-1 text-sm font-medium border`}>
              {yieldCategory.label} Yield
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-gray-600">
              <p className="text-gray-300">Crop Type</p>
              <p className="font-semibold text-white">{result.cropType}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-gray-600">
              <p className="text-gray-300">Region</p>
              <p className="font-semibold text-white">{result.region}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-gray-600">
              <p className="text-gray-300">Year</p>
              <p className="font-semibold text-white">{result.year}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-gray-600">
              <p className="text-gray-300">Confidence</p>
              <p className="font-semibold text-green-400">{result.confidence}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Factors Card */}
      <Card className="shadow-2xl border border-blue-500/20 bg-black/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Environmental Factors Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {result.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-gray-600">
                <div>
                  <p className="font-medium text-white">{factor.name}</p>
                  <p className="text-sm text-gray-300">{factor.value}</p>
                </div>
                <Badge 
                  className={`
                    ${factor.impact === 'Positive' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                      factor.impact === 'Negative' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'} border
                  `}
                >
                  {factor.impact}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card className="shadow-2xl border border-purple-500/20 bg-black/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-400" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-200">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResult;