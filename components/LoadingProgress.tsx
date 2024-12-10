'use client'

import React from 'react'

interface LoadingProgressProps {
  progress: number
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ progress }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
      <div className="text-center">
        <div className="w-48 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
