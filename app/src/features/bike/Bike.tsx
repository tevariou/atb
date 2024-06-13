import { useState, useEffect } from "react"

import * as d3 from "d3";

import { Wheel } from "../../utils/wheel";
import type { BikeGeometry } from "../../utils/bike-geometry";

export const Bike = ({bike} : {bike:BikeGeometry}) => {
  const [framePath, setFramePath] = useState("");
  const [crankPath, setCrankPath] = useState("");

  const frontWheel = new Wheel(584, 66);
  const rearWheel = new Wheel(584, 66);

  useEffect(() => {
    const frame = d3.line()([
      [bike.bbCoordinates.x, bike.bbCoordinates.y],
      [bike.headTubeBottomCoordinate.x, bike.headTubeBottomCoordinate.y],
      [bike.headTubeTopCoordinate.x, bike.headTubeTopCoordinate.y],
      [bike.seatTubeTopCoordinate.x, bike.seatTubeTopCoordinate.y],
      [bike.rearAxleCoordinate.x, bike.rearAxleCoordinate.y],
      [bike.bbCoordinates.x, bike.bbCoordinates.y],
      [bike.seatTubeTopCoordinate.x, bike.seatTubeTopCoordinate.y],
      [bike.headTubeTopCoordinate.x, bike.headTubeTopCoordinate.y],
      [bike.headTubeBottomCoordinate.x, bike.headTubeBottomCoordinate.y],
      [bike.frontAxleCoordinate.x, bike.frontAxleCoordinate.y],
    ]);

    // console.log(Math.sqrt(Math.pow(bike.rearAxleCoordinate.x - bike.frontAxleCoordinate.x, 2) + Math.pow(bike.rearAxleCoordinate.y - bike.frontAxleCoordinate.y, 2)))

    if (frame) setFramePath(frame);

    const crankCoordinates = bike.putCrank(165)
    const crank = d3.line()([
      [bike.bbCoordinates.x, bike.bbCoordinates.y],
      [crankCoordinates.x, crankCoordinates.y],
    ])
    if (crank) setCrankPath(crank);
  }, []);

  return (
    <svg width="1500" height="1500">
      <g transform="translate(750 750), scale(0.5), scale(-1 1), rotate(180)">
        <circle fill="black" stroke="black" cx={bike.frontAxleCoordinate.x} cy={bike.frontAxleCoordinate.y} r={frontWheel.radiusWithTire} />
        <circle fill="white" stroke="black" cx={bike.frontAxleCoordinate.x} cy={bike.frontAxleCoordinate.y} r={frontWheel.radius} />
        <circle fill="black" stroke="black" cx={bike.rearAxleCoordinate.x} cy={bike.rearAxleCoordinate.y} r={rearWheel.radiusWithTire} />
        <circle fill="white" stroke="black" cx={bike.rearAxleCoordinate.x} cy={bike.rearAxleCoordinate.y} r={rearWheel.radius} />
        <path d={framePath} stroke="blue" strokeWidth="5" fill="none"  />
        <path d={crankPath} stroke="red" strokeWidth="5" fill="none" />
      </g>
    </svg>
  )
}
