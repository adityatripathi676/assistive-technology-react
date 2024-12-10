import React, { useState } from 'react';
import ObjectDetection from './components/ObjectDetection/ObjectDetection';
import SpeechRecognition from './components/SpeechRecognition/SpeechRecognition';
import GestureRecognition from './components/GestureRecognition/GestureRecognition';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import TextRecognition from './components/TextRecognition/TextRecognition';

function App() {
  const [recognitionResults, setRecognitionResults] = useState({
    objects: [],
    speech: '',
    gestures: [],
    faces: [],
    text: ''
  });

  const handleRecognitionUpdate = (type, data) => {
    setRecognitionResults(prev => ({
      ...prev,
      [type]: data
    }));
  };

  return (
    <div className="assistive-technology-app">
      <h1>Assistive Technology Application</h1>
      
      <div className="recognition-grid">
        <ObjectDetection onDetect={(objects) => handleRecognitionUpdate('objects', objects)} />
        <SpeechRecognition onRecognize={(speech) => handleRecognitionUpdate('speech', speech)} />
        <GestureRecognition onDetect={(gestures) => handleRecognitionUpdate('gestures', gestures)} />
        <FaceRecognition onRecognize={(faces) => handleRecognitionUpdate('faces', faces)} />
        <TextRecognition onExtract={(text) => handleRecognitionUpdate('text', text)} />
      </div>

      <div className="recognition-results">
        <h2>Recognition Results</h2>
        <div>
          <h3>Objects Detected</h3>
          <ul>
            {recognitionResults.objects.map((obj, index) => (
              <li key={index}>{obj.label} (Confidence: {obj.confidence})</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Speech Recognized</h3>
          <p>{recognitionResults.speech}</p>
        </div>
        <div>
          <h3>Gestures</h3>
          <ul>
            {recognitionResults.gestures.map((gesture, index) => (
              <li key={index}>{gesture}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Faces Recognized</h3>
          <ul>
            {recognitionResults.faces.map((face, index) => (
              <li key={index}>{face.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Extracted Text</h3>
          <p>{recognitionResults.text}</p>
        </div>
      </div>
    </div>
  );
}

export default App;