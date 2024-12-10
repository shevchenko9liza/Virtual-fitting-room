import * as tf from '@tensorflow/tfjs'

export const initTensorFlow = async () => {
  await tf.setBackend('webgl')
  await tf.ready()
  
  // Оптимизация производительности
  tf.env().set('WEBGL_CPU_FORWARD', false)
  tf.env().set('WEBGL_PACK', true)
  tf.env().set('WEBGL_FORCE_F16_TEXTURES', true)
} 