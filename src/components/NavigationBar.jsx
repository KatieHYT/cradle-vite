import React from 'react';
import RegisterButton from './RegisterButton';
import LoginButton from './LoginButton';
import './NavigationBar.css'; // Import the CSS file

function NavigationBar({ onUserUpdate }) {
	  return (
		      <nav className="navbar">
		        <div className="navbar-buttons">
		          <RegisterButton onUserUpdate={onUserUpdate} />
		          <LoginButton />
		        </div>
		      </nav>
		    );
}

export default NavigationBar;
