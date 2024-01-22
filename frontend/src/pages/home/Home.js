import React, { useState, useEffect } from "react";

import "./Home.css";

function Home() {
    const [currentTime, setCurrentTime] = useState(0);
    const [currentNumber, setCurrentNumber] = useState(0);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_BASE_API}/api/time`).then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, []);

    const handleNumberClick = () => {
        fetch(`${process.env.REACT_APP_BACKEND_BASE_API}/api/number`, {
            "method": "POST",
            headers: {"Content-Type": "application/json"},
            "body": JSON.stringify({number: Number(currentNumber)}),
        }).then(res => res.json()).then(data => {
            setCurrentNumber(data.number);
        });
    }

    const handleNumberChange = (event) => {
        setCurrentNumber(event.target.value);
    }

	return (
		<div>
            <header className="App-header">

                <input type="number" onChange={handleNumberChange} />
                <button onClick={handleNumberClick}>Change Number</button>
                <p>The current number is {currentNumber}.</p>

                <p>The current time is {currentTime}.</p>

                <p>Environment: {process.env.REACT_APP_ENVIRONMENT}.</p>
            </header>
		</div>
	);
}

export default Home;
