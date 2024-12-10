'use client'

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as poseDetection from '@tensorflow-models/pose-detection'
import { LoadingProgress } from './LoadingProgress'
import { GLTFLoader } from 'three-stdlib/loaders/GLTFLoader'
import { useSpring, animated } from '@react-spring/three'

interface ThreeSceneProps {
  modelUrl: string
  color: string
  scale: number
  onLoadProgress?: (progress: number) => void
  onLoadError?: (error: string) => void
}

const Model = ({ url, color, scale }: { url: string; color: string; scale: number }) => {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0))

  const springs = useSpring({
    scale: [scale, scale, scale],
    config: { mass: 1, tension: 280, friction: 60 }
  })

  useEffect(() => {
    if (!modelRef.current) return

    const model = modelRef.current
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        
        if (!(child.material instanceof THREE.MeshStandardMaterial) || 
            child.material.color.getHexString() !== color.replace('#', '')) {
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.7,
            metalness: 0.3
          })
          child.material.dispose()
          child.material = material
        }
      }
    })

    return () => {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            child.material.dispose()
          }
          if (child.geometry) {
            child.geometry.dispose()
          }
        }
      })
    }
  }, [color, scene])

  useFrame(() => {
    if (!modelRef.current) return
    modelRef.current.position.lerp(targetPosition.current, 0.1)
    modelRef.current.scale.setScalar(scale)
  })

  return <animated.primitive ref={modelRef} object={scene} scale={springs.scale} />
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  modelUrl,
  color,
  scale,
  onLoadProgress,
  onLoadError
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const loaderRef = useRef<THREE.LoadingManager | null>(null)

  useEffect(() => {
    loaderRef.current = new THREE.LoadingManager()
    const loader = loaderRef.current

    loader.onProgress = (_, loaded, total) => {
      if (total > 0) {
        const progress = Math.min((loaded / total) * 100, 100)
        setLoadProgress(progress)
        onLoadProgress?.(progress)
      }
    }

    loader.onLoad = () => {
      setIsLoading(false)
      setLoadProgress(100)
    }

    loader.onError = (url) => {
      setIsLoading(false)
      onLoadError?.(`Ошибка загрузки: ${url}`)
    }

    const gltfLoader = new GLTFLoader(loader)
    gltfLoader.load(modelUrl, undefined, undefined, (error) => {
      onLoadError?.(`Ошибка загрузки модели: ${error.message}`);
    })

    return () => {
      if (loaderRef.current) {
        loaderRef.current.onProgress = () => {}
        loaderRef.current.onLoad = () => {}
        loaderRef.current.onError = () => {}
      }
      useGLTF.clear(modelUrl)
    }
  }, [modelUrl, onLoadProgress, onLoadError])

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {isLoading && <LoadingProgress progress={loadProgress} />}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        gl={{ 
          preserveDrawingBuffer: true,
          shadowMap: { enabled: true }
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          castShadow
          intensity={1}
          shadow-bias={-0.0001}
          shadow-mapSize={[2048, 2048]}
        />
        <Model url={modelUrl} color={color} scale={scale} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  )
}

export default ThreeScene;