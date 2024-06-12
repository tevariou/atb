import { useState, useEffect } from "react"

import * as d3 from "d3";

import { BikeGeometry } from "../../utils/bike-geometry";
import { Wheel } from "../../utils/wheel";

export const Bike = () => {
  const [pathStr, setPathStr] = useState("");

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

  const frontWheel = new Wheel(584, 66);
  const rearWheel = new Wheel(584, 66);

  useEffect(() => {
    const l = d3.line()([
      [0, 0],
      [bike.headTubeBottomCoordinate.x, bike.headTubeBottomCoordinate.y],
      [bike.headTubeTopCoordinate.x, bike.headTubeTopCoordinate.y],
      [bike.seatTubeTopCoordinate.x, bike.seatTubeTopCoordinate.y],
      [bike.rearAxleCoordinate.x, bike.rearAxleCoordinate.y],
      [0, 0],
      [bike.seatTubeTopCoordinate.x, bike.seatTubeTopCoordinate.y],
      [bike.headTubeTopCoordinate.x, bike.headTubeTopCoordinate.y],
      [bike.headTubeBottomCoordinate.x, bike.headTubeBottomCoordinate.y],
      [bike.frontAxleCoordinate.x, bike.frontAxleCoordinate.y],
    ]);

    console.log(Math.sqrt(Math.pow(bike.rearAxleCoordinate.x - bike.frontAxleCoordinate.x, 2) + Math.pow(bike.rearAxleCoordinate.y - bike.frontAxleCoordinate.y, 2)))

    if (l) setPathStr(l);
  }, []);

  return (
    <svg width="1500" height="1500">
      <g transform="translate(750 750), scale(0.5), scale(-1 1), rotate(180)">
        <circle fill="black" stroke="black" cx={bike.frontAxleCoordinate.x} cy={bike.frontAxleCoordinate.y} r={frontWheel.radiusWithTire} />
        <circle fill="white" stroke="black" cx={bike.frontAxleCoordinate.x} cy={bike.frontAxleCoordinate.y} r={frontWheel.radius} />
        <circle fill="black" stroke="black" cx={bike.rearAxleCoordinate.x} cy={bike.rearAxleCoordinate.y} r={rearWheel.radiusWithTire} />
        <circle fill="white" stroke="black" cx={bike.rearAxleCoordinate.x} cy={bike.rearAxleCoordinate.y} r={rearWheel.radius} />
        <path d={pathStr} stroke="blue" strokeWidth="5" fill="none"  />
      </g>
    </svg>
  )
}
