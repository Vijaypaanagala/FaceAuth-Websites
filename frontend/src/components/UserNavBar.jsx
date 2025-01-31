import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/UserNavBar.css'; // Import the CSS file

function UserNavBar() {
  const [userEmail, setuserEmail] = useState(null);
  useEffect(() => {
    const curUser = localStorage.getItem('userEmail');
    if (curUser) {
      setuserEmail(curUser);
    }
  }, []);

  const logouthandle = () => {
    setuserEmail(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand">FitFoods</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link active" aria-current="page">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/items" className="nav-link">
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/restaurant" className="nav-link">
                Add your Food
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/cart/${userEmail}`} className="nav-link">
                Cart
              </Link>
            </li>
            {userEmail ? (
              <>
                <li className="nav-item">
                  <span className="nav-link nav-user-email">{userEmail}</span>
                </li>
                <li className="nav-item">
                  <button
                    onClick={logouthandle}
                    className="nav-link nav-logout-btn"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserNavBar;