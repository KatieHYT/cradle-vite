import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({
    txt: "%petfriendly%  Faherty San Francisco",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const backendURL = 'https://76cf-140-112-41-151.ngrok-free.app/petlover/callback'; // Replace this with your actual backend URL
    console.log("what I post:", formData)
    axios.post(backendURL, formData)
      .then(response => {
        // Handle the response from the backend
        console.log('Response:', response.data);
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1>Contact Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="txt">Text:</label>
        <input type="text" id="txt" name="txt" value={formData.txt} onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
