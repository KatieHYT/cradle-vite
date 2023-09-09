import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm'

function LoginButton({ onUserUpdate }) {
   const [showLogin, setShowLogin] = useState(false);
   const toggleLogin = () => {
       setShowLogin(!showLogin);
     };
  // Add your login button UI here
    return (
        <div>
	    <button onClick={toggleLogin}>Login</button>
	   {showLogin && <LoginForm onClose={toggleLogin} onUserUpdate={onUserUpdate}/>} 
    </div>      
    );

                  }

                  export default LoginButton;
