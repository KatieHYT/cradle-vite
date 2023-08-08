import React, { useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

const API_URL = "https://4e01-140-112-41-151.ngrok-free.app/petlover/callback";
const GOOGLE_MAP_API_KEY = "AIzaSyAW6fRxtCxXqPoLgRd40uZEqLVAs-XmRQ4"

let controller = null; // Store the AbortController instance
controller = new AbortController();
const signal = controller.signal;

const stop = () => {
  // Abort the fetch request by calling abort() on the AbortController instance
  if (controller) {
    controller.abort();
    controller = null;
  }
};


function StopButton() {
  return (
    <button id="stopBtn" onClick={stop}>
        Stop
    </button>
  );
}


const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}

const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeId, setPlaceId] = useState('');

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

  function GoogleSearchBox() {
    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY} libraries={['places']}>
          <Autocomplete
            onLoad={displayDetail}
            onPlaceChanged={() => {}}
          >
            <input 
	      type="text" 
	      placeholder="Enter location"
	      style={{ width: '600px', height: '40px', fontSize: '16px' }}
	    />
          </Autocomplete>
        </LoadScript>
    );
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

  function GenerateButton() {
    return (
      <button id="generateBtn" onClick={generate}>
          Sniffing out Pet-friendliness in the Store
      </button>
    );
  }

  function InfoBox() {
    return (
        <div>
          <p id="resultText"> </p>
          {/* Add more information as needed */}
        </div>
    );
  }

  let placename;
  if (selectedPlace){
  placename = selectedPlace.name
  }else{
  placename = ""
  }

  let placeaddress;
  if (selectedPlace){
  placeaddress = selectedPlace.formatted_address
  }else{
  placeaddress = ""
  }
return (
    <div>
      <h1>Project Cradle</h1>
      <GoogleSearchBox/>
      {placename}
      <br />
      {placeaddress}
      <br />
      <GenerateButton/>
      <StopButton/>
      <br />
      <InfoBox/>
      <Profile/>
      <ul>{listItems}</ul>
    </div>
  );
}

export default App;
