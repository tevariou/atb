import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import HeadTube from "./HeadTube";
import Coordinates from "./Coordinates";
import { rotate, toRadians } from "./helpers";
import ChainStay from "./ChainStay";

export default class Fork extends Segment {
  private readonly __brand = "Fork";
  private readonly _forkOffsetLength: number;

  constructor({
    bottomBracket,
    headTube,
    chainStay,
    forkOffsetLength,
    crownToAxleLength,
    frontCenterLength,
    wheelBase,
    wheelRadiusDifference = 0,
    forkTravel,
    forkSag,
  }: {
    bottomBracket: BottomBracket;
    headTube: HeadTube;
    chainStay: ChainStay;
    forkOffsetLength: number;
    crownToAxleLength: number;
    frontCenterLength: number;
    wheelBase: number;
    wheelRadiusDifference?: number;
    forkTravel: number;
    forkSag: number;
  }) {
    let end: Coordinates;

    if (crownToAxleLength === 0 && frontCenterLength !== 0) {
      if (Math.abs(frontCenterLength) < Math.abs(chainStay.bbDropLength)) {
        throw new Error(
          `Front center length (${frontCenterLength}) must be greater than or equal to bottom bracket drop length (${chainStay.bbDropLength})`,
        );
      }

      end = {
        x:
          Math.sqrt(frontCenterLength ** 2 - chainStay.bbDropLength ** 2) +
          bottomBracket.coordinates.x,
        y: chainStay.start.y,
      };
    } else if (crownToAxleLength === 0 && wheelBase !== 0) {
      end = {
        x: chainStay.start.x + Math.hypot(wheelBase, wheelRadiusDifference),
        y: chainStay.start.y,
      };
    } else {
      if (forkOffsetLength > crownToAxleLength) {
        throw new Error("Fork offset exceeds axle-to-crown length");
      }
      const forkLength = Math.sqrt(
        crownToAxleLength ** 2 - forkOffsetLength ** 2,
      );
      const unRotatedFrontAxleWithOffsetCoordinates = {
        x: headTube.end.x + forkOffsetLength,
        y: headTube.end.y - forkLength,
      };

      const frontAxleWithOffsetCoordinates = rotate(
        unRotatedFrontAxleWithOffsetCoordinates,
        toRadians(90) - headTube.angle,
        headTube.end,
      );

      end = {
        x: frontAxleWithOffsetCoordinates.x,
        y: frontAxleWithOffsetCoordinates.y,
      };
    }

    const start = headTube.end;

    // All three inputs locate the uncompressed axle. Sag moves it up the steerer.
    const sagTravel = (forkTravel * forkSag) / 100;
    if (sagTravel > 0) {
      const axisX = Math.cos(headTube.angle);
      const axisY = -Math.sin(headTube.angle);
      const axialLength = (end.x - start.x) * axisX + (end.y - start.y) * axisY;
      if (sagTravel > axialLength + 1e-9) {
        throw new Error("Fork sag exceeds available axle-to-crown length");
      }
      end = { x: end.x - sagTravel * axisX, y: end.y - sagTravel * axisY };
    }

    super({ start, end });

    this._forkOffsetLength = forkOffsetLength;
  }

  get forkOffsetLength(): number {
    return this._forkOffsetLength;
  }
}
