import React from 'react';
import RegisterButton from './RegisterButton';
import LoginButton from './LoginButton';
import './NavigationBar.css'; // Import the CSS file

function NavigationBar() {
	  return (
		      <nav className="navbar">
		        <div className="navbar-buttons">
		          <RegisterButton />
		          <LoginButton />
		        </div>
		      </nav>
		    );
}

export default NavigationBar;
