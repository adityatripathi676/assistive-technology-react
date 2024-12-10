import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

function ObjectDetection({ onDetect }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Load COCO-SSD model
    const loadModel = async () => {
      const loadedModel = await cocossd.load();
      setModel(loadedModel);
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (!model) return;

    const startWebcam = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };

    startWebcam();
  }, [model]);

  useEffect(() => {
    const detectObjects = async () => {
      if (!model || !videoRef.current) return;

      const predictions = await model.detect(videoRef.current);
      
      // Draw predictions on canvas
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      predictions.forEach(prediction => {
        const [x, y, width, height] = prediction['bbox'];
        
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = 'red';
        ctx.fillText(
          `${prediction.class} ${Math.round(prediction.score * 100)}%`, 
          x, 
          y > 10 ? y - 5 : 10
        );
      });

      // Notify parent component
      onDetect(predictions.map(p => ({
        label: p.class,
        confidence: p.score
      })));
    };

    const intervalId = setInterval(detectObjects, 1000);
    return () => clearInterval(intervalId);
  }, [model, onDetect]);

  return (
    <div className="object-detection">
      <h2>Object Detection</h2>
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        width={640} 
        height={480}
        style={{ display: 'none' }}
      />
      <canvas 
        ref={canvasRef} 
        width={640} 
        height={480}
      />
    </div>
  );
}

export default ObjectDetection;