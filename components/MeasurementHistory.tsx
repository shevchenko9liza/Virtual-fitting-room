import React from 'react';
import { Card } from './ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MeasurementHistoryProps {
  measurements: Array<{
    date: string;
    measurements: {
      shoulders: number;
      chest: number;
      waist: number;
      hips: number;
      height: number;
    };
  }>;
}

export const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({ measurements }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">История измерений</h3>
      <div className="space-y-2">
        {measurements.map((entry, index) => (
          <div key={index} className="border-b pb-2">
            <p className="text-sm text-gray-500">
              {format(new Date(entry.date), 'PPP', { locale: ru })}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Обхват груди: {entry.measurements.chest.toFixed(1)} см</p>
              <p>Обхват талии: {entry.measurements.waist.toFixed(1)} см</p>
              <p>Обхват бедер: {entry.measurements.hips.toFixed(1)} см</p>
              <p>Рост: {entry.measurements.height.toFixed(1)} см</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}; 