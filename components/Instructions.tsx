import React from 'react';
import { Card } from './ui/card';

export const Instructions: React.FC = () => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Как пользоваться виртуальной примерочной:</h3>
      <ol className="list-decimal list-inside space-y-2">
        <li>Встаньте перед камерой на расстоянии 2-3 метров</li>
        <li>Убедитесь, что ваше тело полностью видно в кадре</li>
        <li>Поднимите руки в стороны для точного измерения</li>
        <li>Подождите, пока система выполнит измерения</li>
        <li>Выберите одежду и размер из доступных опций</li>
        <li>Используйте цветовую палитру для изменения цвета</li>
      </ol>
    </Card>
  );
}; 