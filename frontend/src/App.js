import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <input type="number" onChange={handleNumberChange} />
        <button onClick={handleNumberClick}>Change Number</button>
        <p>The current number is {currentNumber}.</p>

        <p>The current time is {currentTime}.</p>

        <p>Example ENV Variable: {process.env.REACT_APP_EXAMPLE_1}.</p>
        <p>Current ENV: {process.env.NODE_ENV}.</p>
      </header>
    </div>
  );
}

export default App;
