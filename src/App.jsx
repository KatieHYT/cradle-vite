import React, { useState, useEffect } from 'react';
//import NavigationBar from './components/NavigationBar';
//import Leaderboard from './components/Leaderboard';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

import './App.css'; // Import the CSS file

import {GOOGLE_MAP_API_KEY, REVIEW_API_URL, CALL_API_URL, CHECKCALL_API_URL} from './api_key'; // Import the API key
//
let controller = null; // Store the AbortController instance
let placeId;
let placeName = "Enter a Location";
let placeAddress = "";
let service_dog = false;

let phoneNumber;
let latlng;

const buttonStyle = {
     padding: '1px 2px',  // Adjust the padding as needed
     fontSize: '10px',  // Adjust the font size as needed
                      };

const buttonStyleNav = {
     padding: '1px 2px',  // Adjust the padding as needed
     fontSize: '10px',  // Adjust the font size as needed
     width: '70px',  // Adjust the font size as needed  
     marginLeft: '75%', // Adjust the margin as needed
                      };

function StopReviewButton() {
  function Stop() {
    // Abort the fetch request by calling abort() on the AbortController instance
    if (controller) {
      controller.abort();
      controller = null;
    }
  };
  return (
    <button 
      id="stopBtn" 
      onClick={Stop}
      style={buttonStyle}
      className="w-1/5 px-4 py-2 rounded-md border border-gray-500 text-gray-500 hover:text-gray-700 hover:border-gray-700 focus:outline-none ml-2 disabled:opacity-75 disabled:cursor-not-allowed"
    >
        Stop
    </button>
  );
}



function GenerateReviewButton() {
  async function Generate() {
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
      const response = await fetch(REVIEW_API_URL, {
        method: "POST",
        body: JSON.stringify({
         api_input: "%petfriendly%"+placeId ,
        }),
        signal, // Pass the signal to the fetch request
      });
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/event-stream')) {
      //if (response.body && typeof response.body.getReader === "function") {
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
      } else if (contentType && contentType.includes('application/json')) {
        // Response body is not a stream, handle accordingly
        const responseBody = await response.text(); // Read the response as text
	const parsedResponse = JSON.parse(responseBody);
        resultText.innerText = "";
	resultText.innerText += "The Cradle team has received confirmation(" + parsedResponse.response.manager_confirm_date + ") from the store manager(" + parsedResponse.response.manager_name + ") on the following:"
	resultText.innerHTML += '<span style="white-space: pre;">\n\t</span>';
        resultText.innerHTML += "[ " + (parsedResponse.response.service_dog ? "O" : "X") + " ] Service dogs are allowed.";
	resultText.innerHTML += '<span style="white-space: pre;">\n\t</span>';
        resultText.innerHTML += "[ " + (parsedResponse.response.non_service_dog ? "O" : "X") + " ] Non-service dogs are allowed.";
	resultText.innerHTML += '<span style="white-space: pre;">\n\t</span>';
        resultText.innerHTML += "[ " + (parsedResponse.response.dog_treat ? "O" : "X") + " ] Dog treats are provided.";
	resultText.innerHTML += '<span style="white-space: pre;">\n\t</span>';
        resultText.innerHTML += "[ " + (parsedResponse.response.dog_water ? "O" : "X") + " ] Dog water are provided.";
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
  return (
    <button 
      id="generateBtn" 
      onClick={Generate}
      style={buttonStyle}
      className="w-4/5 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"
    >
	  Summarize Reviews
    </button>
  );
}

function HyperLink(){
  return (
    <div className="leftside">
      <ul className="socialmediaicons">
        <a href="https://instagram.com/projectcradle_sf?igshid=MzRlODBiNWFlZA==">
          <li style={{ display: 'inline' }} key="instagram">
            <i className="fa fa-instagram"></i>
          </li>
        </a>
        <a href="https://www.youtube.com/watch?v=PjKbckberp0">
          <li style={{ display: 'inline' }} key="youtube">
            <i className="fa fa-youtube"></i>
          </li>
        </a>
      </ul>
    </div>
  )
}

function ProjectInfo(){
  return(
    <div>
    <h1>Cradle.wiki</h1>
    <p className="text-gray-500 text-sm mb-2">Together, make the world better!</p>
    <HyperLink/>
    </div>
  )
}


function GoogleSearchBox() {
  function DisplayDetail(autocomplete) {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.place_id) return;
      //setPlaceId(place.place_id);
      placeId = place.place_id
      placeName = place.name
      placeAddress = place.formatted_address
    });
  }

  return (
      <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY} libraries={['places']}>
        <Autocomplete
          onLoad={DisplayDetail}
          onPlaceChanged={() => {}}
        >
          <input 
            type="text" 
            placeholder= {placeName + "    " + placeAddress}
            className="w-full px-4 py-2 rounded-md bg-gray-200 placeholder-gray-500 focus:outline-none mt-4"
          />
        </Autocomplete>
      </LoadScript>
  );
}
function ReviewButtonArea(){
  return (
    <div className="flex justify-center mt-4">
      <GenerateReviewButton/>
      <StopReviewButton/>
    </div>
  )
}

function PhoneNumberBox() {
  const handleChange = (event) => {
    phoneNumber = event.target.value; // Update phoneNumber directly
  }
  
  return (
    <div>
      <input
        type="text"
        placeholder="Phone Number"
        className="w-1/2 px-4 py-2 rounded-md bg-gray-200 placeholder-gray-500 focus:outline-none mt-4"
        onChange={handleChange}
	style={buttonStyle}  // Apply the inline styles here
      />
    </div>
  );
}

function CallButton() {
  async function Call() {
    // Alert the user if no prompt value
    callBtn.disabled = true;
    if (!phoneNumber) {
      alert("Please enter phone number.");
      return;
    }
  
    // Disable the generate button and enable the stop button
    resultTextCall.innerText = "Calling...";
  
    try {
      const response = await fetch(CALL_API_URL, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ 
		     call_to: phoneNumber,
		     latlng: latlng,
	     }),
           });
      //const contentType = response.headers.get('content-type');
      //console.log(contentType) //application/json

    } catch (error) {
      // Handle fetch request errors
     console.error("Error:", error);
     resultTextCall.innerText = "Error occurred while calling.";
     }
    finally {
      // Enable the generate button and disable the stop button
      callBtn.disabled = false;
    }
  };
  return (
    <button 
      id="callBtn" 
      onClick={Call}
      style={buttonStyle}
      className="w-1/5 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"
    >
        Call
    </button>
  );
}

function CallArea(){
  return (
    <div className="mt-2">
      <PhoneNumberBox/>
      <CallButton/>
    </div>
  )
}

function InfoBoxCall() {

  useEffect(() => {
	      // This code will run after the component has been mounted (displayed)
	  checkCall(); // Call the checkCall function once the component is mounted
	    }, []); // The empty dependency array ensures it runs only once, like componentDidMount
	  //
  async function checkCall() {
      // Fetch the response from the OpenAI API with the signal from AbortController
     const response = await fetch(REVIEW_API_URL, {
        method: "POST",
        body: JSON.stringify({
         api_input: "%callinfo%"+placeId ,
        }),
      });
     // Response body is not a stream, handle accordingly
     const responseBody = await response.text(); // Read the response as text
     const parsedResponse = JSON.parse(responseBody);
     latlng = parsedResponse.latlng
     phoneNumber = parsedResponse.phone_number

     //resultTextCall.innerText = "";
     //resultTextCall.innerText += latlng + " %%%%   " + phoneNumber
     
     console.log(phoneNumber)
     const response_call = await fetch(CHECKCALL_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latlng: latlng }),
          });
     const responseBody_call = await response_call.text(); // Read the response as text
     console.log(responseBody_call)
     const parsedResponse_call = JSON.parse(responseBody_call);
     
     resultTextCall.innerText = "";
     if (parsedResponse_call.call_conversation === null){
     resultTextCall.innerText += "The place has not yet been called."
    }else{
     resultTextCall.innerText += parsedResponse_call.call_conversation
    }
  }
  return (
      <div className="mt-4 h-40 w-full overflow-y-auto custom-scrollbar">
        <p id="resultTextCall" style={{ fontSize: '12px' }} >
	</p>
        <CallArea/>
      </div>
  );
}

function InfoBoxReview() {
  useEffect(() => {
	      // This code will run after the component has been mounted (displayed)
	  checkReview(); // Call the checkCall function once the component is mounted
	    }, []); // The empty dependency array ensures it runs only once, like componentDidMount
	  //
  async function checkReview() {
      // Fetch the response from the OpenAI API with the signal from AbortController
      const response = await fetch(REVIEW_API_URL, {
        method: "POST",
        body: JSON.stringify({
         api_input: "%checkreview%"+placeId ,
        }),
      });
     // Response body is not a stream, handle accordingly
     const responseBody = await response.text(); // Read the response as text
     const parsedResponse = JSON.parse(responseBody);
     resultText.innerText = "";
     if (parsedResponse.review_summary === null){
     resultText.innerText += "The place has not yet been parsed."
    }else{
     resultText.innerText += parsedResponse.review_summary
    }
  }
  return (
      <div className="mt-4 h-40 w-full overflow-y-auto custom-scrollbar">
        <p id="resultText" className="whitespace-pre-line" style={{ fontSize: '12px' }}>
	</p>
        <ReviewButtonArea/>
      </div>
  );
}

function ScrollArea() {
  return (
	   <div className="flex mt-4">
	     <div className="flex-1">
	       <InfoBoxCall />
	     </div>
	     <div className="flex-1 ml-4"> {/* Add ml-4 for spacing */}
	       <InfoBoxReview />
	     </div>
	   </div>
	 );
}

function Sniff() {
  const [showScrollArea, setShowScrollArea] = useState(false);
  
  return (
	  <div>
	    <button 
	     onClick={() => setShowScrollArea(!showScrollArea)}
             className="w-1/5 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"
	  >
	      Sniff
	    </button>
	    {showScrollArea && <ScrollArea />}
	  </div>
	    );
}

function LeaderboardButton() {
   const [showLeaderboard, setShowLeaderboard] = useState(false);
   const toggleLeaderboard = () => {
       setShowLeaderboard(!showLeaderboard);
     };
   return (
     <div>
       <button 
	   onClick={toggleLeaderboard}
      style={buttonStyleNav}
      className="w-1/5 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"
	    
>Leaderboard
       </button>
	   {showLeaderboard && "hello"} 
     </div>
   );
                 }

function Leaderboard() {
	  return (
		          <LeaderboardButton />
		    );
}


function RegisterButton({ onUserUpdate }) {
   const [showRegistration, setShowRegistration] = useState(false);
   const toggleRegistration = () => {
       setShowRegistration(!showRegistration);
     };
   return (
     <div>
       <button 
	   onClick={toggleRegistration}
      style={buttonStyleNav}
      className="w-1/5 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"

	   >Register</button>
	   {showRegistration && <RegistrationForm onClose={toggleRegistration} onUserUpdate={onUserUpdate}/>} 
     </div>
   );

                 }

function LoginButton({ onUserUpdate }) {
   const [showLogin, setShowLogin] = useState(false);
   const toggleLogin = () => {
       setShowLogin(!showLogin);
     };
  // Add your login button UI here
    return (
        <div>
	    <button
	    onClick={toggleLogin}
      style={buttonStyleNav}
      className="w-1/5 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"

	    >Login</button>
	   {showLogin && <LoginForm onClose={toggleLogin} onUserUpdate={onUserUpdate}/>} 
    </div>      
    );

                  }

function NavigationBar() {
  const [user, setUser] = useState(null);

  const handleUserUpdate = (newUser) => {
    setUser(newUser);
  };
	  return ( <div>
                        {user ? (
                              <div className="welcome-message">Hi {user}</div>
                            ) : (
			      <div className="">
		              <RegisterButton onUserUpdate={handleUserUpdate} />
		              <LoginButton onUserUpdate={handleUserUpdate}/>
			      </div>
                            )}
		  </div>
		    );
}

function RegistrationForm({ onUserUpdate }) {
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
          onUserUpdate(formData.username);
          alert("Successfully Registered");
	}
	else if(parsedResponse.register_status==="username_repeated"){
          onUserUpdate(formData.username);
          alert("Username exist. Welcome back!");
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

function App() {

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left bg-gray-100">
      <NavigationBar/>
      <Leaderboard/>
      <ProjectInfo/>
      <GoogleSearchBox/>
      <Sniff/>
    </div>
  );
}

export default App;
