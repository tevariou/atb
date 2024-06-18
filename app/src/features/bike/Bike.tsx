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
  const [riderSpine, setRiderSpine] = useState("");
  const [riderArm, setRiderArm] = useState("");

  const bike = new BikeGeometry(
    389,
    653,
    200,
    68.5,
    450,
    72.5,
    490,
    51,
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
    300,
    178.5,
    460,
    690,
    700,
    75
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
    setRiderSpine(bike.drawRiderSpine());
    setRiderArm(bike.drawRiderArm());
  }, []);

  return (
    <svg width="1500" height="1500">
      <defs>
        <linearGradient id="rainbow" >
          <stop offset="0%" stopColor="rgba(255, 0, 0, 1)"/>
          <stop offset="10%" stopColor="rgba(255, 154, 0, 1)"/>
          <stop offset="20%" stopColor="rgba(208, 222, 33, 1)"/>
          <stop offset="30%" stopColor="rgba(79, 220, 74, 1)"/>
          <stop offset="40%" stopColor="rgba(63, 218, 216, 1)"/>
          <stop offset="50%" stopColor="rgba(47, 201, 226, 1)"/>
          <stop offset="60%" stopColor="rgba(28, 127, 238, 1)"/>
          <stop offset="70%" stopColor="rgba(95, 21, 242, 1)"/>
          <stop offset="80%" stopColor="rgba(186, 12, 248, 1)"/>
          <stop offset="90%" stopColor="rgba(251, 7, 217, 1)"/>
          <stop offset="100%" stopColor="rgba(255, 0, 0, 1)"/>
        </linearGradient>
      </defs>

      <g transform="translate(750 750), scale(0.5), scale(-1 1), rotate(180)">
        <circle fill="url(#rainbow)" fillOpacity="0.5" cx={bike.frontAxleCoordinates.x} cy={bike.frontAxleCoordinates.y} r={frontWheel.radiusWithTire} />
        <circle fill="white" cx={bike.frontAxleCoordinates.x} cy={bike.frontAxleCoordinates.y} r={frontWheel.radius} />
        <circle fill="url(#rainbow)" fillOpacity="0.5" cx={bike.rearAxleCoordinates.x} cy={bike.rearAxleCoordinates.y} r={rearWheel.radiusWithTire} />
        <circle fill="white" cx={bike.rearAxleCoordinates.x} cy={bike.rearAxleCoordinates.y} r={rearWheel.radius} />
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
        <path d={riderUpperLeg} stroke="green" strokeWidth="5" fill="none" strokeOpacity=".25" />
        <path d={riderLowerLeg} stroke="green" strokeWidth="5" fill="none" strokeOpacity=".25" />
        <path d={riderFeet} stroke="green" strokeWidth="5" fill="none" strokeOpacity=".25" />
        <path d={riderSpine} stroke="green" strokeWidth="5" fill="none" strokeOpacity=".25" />
        <path d={riderArm} stroke="green" strokeWidth="5" fill="none" strokeOpacity=".25" />
      </g>
    </svg>
  )
}
