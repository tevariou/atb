import { useAppSelector } from "@/lib/hooks";
import BikeGeometry from "./BikeGeometry";
import type { BikeState } from "./bikeSlice";
import type { RiderState } from "./riderSlice";
import { riderSelectors } from "./riderSlice";
import { bikeSelectors } from "./bikeSlice";
import { shadowBikeSelectors } from "./shadowBikeSlice";

function toBikeGeometry(
  bike?: BikeState,
  rider?: RiderState,
  spinAngle?: number,
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
    riderUpperLegLength: rider?.upperLegLength && rider.upperLegLength * 10,
    riderFootLength: rider?.footLength && rider.footLength * 10,
    riderArmLength: rider?.armLength && rider.armLength * 10,
    riderSpineLength: rider?.spineLength && rider.spineLength * 10,
    riderInseamLength: rider?.inseamLength && rider.inseamLength * 10,
    frontWheelDiameter: bike?.wheelFrontDiameter,
    rearWheelDiameter: bike?.wheelRearDiameter,
    frontTireWidth: bike?.tireFrontWidth,
    rearTireWidth: bike?.tireRearWidth,
    spinAngle,
    forkTravel: bike?.forkTravel,
    forkSag: bike?.forkSag,
  });
}

export function useBikeGeometry(spinAngle: number) {
  const bike = useAppSelector(bikeSelectors.selectBike);
  const shadowBike = useAppSelector(shadowBikeSelectors.selectShadowBike);
  const rider = useAppSelector(riderSelectors.selectRider);

  let bikeGeometry: BikeGeometry | undefined;
  try {
    bikeGeometry = toBikeGeometry(bike, rider, spinAngle);
  } catch {
    bikeGeometry = undefined;
  }

  let shadowBikeGeometry: BikeGeometry | undefined;
  try {
    shadowBikeGeometry = toBikeGeometry(shadowBike, rider, spinAngle);
  } catch {
    shadowBikeGeometry = undefined;
  }

  return {
    bike: bikeGeometry,
    shadowBike: shadowBikeGeometry,
  };
}
