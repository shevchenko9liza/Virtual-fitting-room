interface Keypoint {
  x: number;
  y: number;
  z?: number;
  score?: number;
}

interface Measurements {
  shoulders: number;
  chest: number;
  waist: number;
  hips: number;
  height: number;
}

export const calculateDistance = (point1: Keypoint, point2: Keypoint): number => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2) + 
    (point1.z && point2.z ? Math.pow(point2.z - point1.z, 2) : 0)
  );
};

export const calculateMeasurements = (keypoints: Record<string, Keypoint>): Measurements => {
  const PIXEL_TO_CM_RATIO = 0.2645833333; // Примерный коэффициент для конвертации пикселей в см

  const shouldersWidth = calculateDistance(keypoints.leftShoulder, keypoints.rightShoulder);
  const chestWidth = calculateDistance(keypoints.leftShoulder, keypoints.rightShoulder) * 1.2;
  const waistWidth = calculateDistance(keypoints.leftHip, keypoints.rightHip) * 0.9;
  const hipsWidth = calculateDistance(keypoints.leftHip, keypoints.rightHip) * 1.15;
  const height = calculateDistance(keypoints.nose, keypoints.leftAnkle) * 1.1;

  return {
    shoulders: shouldersWidth * PIXEL_TO_CM_RATIO,
    chest: chestWidth * PIXEL_TO_CM_RATIO,
    waist: waistWidth * PIXEL_TO_CM_RATIO,
    hips: hipsWidth * PIXEL_TO_CM_RATIO,
    height: height * PIXEL_TO_CM_RATIO
  };
}; 