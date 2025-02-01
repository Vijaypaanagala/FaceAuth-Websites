import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import '../styles/LoginE.css';

function LoginE() {
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function HandleLogin() {
    const payload = { email, password };
    try {
      setLoading(true); // Start loading spinner
      const response = await axios.post(
        "https://faceauth-r2l1.onrender.com/user/login",
        payload
      );
      setLoading(false); // Stop loading spinner
      localStorage.setItem("userEmail", response.data.user.email);
      localStorage.setItem("userName", response.data.user.name);
      navigate("/Home");
      window.location.reload();
    } catch (err) {
      setLoading(false); 
      setError(err.response?.data?.error || "An error occurred");
    }
  }

  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          id="email"
          name="email"
          className="login-input"
          placeholder="Email"
          onChange={(e) => setemail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          id="password"
          name="password"
          className="login-input"
          placeholder="Password"
          onChange={(e) => setpass(e.target.value)}
          autoComplete="current-password"
        />
        {error && <div className="login-error">{error}</div>}
        <button className="login-button" onClick={HandleLogin} disabled={loading}>
          {loading ? <FontAwesomeIcon icon={faSpinner} spin size="lg" /> : "Login"}
        </button>

        {/* Face Authentication Box */}
        <p style={{marginTop:'15px',marginBottom:'-5px'}}>or</p>
        <div className="face-auth-box" >
          <FontAwesomeIcon icon={faFaceSmile} className="face-auth-icon" />
          <Link to="/face">
          <span className="face-auth-text">Login with Face Authentication</span>
          </Link>
          
        </div>

        <p style={{ marginTop: "20px" }} id="navtosignup">
          Don't have an account? <Link to="/">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginE;
