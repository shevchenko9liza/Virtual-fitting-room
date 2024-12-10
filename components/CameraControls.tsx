'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Camera, CameraOff, RefreshCw } from 'lucide-react'

interface CameraControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>
  onCameraReady?: () => void
  onCameraError?: (error: string) => void
}

const CameraControls: React.FC<CameraControlsProps> = ({
  videoRef,
  onCameraReady,
  onCameraError
}) => {
  const [isActive, setIsActive] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsActive(true)
        onCameraReady?.()
      }
    } catch (err) {
      const error = 'Ошибка доступа к камере'
      onCameraError?.(error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsActive(false)
    }
  }

  const toggleCamera = () => {
    if (isActive) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  const switchCamera = () => {
    stopCamera()
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [facingMode])

  return (
    <div className="flex gap-2">
      <Button
        variant={isActive ? "destructive" : "default"}
        size="icon"
        onClick={toggleCamera}
      >
        {isActive ? <CameraOff /> : <Camera />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={switchCamera}
        disabled={!isActive}
      >
        <RefreshCw />
      </Button>
    </div>
  )
}

export default CameraControls 