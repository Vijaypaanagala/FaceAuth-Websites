import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Login from './components/Login';
import LoginE from './components/LoginE';
import Register from './components/Register';
import { Routes, Route, Navigate } from "react-router-dom";
import UserNavBar from './components/UserNavBar';

function App() {
  return (
    <>
    
      <Routes>
        {/* Redirect from "/" to "/Login" */}
        <Route path="/" element={<Register/>} />
        <Route path="/login" element={<LoginE/>} />
        <Route path="/face" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        
      </Routes>
    </>
  );
}

export default App;
