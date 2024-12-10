import { useState, useEffect } from 'react';

interface SavedMeasurements {
  date: string;
  measurements: {
    shoulders: number;
    chest: number;
    waist: number;
    hips: number;
    height: number;
  };
}

export const useMeasurements = () => {
  const [savedMeasurements, setSavedMeasurements] = useState<SavedMeasurements[]>([]);

  useEffect(() => {
    const loaded = localStorage.getItem('userMeasurements');
    if (loaded) {
      setSavedMeasurements(JSON.parse(loaded));
    }
  }, []);

  const saveMeasurements = (measurements: SavedMeasurements['measurements']) => {
    const newMeasurements = [
      ...savedMeasurements,
      {
        date: new Date().toISOString(),
        measurements
      }
    ];
    localStorage.setItem('userMeasurements', JSON.stringify(newMeasurements));
    setSavedMeasurements(newMeasurements);
  };

  return { savedMeasurements, saveMeasurements };
}; 