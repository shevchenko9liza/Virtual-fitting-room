'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'
import { Alert } from './ui/alert'

interface HumanBodyTrackingProps {
  videoRef: React.RefObject<HTMLVideoElement>
  onPoseDetected: (pose: poseDetection.Pose) => void
  onTrackingError?: (error: string) => void
}

const HumanBodyTracking: React.FC<HumanBodyTrackingProps> = ({
  videoRef,
  onPoseDetected,
  onTrackingError
}) => {
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        const model = poseDetection.SupportedModels.BlazePose
        const detectorConfig = {
          runtime: 'tfjs',
          modelType: 'full',
          enableSmoothing: true,
          enableSegmentation: true,
          smoothSegmentation: true,
          refineLandmarks: true
        }
        detectorRef.current = await poseDetection.createDetector(model, detectorConfig)
      } catch (err) {
        const errorMessage = 'Ошибка инициализации отслеживания тела'
        setError(errorMessage)
        onTrackingError?.(errorMessage)
      }
    }

    initializeDetector()
  }, [onTrackingError])

  useEffect(() => {
    if (!videoRef.current || !detectorRef.current) return

    let animationFrame: number
    let isTracking = true

    const detectPose = async () => {
      if (!isTracking) return

      try {
        if (videoRef.current && detectorRef.current) {
          const poses = await detectorRef.current.estimatePoses(videoRef.current, {
            flipHorizontal: false,
            maxPoses: 1,
            scoreThreshold: 0.5
          })
          
          if (poses.length > 0) {
            onPoseDetected(poses[0])
          }
        }
      } catch (err) {
        console.error('Ошибка отслеживания:', err)
      }

      animationFrame = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      isTracking = false
      cancelAnimationFrame(animationFrame)
    }
  }, [videoRef, onPoseDetected])

  if (error) {
    return (
      <Alert variant="destructive">
        <p>{error}</p>
      </Alert>
    )
  }

  return null
}

export default HumanBodyTracking 