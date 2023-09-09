import React, { useState, useEffect } from 'react';
import LeaderboardButton from './LeaderboardButton';
import './Leaderboard.css'; // Import the CSS file

function Leaderboard() {
	  return (
		      <nav className="leaderboard">
		        <div className="leaderboard-buttons">
		          <LeaderboardButton />
		        </div>
		      </nav>
		    );
}

export default Leaderboard;
