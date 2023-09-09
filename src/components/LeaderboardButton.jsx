import React, { useState, useEffect } from 'react';

function LeaderboardButton() {
   const [showLeaderboard, setShowLeaderboard] = useState(false);
   const toggleLeaderboard = () => {
       setShowLeaderboard(!showLeaderboard);
     };
   return (
     <div>
       <button onClick={toggleLeaderboard}>Leaderboard</button>
	   {showLeaderboard && "hello"} 
     </div>
   );

                 }

                 export default LeaderboardButton;
