import { useEffect, useState } from "react";

import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import { Bike } from "./features/bike/Bike"
import logo from "./logo.svg"
import { Map, CompassControl } from 'react-mapycz';

const App = () => {

  const [spinAngle, setSpinAngle] = useState(0);

  useEffect(() => {
    const incrementAngle = () => {
      if (spinAngle < 360) {
        setSpinAngle(spinAngle + 5)
      } else {
        setSpinAngle(0)
      }
    }
    const interval = setInterval(() => incrementAngle(), 1);
    return () => {
      clearInterval(interval);
    };
  }, [spinAngle]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Quotes />
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://react-redux.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://reselect.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reselect
          </a>
        </span>
      </header>
      <Bike spinAngle={spinAngle} />
      <Map>
        <CompassControl />
      </Map>
    </div>
  )
}

export default App
