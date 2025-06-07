import BikeGeometry from "./BikeGeometry";
import type { BikeState } from "./bikeSlice";
import type { RiderState } from "./riderSlice"

export function toBikeGeometry(
  bike?: BikeState,
  rider?: RiderState,
  spinAngle?: number
): BikeGeometry {
  return new BikeGeometry({
    reachLength: bike?.reach,
    stackLength: bike?.stack,
    headTubeLength: bike?.headTube,
    headTubeAngle: bike?.headTubeAngle,
    chainStayLength: bike?.chainStay,
    actualSeatTubeAngle: bike?.actualSeatTubeAngle,
    seatTubeLength: bike?.seatTube,
    forkOffsetLength: bike?.forkOffset,
    bbDropLength: bike?.bottomBracketDrop,
    crownToAxleLength: bike?.forkAxleToCrown,
    frontCenterLength: bike?.frontCenter,
    crankLength: bike?.crankLength,
    spacersLength: bike?.spacers,
    stemLength: bike?.stemLength,
    stemAngle: bike?.stemAngle,
    seatPostOffset: bike?.seatOffset,
    qFactor: bike?.crankQFactor,
    handleBarWidth: bike?.handlebarWidth,
    handleBarReach: bike?.handlebarReach,
    handleBarHeight: bike?.handlebarRise,
    effectiveSeatTubeAngle: bike?.effectiveSeatTubeAngle,
    riderUpperLegLength: rider?.upperLegLength,
    riderFootLength: rider?.footLength,
    riderArmLength: rider?.armLength,
    riderSpineLength: rider?.spineLength,
    riderInseamLength: rider?.inseamLength,
    spinAngle,
  });
}
