import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermissions = async () => {
      const permissions = await navigator.permissions.query({ name: 'camera' });
      if (permissions.state === 'denied') {
        alert('Please allow camera access to proceed.');
      }
    };
    checkPermissions();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/weights'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/weights'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/weights'),
        ]);
        
        setIsLoading(false);
        startVideo(); // Start video after models are loaded
      } catch (error) {
       
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }
      }, 500);
    } catch (err) {
      
      alert("Webcam access denied.");
    }
  };

  useEffect(() => {
    const detectFace = async () => {
      if (isLoading || !videoRef.current || !canvasRef.current) return;
      if (videoRef.current.readyState !== 4) return; // Ensure video is ready

      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors();


      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        const faceDescriptor = detections[0].descriptor;

        // Send to backend only if a face is detected and not already sent
        if (!faceDetected) {
          setFaceDetected(true); // Prevent multiple API calls
          handleLogin(Array.from(faceDescriptor)); // Convert Float32Array to regular array
        }
      } else {
        setFaceDetected(false); // Reset if face is not detected
      }
    };

    const interval = setInterval(detectFace, 1000);
    return () => clearInterval(interval);
  }, [isLoading, faceDetected]);

  const handleLogin = async (faceDescriptor) => {
    try {
    
      const response = await axios.post('http://localhost:3000/user/login', { faceDescriptor });

      if (response.status === 200) {
       
        localStorage.setItem("userEmail",response.data.user.email)
        localStorage.setItem("userName",response.data.user.name)
      
        navigate('/home');
        window.location.reload();
      } else {
        alert(`❌ Login failed: ${response.data.error}`);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      
      {isLoading ? (
        <center><p className='register-loading-text'>Loading...</p></center>
        
      ) : (
        <>
        <center> <h2 style={{marginTop:'30px',marginBottom:'20px'}}>Login with Face</h2>
        <p register-loading-text>Detecting....</p>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <video ref={videoRef} width="640" height="480" autoPlay muted style={{ border: '2px solid black' }} />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
        </center>
        </>
      )}
    </div>
  );
};

export default Login;
