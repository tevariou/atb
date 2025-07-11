import type BikeGeometry from "../lib/BikeGeometry";
import {
  MAIN_BIKE_COLOR,
  SHADOW_BIKE_COLOR,
  MAIN_RIDER_COLOR,
  SHADOW_RIDER_COLOR,
} from "../lib/constants";

export default function Bike({
  bike,
  spinAngle = 0,
  isShadow = false,
  adjustYAxis = 0,
}: {
  bike: BikeGeometry;
  isShadow?: boolean;
  spinAngle?: number;
  adjustYAxis?: number;
}) {
  const bikeColor = isShadow ? SHADOW_BIKE_COLOR : MAIN_BIKE_COLOR;
  const riderColor = isShadow ? SHADOW_RIDER_COLOR : MAIN_RIDER_COLOR;

  const adjustedYAxis = adjustYAxis ? adjustYAxis : 0;

  const BIKE_STROKE_WIDTH = 7;
  const WHEEL_STROKE_WIDTH = 2;
  const RIDER_STROKE_WIDTH = 4;

  return (
    <svg width="100%" height="100%" viewBox="0 0 1500 1000">
      <defs>
        <linearGradient id="rainbow">
          <stop offset="0%" stopColor="rgba(255, 0, 0, 1)" />
          <stop offset="10%" stopColor="rgba(255, 154, 0, 1)" />
          <stop offset="20%" stopColor="rgba(208, 222, 33, 1)" />
          <stop offset="30%" stopColor="rgba(79, 220, 74, 1)" />
          <stop offset="40%" stopColor="rgba(63, 218, 216, 1)" />
          <stop offset="50%" stopColor="rgba(47, 201, 226, 1)" />
          <stop offset="60%" stopColor="rgba(28, 127, 238, 1)" />
          <stop offset="70%" stopColor="rgba(95, 21, 242, 1)" />
          <stop offset="80%" stopColor="rgba(186, 12, 248, 1)" />
          <stop offset="90%" stopColor="rgba(251, 7, 217, 1)" />
          <stop offset="100%" stopColor="rgba(255, 0, 0, 1)" />
        </linearGradient>
      </defs>

      <g
        transform={`translate(750 ${750 - adjustedYAxis / 2}), scale(0.5), scale(-1 1), rotate(180)`}
      >
        {/* Front tire */}
        <circle
          transform={`rotate(${-spinAngle}, ${bike.fork.end.x}, ${
            bike.fork.end.y
          })`}
          stroke={bikeColor}
          strokeWidth={WHEEL_STROKE_WIDTH}
          fill="none"
          cx={bike.fork.end.x}
          cy={bike.fork.end.y}
          r={bike.frontWheel.radiusWithTire}
        />

        {/* Front rim */}
        <circle
          stroke={bikeColor}
          strokeWidth={WHEEL_STROKE_WIDTH}
          fill="none"
          cx={bike.fork.end.x}
          cy={bike.fork.end.y}
          r={bike.frontWheel.radius}
        />

        {/* Rear tire */}
        <circle
          transform={`rotate(${-spinAngle}, ${bike.chainStay.start.x}, ${
            bike.chainStay.start.y
          })`}
          stroke={bikeColor}
          strokeWidth={WHEEL_STROKE_WIDTH}
          fill="none"
          cx={bike.chainStay.start.x}
          cy={bike.chainStay.start.y}
          r={bike.rearWheel.radiusWithTire}
        />
        {/* Rear rim */}
        <circle
          stroke={bikeColor}
          strokeWidth={WHEEL_STROKE_WIDTH}
          fill="none"
          cx={bike.chainStay.start.x}
          cy={bike.chainStay.start.y}
          r={bike.rearWheel.radius}
        />

        {/* Head tube */}
        <path
          d={bike.headTube.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Fork */}
        <path
          d={bike.fork.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Down tube */}
        <path
          d={bike.downTube.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Seat tube */}
        <path
          d={bike.seatTube.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Chainstay */}
        <path
          d={bike.chainStay.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Seat tube */}
        <path
          d={bike.seatStay.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Top tube */}
        <path
          d={bike.topTube.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Crank */}
        <path
          d={bike.crank.draw(spinAngle)}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Steerer tube */}
        <path
          d={bike.spacers.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Stem */}
        <path
          d={bike.stem.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Seat post */}
        <path
          d={bike.seatPost && bike.seatPost.draw()}
          stroke={bikeColor}
          strokeWidth={BIKE_STROKE_WIDTH}
          fill="none"
        />

        {/* Rider lower body */}
        <path
          d={bike.lowerBody && bike.lowerBody.draw(spinAngle)}
          stroke={riderColor}
          strokeWidth={RIDER_STROKE_WIDTH}
          fill="none"
          // strokeOpacity=".25"
        />

        {/* Rider upper body */}
        <path
          d={bike.upperBody && bike.upperBody.draw()}
          stroke={riderColor}
          strokeWidth={RIDER_STROKE_WIDTH}
          fill="none"
          // strokeOpacity=".25"
        />
      </g>
    </svg>
  );
}
