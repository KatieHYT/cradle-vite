import React, { useState, useEffect } from 'react';
import RegisterButton from './RegisterButton';
import LoginButton from './LoginButton';

function NavigationBar() {
  const [user, setUser] = useState(null);

  const handleUserUpdate = (newUser) => {
    setUser(newUser);
  };
	  return ( <div>
                        {user ? (
                              <div className="welcome-message">Hi {user}</div>
                            ) : (
			      <div>
		              <RegisterButton onUserUpdate={handleUserUpdate} />
		              <LoginButton onUserUpdate={handleUserUpdate}/>
			      </div>
                            )}
		  </div>
		    );
}

export default NavigationBar;
