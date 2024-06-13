import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import { Bike } from "./features/bike/Bike"
import { MeasureForm } from "./features/measure-form/MeasureForm"
import { BikeGeometry } from "./utils/bike-geometry";

import logo from "./logo.svg"

const App = () => {

  const bike = new BikeGeometry(
    389,
    653,
    200,
    69,
    450,
    72.5,
    490,
    55,
    63.5,
    440,
    0
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>ATB</h1>
      </header>
      <div className="row">
        <div className="col-6">
          <Bike bike={bike} />
        </div>
        <div className="col-6">
          <MeasureForm bike={bike} />
        </div>
      </div>
    </div>
  )
}

export default App
