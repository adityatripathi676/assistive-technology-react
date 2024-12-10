import React, { useRef, useEffect, useState } from 'react';
import * as handpose from '@mediapipe/hands';
import * as drawingUtils from '@mediapipe/drawing_utils';

function GestureRecognition({ onDetect }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hands, setHands] = useState(null);

  useEffect(() => {
    const initializeHands = async () => {
      const handsInstance = new handpose.Hands({
        locateFile: (file) => 
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      handsInstance.setOptions({
        maxNumHands: 2,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      handsInstance.onResults(handleResults);
      setHands(handsInstance);
    };

    initializeHands();
  }, []);

  const handleResults = (results) => {
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiHandLandmarks) {
      const detectedGestures = [];

      results.multiHandLandmarks.forEach((landmarks) => {
        // Draw landmarks
        drawingUtils.drawLandmarks(canvasCtx, landmarks, {
          color: 'red',
          radius: 4
        });

        // Basic gesture recognition logic
        const gesture = recognizeGesture(landmarks);
        detectedGestures.push(gesture);
      });

      onDetect(detectedGestures);
    }
  };

  const recognizeGesture = (landmarks) => {
    // Simple gesture recognition based on finger positions
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) + 
      Math.pow(thumbTip.y - indexTip.y, 2)
    );

    if (distance < 0.1) return 'Pinch';
    return 'Open Hand';
  };

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const camera = new handpose.Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480
      });
      camera.start();
    };

    if (hands) startCamera();
  }, [hands]);

  return (
    <div className="gesture-recognition">
      <h2>Gesture Recognition</h2>
      <video 
        ref={videoRef} 
        style={{ display: 'none' }} 
        width={640} 
        height={480} 
      />
      <canvas 
        ref={canvasRef} 
        width={640} 
        height={480} 
      />
    </div>
  );
}

export default GestureRecognition;