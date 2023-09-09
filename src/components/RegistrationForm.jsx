import React, { useState } from 'react';
import './RegistrationForm.css'; // Import the CSS file
import {REVIEW_API_URL} from '../api_key'; // Import the API key

function RegistrationForm() {
  const [formData, setFormData] = useState({
    api_input: '%register%',
    username: '',
    email: '',
    phonenumber: '',
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
      const response = await fetch(REVIEW_API_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        },
      );

      const responseBody = await response.text(); // Read the response as text
      const parsedResponse = JSON.parse(responseBody);

      if (response.ok) {
	if(parsedResponse.register_status==="successfully_registered"){
          console.log("Successfully Registered")
	}
	else if(parsedResponse.register_status==="username_repeated"){
          console.log("Username repeated")
	}
        // Handle successful registration here
      } else {
        // Handle registration error here
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Registration Form</h2>
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
          <label>Email:</label>
          <input
	    className="gray-background"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
	    className="gray-background"
            type="phonenumber"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" className="gray-button">Register</button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;

