import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import CropPredictionApp from './components/CropPredictionApp';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
      <CropPredictionApp />
      <Toaster />
    </div>
  );
}

export default App;