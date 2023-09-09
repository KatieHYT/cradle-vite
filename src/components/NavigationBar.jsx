import React, { useState, useEffect } from 'react';
import RegisterButton from './RegisterButton';
import LoginButton from './LoginButton';
import './NavigationBar.css'; // Import the CSS file

function NavigationBar() {
  const [user, setUser] = useState(null);

  const handleUserUpdate = (newUser) => {
    setUser(newUser);
  };
	  return (
		      <nav className="navbar">
		        <div className="navbar-buttons">
                        {user ? (
                              <div className="welcome-message">Hi {user}</div>
                            ) : (
			      <div>
		              <RegisterButton onUserUpdate={handleUserUpdate} />
		              <LoginButton />
			      </div>
                            )}
		        </div>
		      </nav>
		    );
}

export default NavigationBar;
