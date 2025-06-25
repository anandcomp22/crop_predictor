import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Leaf, TrendingUp, Droplets, Thermometer, MapPin, Wheat } from 'lucide-react';
import { toast } from 'sonner';
import PredictionResult from './PredictionResult';
import { CropFormData, PredictionResultType } from '../types/crop';
import { predictCropYield } from '../utils/cropPrediction';

const CropPredictionApp: React.FC = () => {
  const [formData, setFormData] = useState<CropFormData>({
    year: '',
    averageRainfall: '',
    pesticides: '',
    avgTemp: '',
    area: '',
    item: ''
  });
  
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CropFormData>>({});

  const countries = [
    'United States', 'China', 'India', 'Brazil', 'Argentina', 'Russia', 'Ukraine',
    'Australia', 'Canada', 'France', 'Germany', 'Turkey', 'Pakistan', 'Poland',
    'Romania', 'Kazakhstan', 'United Kingdom', 'Italy', 'Spain', 'Mexico'
  ];

  const crops = [
    'Wheat', 'Maize (Corn)', 'Rice', 'Soybeans', 'Barley', 'Sorghum', 'Oats',
    'Millet', 'Rye', 'Sunflower Seed', 'Cotton', 'Sugar Beet', 'Potatoes',
    'Sweet Potatoes', 'Cassava', 'Beans', 'Peas', 'Chickpeas', 'Lentils', 'Groundnuts'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<CropFormData> = {};
    
    if (!formData.year || parseInt(formData.year) < 1990 || parseInt(formData.year) > 2030) {
      newErrors.year = 'Year must be between 1990 and 2030';
    }
    
    if (!formData.averageRainfall || parseFloat(formData.averageRainfall) < 0 || parseFloat(formData.averageRainfall) > 5000) {
      newErrors.averageRainfall = 'Rainfall must be between 0 and 5000 mm';
    }
    
    if (!formData.pesticides || parseFloat(formData.pesticides) < 0) {
      newErrors.pesticides = 'Pesticides must be a positive number';
    }
    
    if (!formData.avgTemp || parseFloat(formData.avgTemp) < -20 || parseFloat(formData.avgTemp) > 50) {
      newErrors.avgTemp = 'Temperature must be between -20°C and 50°C';
    }
    
    if (!formData.area) {
      newErrors.area = 'Please select a country/area';
    }
    
    if (!formData.item) {
      newErrors.item = 'Please select a crop type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CropFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = predictCropYield({
        year: parseInt(formData.year),
        averageRainfall: parseFloat(formData.averageRainfall),
        pesticides: parseFloat(formData.pesticides),
        avgTemp: parseFloat(formData.avgTemp),
        area: formData.area,
        item: formData.item
      });
      
      setPredictionResult(result);
      toast.success('Prediction completed successfully!');
    } catch (error) {
      toast.error('An error occurred during prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      year: '',
      averageRainfall: '',
      pesticides: '',
      avgTemp: '',
      area: '',
      item: ''
    });
    setPredictionResult(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 overflow-x-hidden">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-green-500/20 backdrop-blur-sm rounded-full mr-3 border border-green-400/30">
            <Leaf className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Crop Yield Prediction
          </h1>
        </div>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Predict crop yield production using advanced machine learning algorithms based on environmental factors and agricultural data.
        </p>
      </div>

      <div className="grid xl:grid-cols-2 gap-8 max-w-7xl mx-auto overflow-hidden">
        {/* Input Form */}
        <Card className="shadow-2xl border border-green-500/20 bg-black/40 backdrop-blur-md h-fit">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Enter Crop Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium text-gray-200">
                    Year
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2024"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className={`h-12 bg-white/10 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 ${errors.year ? 'border-red-500' : ''}`}
                  />
                  {errors.year && (
                    <p className="text-red-400 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.year}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall" className="text-sm font-medium text-gray-200 flex items-center">
                    <Droplets className="w-4 h-4 mr-1 text-blue-400" />
                    Average Rainfall (mm/year)
                  </Label>
                  <Input
                    id="rainfall"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 1200.5"
                    value={formData.averageRainfall}
                    onChange={(e) => handleInputChange('averageRainfall', e.target.value)}
                    className={`h-12 bg-white/10 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 ${errors.averageRainfall ? 'border-red-500' : ''}`}
                  />
                  {errors.averageRainfall && (
                    <p className="text-red-400 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.averageRainfall}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pesticides" className="text-sm font-medium text-gray-200">
                    Pesticides (tonnes)
                  </Label>
                  <Input
                    id="pesticides"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 15.5"
                    value={formData.pesticides}
                    onChange={(e) => handleInputChange('pesticides', e.target.value)}
                    className={`h-12 bg-white/10 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 ${errors.pesticides ? 'border-red-500' : ''}`}
                  />
                  {errors.pesticides && (
                    <p className="text-red-400 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.pesticides}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-sm font-medium text-gray-200 flex items-center">
                    <Thermometer className="w-4 h-4 mr-1 text-red-400" />
                    Average Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 25.3"
                    value={formData.avgTemp}
                    onChange={(e) => handleInputChange('avgTemp', e.target.value)}
                    className={`h-12 bg-white/10 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 ${errors.avgTemp ? 'border-red-500' : ''}`}
                  />
                  {errors.avgTemp && (
                    <p className="text-red-400 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.avgTemp}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-sm font-medium text-gray-200 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-orange-400" />
                    Country/Area
                  </Label>
                  <Select value={formData.area} onValueChange={(value) => handleInputChange('area', value)}>
                    <SelectTrigger className={`h-12 bg-white/10 border-gray-600 text-white focus:border-green-500 ${errors.area ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select a country" className="text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country} className="text-white hover:bg-gray-700">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.area && (
                    <p className="text-red-400 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.area}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crop" className="text-sm font-medium text-gray-200 flex items-center">
                    <Wheat className="w-4 h-4 mr-1 text-yellow-400" />
                    Crop Type
                  </Label>
                  <Select value={formData.item} onValueChange={(value) => handleInputChange('item', value)}>
                    <SelectTrigger className={`h-12 bg-white/10 border-gray-600 text-white focus:border-green-500 ${errors.item ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select a crop" className="text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {crops.map((crop) => (
                        <SelectItem key={crop} value={crop} className="text-white hover:bg-gray-700">
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.item && (
                    <p className="text-red-400 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.item}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-4 h-14 text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Predicting...
                    </div>
                  ) : (
                    'Predict Yield'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleReset}
                  className="px-8 h-14 border-gray-500 hover:border-gray-400 text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 text-lg"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Prediction Result */}
        <div className="space-y-6">
          {predictionResult ? (
            <PredictionResult result={predictionResult} />
          ) : (
            <Card className="shadow-2xl border border-blue-500/20 bg-black/40 backdrop-blur-md h-full flex items-center justify-center min-h-[600px]">
              <CardContent className="text-center p-12">
                <div className="mb-6">
                  <TrendingUp className="w-20 h-20 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Ready for Prediction
                </h3>
                <p className="text-gray-300 text-lg max-w-md mx-auto">
                  Fill in the crop parameters and click "Predict Yield" to see the estimated production results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropPredictionApp;