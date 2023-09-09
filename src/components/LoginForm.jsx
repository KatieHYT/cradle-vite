import React, { useState } from 'react';
import {REVIEW_API_URL} from '../api_key'; // Import the API key

function LoginForm({ onUserUpdate }) {
  const [formData, setFormData] = useState({
    api_input: '%login%',
    username: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your authentication endpoint
      const response = await fetch(REVIEW_API_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const responseBody = await response.text(); // Read the response as text
      const parsedResponse = JSON.parse(responseBody);

      if (response.ok) {
        // Handle successful login here
	if(parsedResponse.login_status==="username_exist"){
          console.log("Successfully Log in")
          onUserUpdate(formData.username);
	}
	else if(parsedResponse.login_status==="username_not_exist"){
          alert("Username not exist..");
	}
      } else {
        // Handle login error here
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
	    className="gray-background"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" className="gray-button">Login</button>
        </div>
      </form>
    </div>
  );
  // ...
}

export default LoginForm;
