'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ClothingCardProps {
  item: typeof AVAILABLE_CLOTHES[0]
  onSelect: (item: typeof AVAILABLE_CLOTHES[0]) => void
  isSelected?: boolean
}

const ClothingCard: React.FC<ClothingCardProps> = ({ item, onSelect, isSelected }) => {
  return (
    <Card className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap mb-4">
          {item.sizes.map(size => (
            <div
              key={size}
              className="px-2 py-1 bg-muted rounded text-sm"
            >
              {size}
            </div>
          ))}
        </div>
        <Button 
          className="w-full"
          onClick={() => onSelect(item)}
          variant={isSelected ? "secondary" : "default"}
        >
          {isSelected ? 'Выбрано' : 'Примерить'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default ClothingCard 