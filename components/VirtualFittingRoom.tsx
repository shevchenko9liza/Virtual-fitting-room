'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Card } from './ui/card'
import { Alert } from './ui/alert'
import ThreeScene from './ThreeScene'
import HumanBodyTracking from './HumanBodyTracking'
import CameraControls from './CameraControls'
import BodyMeasurements from './BodyMeasurements'
import { initTensorFlow } from '@/lib/tfjs-config'
import { LoadingSpinner } from './LoadingSpinner'
import { Instructions } from './Instructions'
import { useMeasurements } from '../hooks/useMeasurements'
import { calculateMeasurements } from '../lib/measurements'

// Добавляем типы для одежды
interface ClothingMeasurements {
  chest: number
  waist: number
  hips: number
}

interface ClothingItem {
  id: string
  name: string
  model: string
  sizes: string[]
  defaultColor: string
  measurements: Record<string, ClothingMeasurements>
}

const AVAILABLE_CLOTHES = [
  {
    id: 'tshirt',
    name: 'Футболка',
    model: '/models/clothes/tshirt.glb',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    defaultColor: '#ffffff',
    measurements: {
      XS: { chest: 86, waist: 70, hips: 94 },
      S:  { chest: 90, waist: 74, hips: 98 },
      M:  { chest: 94, waist: 78, hips: 102 },
      L:  { chest: 98, waist: 82, hips: 106 },
      XL: { chest: 102, waist: 86, hips: 110 },
    }
  },
  {
    id: 'dress',
    name: 'Платье',
    model: '/models/clothes/dress.glb',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    defaultColor: '#000000',
    measurements: {
      XS: { chest: 86, waist: 70, hips: 94 },
      S:  { chest: 90, waist: 74, hips: 98 },
      M:  { chest: 94, waist: 78, hips: 102 },
      L:  { chest: 98, waist: 82, hips: 106 },
      XL: { chest: 102, waist: 86, hips: 110 },
    }
  },
  {
    id: 'jacket',
    name: 'Куртка',
    model: '/models/clothes/jacket.glb',
    sizes: ['S', 'M', 'L', 'XL'],
    defaultColor: '#2b2b2b',
    measurements: {
      S: { chest: 90, waist: 74, hips: 98 },
      M: { chest: 94, waist: 78, hips: 102 },
      L: { chest: 98, waist: 82, hips: 106 },
      XL: { chest: 102, waist: 86, hips: 110 },
    }
  }
]

const VirtualFittingRoom: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [measurements, setMeasurements] = useState<{
    shoulders: number
    chest: number
    waist: number
    hips: number
    height: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isInitializing, setIsInitializing] = useState(true)
  const { savedMeasurements, saveMeasurements } = useMeasurements()

  useEffect(() => {
    const init = async () => {
      try {
        await initTensorFlow()
      } catch (err) {
        setError('Ошибка инициализации: ' + (err as Error).message)
      } finally {
        setIsInitializing(false)
      }
    }
    init()
  }, [])

  const handlePoseDetected = useCallback((pose: any) => {
    if (!pose || !pose.keypoints) return
    
    try {
      const newMeasurements = calculateMeasurements(pose.keypoints)
      setMeasurements(newMeasurements)
      saveMeasurements(newMeasurements)
    } catch (err) {
      setError('Ошибка расчета измерений: ' + (err as Error).message)
    }
  }, [saveMeasurements])

  if (isInitializing) {
    return <LoadingSpinner message="Инициализация системы..." />
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Instructions />
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <CameraControls
                videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                onCameraError={setError}
              />
            </div>
          </div>
          <div className="relative min-h-[400px]">
            <ThreeScene
              modelUrl="/models/clothing.glb"
              color="#ffffff"
              scale={1}
              onLoadError={setError}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BodyMeasurements measurements={measurements} />
        {error && (
          <div className="col-span-full">
            <Alert variant="destructive">
              <p>{error}</p>
            </Alert>
          </div>
        )}
      </div>
      <HumanBodyTracking
        videoRef={videoRef as React.RefObject<HTMLVideoElement>}
        onPoseDetected={handlePoseDetected}
        onTrackingError={setError}
      />
    </div>
  )
}

export default VirtualFittingRoom