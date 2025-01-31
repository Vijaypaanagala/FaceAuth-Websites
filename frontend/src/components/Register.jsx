import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import cam from "../assets/cam.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faFaceSmile } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/weights"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/weights"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/weights"),
        ]);
        console.log("Face-api.js models loaded successfully");
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading face-api.js models:", error);
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const startVideo = async () => {
    if (isVideoOn) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsVideoOn(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Webcam access denied.");
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || faceCaptured) return;

    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptors();

    console.log("Detections:", detections);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    if (detections.length > 0) {
      setFaceDescriptor(Object.values(detections[0].descriptor));
      setFaceCaptured(true);
      alert("Face captured successfully!");
    } else {
      alert("No face detected, please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) {
      alert("Face recognition models are still loading. Please wait.");
      return;
    }

    if (!name || !email || !password || !faceDescriptor) {
      alert("Please provide all fields and ensure face is detected!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/register", {
        name,
        email,
        password,
        faceDescriptor,
      });

      if (response.status === 201) {
        console.log(response.data);
        navigate("/login");
      } else {
        alert(`Registration failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('❌ Error during login:', error);
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <>
      {isLoading ? (
        <center><p className="register-loading-text">Loading....</p></center>
        
      ) : (
        <div className="register-conts">
        <div className="register-container">
          <h2 className="register-heading">Sign Up</h2>

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              className="register-input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="register-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="register-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faFaceSmile} className="face-auth-icon" />
            <label className="register-face-label">Add Face Credentials for Secure Login</label>
            <div className="register-video-container">
              <video
                ref={videoRef}
                width="640"
                height="480"
                autoPlay
                muted
                className={`register-video ${isVideoOn ? "active" : ""}`}
              />
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className={`register-canvas ${isVideoOn ? "active" : ""}`}
              />
              {!isVideoOn && <img src={cam} alt="Camera Icon" />}
            </div>

            {!isVideoOn && (
              <button className="register-button" type="button" onClick={startVideo}>
                Start Video
              </button>
            )}
            {isVideoOn && !faceCaptured && (
              <button className="register-button" type="button" onClick={detectFace}>
                Capture Face
              </button>
            )}
            {faceCaptured && <p  className="face-captured-text">Face captured successfully!</p>}

            <button className="register-submit-button" type="submit">
              Register
            </button>
            <p style={{ marginTop: "20px" }} id="navtosignin">
          Already have an account? <Link to="/login">Login</Link>
        </p>
          </form>
        </div>
        </div>
      )}
    </>
  );
};

export default Register;
