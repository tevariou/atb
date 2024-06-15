import { useState, useEffect } from "react"

import { BikeGeometry } from "../../utils/bike-geometry";
import { Wheel } from "../../utils/wheel";

export const Bike = () => {
  const [headTube, setHeadTube] = useState("");
  const [fork, setFork] = useState("");
  const [downTube, setDownTube] = useState("");
  const [seatTube, setSeatTube] = useState("");
  const [chainStay, setChainStay] = useState("");
  const [seatStay, setSeatStay] = useState("");
  const [topTube, setTopTube] = useState("");
  const [crank, setCrank] = useState("");
  const [crankDown, setCrankDown] = useState("");
  const [spacers, setSpacers] = useState("");
  const [stem, setStem] = useState("");
  const [seatPost, setSeatPost] = useState("");
  const [riderUpperLeg, setRiderUpperLeg] = useState("");
  const [riderLowerLeg, setRiderLowerLeg] = useState("");
  const [riderFeet, setRiderFeet] = useState("");

  const bike = new BikeGeometry(
    389,
    653,
    200,
    68.5,
    450,
    72.5,
    490,
    55,
    63.5,
    440,
    0,
    165,
    95,
    35,
    0,
    870,
    0,
    390,
    270
  );

  const frontWheel = new Wheel(584, 75);
  const rearWheel = new Wheel(584, 75);

  useEffect(() => {
    setHeadTube(bike.drawHeadTube());
    setFork(bike.drawFork());
    setDownTube(bike.drawDownTube());
    setSeatTube(bike.drawSeatTube());
    setChainStay(bike.drawChainStay());
    setSeatStay(bike.drawSeatStay());
    setTopTube(bike.drawTopTube());
    setCrank(bike.drawCrank());
    setSpacers(bike.drawSpacers());
    setStem(bike.drawStem());
    setSeatPost(bike.drawSeatPost());
    setRiderUpperLeg(bike.drawRiderUpperLeg());
    setRiderLowerLeg(bike.drawRiderLowerLeg());
    setCrankDown(bike.drawCrankDown());
    setRiderFeet(bike.drawRiderFeet());
  }, []);

  return (
    <svg width="1500" height="1500">
      <g transform="translate(750 750), scale(0.5), scale(-1 1), rotate(180)">
        <circle fill="black" stroke="black" cx={bike.frontAxleCoordinates.x} cy={bike.frontAxleCoordinates.y} r={frontWheel.radiusWithTire} />
        <circle fill="white" stroke="black" cx={bike.frontAxleCoordinates.x} cy={bike.frontAxleCoordinates.y} r={frontWheel.radius} />
        <circle fill="black" stroke="black" cx={bike.rearAxleCoordinates.x} cy={bike.rearAxleCoordinates.y} r={rearWheel.radiusWithTire} />
        <circle fill="white" stroke="black" cx={bike.rearAxleCoordinates.x} cy={bike.rearAxleCoordinates.y} r={rearWheel.radius} />
        <path d={headTube} stroke="blue" strokeWidth="5" fill="none"  />
        <path d={fork} stroke="blue" strokeWidth="5" fill="none" />
        <path d={downTube} stroke="blue" strokeWidth="5" fill="none" />
        <path d={seatTube} stroke="blue" strokeWidth="5" fill="none" />
        <path d={chainStay} stroke="blue" strokeWidth="5" fill="none" />
        <path d={seatStay} stroke="blue" strokeWidth="5" fill="none" />
        <path d={topTube} stroke="blue" strokeWidth="5" fill="none" />
        <path d={crank} stroke="red" strokeWidth="5" fill="none" />
        <path d={crankDown} stroke="red" strokeDasharray="5" strokeWidth="5" fill="none" />
        <path d={spacers} stroke="red" strokeWidth="5" fill="none" />
        <path d={stem} stroke="red" strokeWidth="5" fill="none" />
        <path d={seatPost} stroke="red" strokeWidth="5" fill="none" />
        <path d={riderUpperLeg} stroke="green" strokeWidth="5" fill="none" />
        <path d={riderLowerLeg} stroke="green" strokeWidth="5" fill="none" />
        <path d={riderFeet} stroke="green" strokeWidth="5" fill="none" />
      </g>
    </svg>
  )
}
