import React, { useState, useEffect } from 'react';
import UserNavBar from './UserNavBar';

function Home() {
  const [userName, setName] = useState('');
  const [userEmail, setEmail] = useState('');
  const [videoStream, setVideoStream] = useState(null);  

  useEffect(() => {
    
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null); 
    }

    
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    
    if (storedUserName) {
      setName(storedUserName);
    }
    if (storedUserEmail) {
      setEmail(storedUserEmail);
    }
  }, []); 

  return (
    <div>
      <UserNavBar/>
      <h2 style={{ 
  color: "rgb(76, 79, 83);", 
  fontSize: "2rem", 
  fontWeight: "bold", 
  textAlign: "center", 
  marginTop: "20px" 
}}>
  Welcome back, {userName}
</h2>

<p style={{ 
  color: "rgb(63, 64, 64)", 
  fontSize: "1.2rem", 
  textAlign: "center", 
  marginTop: "10px" 
}}>
  Your Email: {userEmail}
</p>

    </div>
  );
}

export default Home;
