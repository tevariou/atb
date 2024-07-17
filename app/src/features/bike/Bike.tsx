import { useMemo } from "react";

import { BikeGeometry } from "../../utils/bike-geometry";
import { Wheel } from "../../utils/wheel";

export const Bike = ({ spinAngle }: { spinAngle: number }) => {
  const bike = useMemo(() => new BikeGeometry(
    {
      reachLength: 389,
      stackLength: 653,
      headTubeLength: 212,
      headTubeAngle: 69,
      chainStayLength: 450,
      actualSeatTubeAngle: 72.5,
      seatTubeLength: 490,
      forkOffsetLength: 55,
      bbDropLength: 63.5,
      crownToAxleLength: 440,
      frontCenterLength: 0,
      crankLength: 165,
      spacersLength: 95,
      stemLength: 35,
      stemAngle: 0,
      riderInseamLength: 870,
      seatPostOffset: 0,
      riderUpperLegLength: 390,
      riderFootLength: 300,
      qFactor: 178.5,
      handleBarWidth: 460,
      riderArmLength: 690,
      riderSpineLength: 700,
      effectiveSeatTubeAngle: 72.5,
      handleBarReach: 506,
      handleBarHeight: 0,
      spinAngle: spinAngle,
    }
  ), [spinAngle]);

  const frontWheel = new Wheel(584, 75);
  const rearWheel = new Wheel(584, 75);

  return (
    <svg width="1500" height="1500">
      <defs>
        <linearGradient id="rainbow" >
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
        <circle transform={`rotate(${-spinAngle}, ${bike.fork.end.x}, ${bike.fork.end.y})`} fill="url(#rainbow)" fillOpacity="0.5" cx={bike.fork.end.x} cy={bike.fork.end.y} r={frontWheel.radiusWithTire} />
        <circle fill="white" cx={bike.fork.end.x} cy={bike.fork.end.y} r={frontWheel.radius} />
        <circle transform={`rotate(${-spinAngle}, ${bike.chainStay.start.x}, ${bike.chainStay.start.y})`} fill="url(#rainbow)" fillOpacity="0.5" cx={bike.chainStay.start.x} cy={bike.chainStay.start.y} r={rearWheel.radiusWithTire} />
        <circle fill="white" cx={bike.chainStay.start.x} cy={bike.chainStay.start.y} r={rearWheel.radius} />
        <path d={bike.headTube.draw()} stroke="blue" strokeWidth="5" fill="none" />
        <path d={bike.fork.draw()} stroke="blue" strokeWidth="5" fill="none" />
        <path d={bike.downTube.draw()} stroke="blue" strokeWidth="5" fill="none" />
        <path d={bike.seatTube.draw()} stroke="blue" strokeWidth="5" fill="none" />
        <path d={bike.chainStay.draw()} stroke="blue" strokeWidth="5" fill="none" />
        <path d={bike.seatStay.draw()} stroke="blue" strokeWidth="5" fill="none" />
        <path d={bike.topTube.draw()} stroke="blue" strokeWidth="5" fill="none" />
        <path d={bike.crank.draw()} stroke="red" strokeWidth="5" fill="none" />
        <path d={bike.spacers.draw()} stroke="red" strokeWidth="5" fill="none" />
        <path d={bike.stem.draw()} stroke="red" strokeWidth="5" fill="none" />
        <path d={bike.seatPost.draw()} stroke="red" strokeWidth="5" fill="none" />
        <g transform={bike.upperBody.headTransform()}>
          <path fill="#D9D9D9" d={bike.upperBody.getHeadDrawing()}/>
        </g>
        <g transform={bike.upperBody.armDrawingTransform()}>
          <path fill="#D9D9D9" d={bike.upperBody.getArmDrawingPath()}/>
        </g>
        <g transform={bike.upperBody.spineDrawingTransform()}>
          <path fill="#D9D9D9" d={bike.upperBody.getSpineDrawingPath()}/>
        </g>
        <g transform={bike.lowerBody.lowerLegTransform()}>
          <path fill="#D9D9D9" d={bike.lowerBody.getLowerLegPath()}/>
        </g>
        <g transform={bike.lowerBody.feetTransform()}>
            <path fill="#D9D9D9" d={bike.lowerBody.getfeetPath()}/>
        </g>
        <g transform={bike.lowerBody.upperLegTransform()}>
            <path fill="#D9D9D9" d={bike.lowerBody.getUpperLegPath()}/>
        </g>
          
      </g>
    </svg>
  )
}
