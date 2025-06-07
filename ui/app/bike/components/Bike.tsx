import BikeGeometry from "../lib/BikeGeometry";
import Wheel from "../lib/Wheel";

export default function Bike({
  bike,
  spinAngle = 0,
}: {
  bike: BikeGeometry;
  spinAngle?: number;
}) {
  const frontWheel = new Wheel(584, 75);
  const rearWheel = new Wheel(584, 75);

  return (
    <svg width="100%" height="100%" viewBox="0 0 1500 1500">
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

      <g transform="translate(750 750), scale(0.5), scale(-1 1), rotate(180)">
        <circle
          transform={`rotate(${-spinAngle}, ${bike.fork.end.x}, ${
            bike.fork.end.y
          })`}
          fill="url(#rainbow)"
          fillOpacity="0.5"
          cx={bike.fork.end.x}
          cy={bike.fork.end.y}
          r={frontWheel.radiusWithTire}
        />
        <circle
          fill="white"
          cx={bike.fork.end.x}
          cy={bike.fork.end.y}
          r={frontWheel.radius}
        />
        <circle
          transform={`rotate(${-spinAngle}, ${bike.chainStay.start.x}, ${
            bike.chainStay.start.y
          })`}
          fill="url(#rainbow)"
          fillOpacity="0.5"
          cx={bike.chainStay.start.x}
          cy={bike.chainStay.start.y}
          r={rearWheel.radiusWithTire}
        />
        <circle
          fill="white"
          cx={bike.chainStay.start.x}
          cy={bike.chainStay.start.y}
          r={rearWheel.radius}
        />
        <path
          d={bike.headTube.draw()}
          stroke="blue"
          strokeWidth="5"
          fill="none"
        />
        <path d={bike.fork.draw()} stroke="blue" strokeWidth="5" fill="none" />
        <path
          d={bike.downTube.draw()}
          stroke="blue"
          strokeWidth="5"
          fill="none"
        />
        <path
          d={bike.seatTube.draw()}
          stroke="blue"
          strokeWidth="5"
          fill="none"
        />
        <path
          d={bike.chainStay.draw()}
          stroke="blue"
          strokeWidth="5"
          fill="none"
        />
        <path
          d={bike.seatStay.draw()}
          stroke="blue"
          strokeWidth="5"
          fill="none"
        />
        <path
          d={bike.topTube.draw()}
          stroke="blue"
          strokeWidth="5"
          fill="none"
        />
        <path d={bike.crank.draw()} stroke="red" strokeWidth="5" fill="none" />
        <path
          d={bike.spacers.draw()}
          stroke="red"
          strokeWidth="5"
          fill="none"
        />
        <path d={bike.stem.draw()} stroke="red" strokeWidth="5" fill="none" />
        <path
          d={bike.seatPost.draw()}
          stroke="red"
          strokeWidth="5"
          fill="none"
        />
        <path
          d={bike.lowerBody.draw()}
          stroke="green"
          strokeWidth="5"
          fill="none"
          strokeOpacity=".25"
        />
        <path
          d={bike.upperBody.draw()}
          stroke="green"
          strokeWidth="5"
          fill="none"
          strokeOpacity=".25"
        />
      </g>
    </svg>
  );
}
