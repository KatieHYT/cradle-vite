import React, { useState, useEffect } from 'react';
import RegistrationForm from './RegistrationForm'

function RegisterButton({ onUserUpdate }) {
   const [showRegistration, setShowRegistration] = useState(false);
   const toggleRegistration = () => {
       setShowRegistration(!showRegistration);
     };
   return (
     <div>
       <button onClick={toggleRegistration}>Register</button>
	   {showRegistration && <RegistrationForm onClose={toggleRegistration} onUserUpdate={onUserUpdate}/>} 
     </div>
   );

                 }

                 export default RegisterButton;
