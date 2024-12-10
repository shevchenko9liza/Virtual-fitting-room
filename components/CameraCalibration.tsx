'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, Camera } from 'lucide-react'

interface CalibrationStep {
  id: number
  title: string
  instruction: string
  duration: number
}

interface CameraCalibrationProps {
  onCalibrationComplete: () => void
  onError?: (error: string) => void
  className?: string
}

const CALIBRATION_STEPS: CalibrationStep[] = [
  {
    id: 1,
    title: 'Подготовка',
    instruction: 'Встаньте прямо перед камерой на расстоянии 2-3 метров',
    duration: 3000,
  },
  {
    id: 2,
    title: 'Поза T',
    instruction: 'Поднимите руки в стороны, образуя букву T',
    duration: 3000,
  },
  {
    id: 3,
    title: 'Вращение',
    instruction: 'Медленно повернитесь на 360 градусов',
    duration: 5000,
  },
  {
    id: 4,
    title: 'Завершение',
    instruction: 'Вернитесь в исходное положение',
    duration: 2000,
  },
]

const CameraCalibration: React.FC<CameraCalibrationProps> = ({
  onCalibrationComplete,
  onError,
  className
}) => {
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage)
    onError?.(errorMessage)
    setIsCalibrating(false)
    setCurrentStep(0)
    setProgress(0)
  }, [onError])

  const startCalibration = async () => {
    setIsCalibrating(true)
    setError(null)
    setCurrentStep(0)
    setProgress(0)

    try {
      for (let i = 0; i < CALIBRATION_STEPS.length; i++) {
        setCurrentStep(i)
        
        // Имитация процесса калибровки
        await new Promise<void>((resolve) => {
          const step = CALIBRATION_STEPS[i]
          const startTime = Date.now()
          
          const updateProgress = () => {
            const elapsed = Date.now() - startTime
            const stepProgress = Math.min(100, (elapsed / step.duration) * 100)
            const totalProgress = ((i * 100) + stepProgress) / CALIBRATION_STEPS.length
            setProgress(totalProgress)

            if (elapsed < step.duration) {
              requestAnimationFrame(updateProgress)
            } else {
              resolve()
            }
          }

          requestAnimationFrame(updateProgress)
        })
      }

      setProgress(100)
      onCalibrationComplete()
    } catch (err) {
      handleError('Ошибка калибровки. Пожалуйста, попробуйте снова.')
    } finally {
      setIsCalibrating(false)
    }
  }

  useEffect(() => {
    return () => {
      setIsCalibrating(false)
      setCurrentStep(0)
      setProgress(0)
    }
  }, [])

  const currentStepData = CALIBRATION_STEPS[currentStep]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Калибровка камеры
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {isCalibrating ? (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentStepData.instruction}
                </p>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(progress)}%
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Для точного определения размеров необходимо выполнить калибровку камеры.
                Следуйте инструкциям на экране.
              </p>
              <Button
                onClick={startCalibration}
                className="w-full"
                disabled={isCalibrating}
              >
                Начать калибровку
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CameraCalibration
