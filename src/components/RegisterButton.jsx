import React, { useState, useEffect } from 'react';
//import RegistrationForm from './RegistrationForm';
import "../App.css";

function RegisterButton({ onUserUpdate }) {
   const [showRegistration, setShowRegistration] = useState(false);
   const toggleRegistration = () => {
       setShowRegistration(!showRegistration);
     };
   return (
     <div>
       <button 
	   onClick={toggleRegistration}
      style={buttonStyle}
      className="w-1/5 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"

	   >Register</button>
	   {showRegistration && <RegistrationForm onClose={toggleRegistration} onUserUpdate={onUserUpdate}/>} 
     </div>
   );

                 }

                 export default RegisterButton;
