'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Measurements {
  shoulders: number
  chest: number
  waist: number
  hips: number
  height: number
}

interface BodyMeasurementsProps {
  measurements: Measurements | null
  isLoading?: boolean
}

const MeasurementItem = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold tracking-tight">{value.toFixed(1)} см</p>
  </div>
)

const BodyMeasurements: React.FC<BodyMeasurementsProps> = ({ 
  measurements, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Измерения тела</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[60px]" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!measurements) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Измерения тела</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Встаньте перед камерой для определения размеров
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Измерения тела</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <MeasurementItem label="Плечи" value={measurements.shoulders} />
          <MeasurementItem label="Грудь" value={measurements.chest} />
          <MeasurementItem label="Талия" value={measurements.waist} />
          <MeasurementItem label="Бедра" value={measurements.hips} />
          <div className="col-span-2">
            <MeasurementItem label="Рост" value={measurements.height} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BodyMeasurements
