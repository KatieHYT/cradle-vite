import React, { useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

const API_URL = "https://4e01-140-112-41-151.ngrok-free.app/petlover/callback";

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeId, setPlaceId] = useState('');
  let controller = null; // Store the AbortController instance
  controller = new AbortController();
  const signal = controller.signal;

  const handlePlaceSelect = (place) => {
    console.log('place: '+place);
    setSelectedPlace(place);
    setPlaceId(place.place_id);
  };

  const displayDetail = (autocomplete) => {
    controller = new AbortController(); // Create a new AbortController instance
    const signal = controller.signal;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.place_id) return;
      handlePlaceSelect(place);
    });
  }

const generate = async () => {
  // Alert the user if no prompt value
  if (!placeId) {
    alert("Please enter a place.");
    return;
  }

  // Disable the generate button and enable the stop button
  generateBtn.disabled = true;
  stopBtn.disabled = false;
  resultText.innerText = "Sniffing...";

  // Create a new AbortController instance
  controller = new AbortController();
  const signal = controller.signal;

  try {
    // Fetch the response from the OpenAI API with the signal from AbortController
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        txt: "%petfriendly%"+placeId ,
      }),
      signal, // Pass the signal to the fetch request
    });

    // Read the response as a stream of data
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    resultText.innerText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      // Massage and parse the chunk of data
      const chunk = decoder.decode(value);
      const parsedLines = chunk.split("\n");

      for (const parsedLine of parsedLines) {
        if (parsedLine) {
          resultText.innerText += parsedLine;
        }
      }
    }
  } catch (error) {
    // Handle fetch request errors
    if (signal.aborted) {
      resultText.innerText = "Request aborted.";
    } else {
      console.error("Error:", error);
      resultText.innerText = "Error occurred while generating.";
   }
  } finally {
    // Enable the generate button and disable the stop button
    generateBtn.disabled = false;
    stopBtn.disabled = true;
    controller = null; // Reset the AbortController instance
  }
};

const stop = () => {
  // Abort the fetch request by calling abort() on the AbortController instance
  if (controller) {
    controller.abort();
    controller = null;
  }
};

function GoogleSearchBox() {
  return (
      <LoadScript googleMapsApiKey="AIzaSyAW6fRxtCxXqPoLgRd40uZEqLVAs-XmRQ4" libraries={['places']}>
        <Autocomplete
          onLoad={displayDetail}
          onPlaceChanged={() => {}}
        >
          <input type="text" placeholder="Enter location" />
        </Autocomplete>
      </LoadScript>
  );
}

function GenerateButton() {
  return (
    <button id="generateBtn" onClick={generate}>
        Sniffing out Pet-friendliness in the Store
    </button>
  );
}

function StopButton() {
  return (
    <button id="stopBtn" onClick={stop}>
        Stop
    </button>
  );
}

function InfoBox() {
  return (
      <div>
        <p>{selectedPlace.name}</p>
        <p>{selectedPlace.formatted_address}</p>	
        <p id="resultText"> </p>
        {/* Add more information as needed */}
      </div>
  );
}
return (
    <div>
      <h1>Project Cradle</h1>
      <GoogleSearchBox/>
      <GenerateButton/>
      <StopButton/>
      {selectedPlace && <InfoBox/>}
    </div>
  );
}

export default App;
