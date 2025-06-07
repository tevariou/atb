import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import HeadTube from "./HeadTube";
import Coordinates from "./Coordinates";
import { rotate, toRadians } from "./helpers";
import ChainStay from "./ChainStay";

export default class Fork extends Segment {
  private readonly __brand = "Fork";

  constructor({
    bottomBracket,
    headTube,
    chainStay,
    forkOffsetLength,
    crownToAxleLength,
    frontCenterLength,
    wheelBase,
  }: {
    bottomBracket: BottomBracket;
    headTube: HeadTube;
    chainStay: ChainStay;
    forkOffsetLength: number;
    crownToAxleLength: number;
    frontCenterLength: number;
    wheelBase: number;
  }) {
    let end: Coordinates;

    if (frontCenterLength !== 0) {
      end = {
        x:
          Math.sqrt(frontCenterLength ** 2 - chainStay.bbDropLength ** 2) +
          bottomBracket.coordinates.x,
        y: chainStay.bbDropLength + bottomBracket.coordinates.y,
      };
    } else if (wheelBase !== 0) {
      end = {
        x: chainStay.start.x + wheelBase,
        y: chainStay.start.y,
      };
    } else {
      const unRotatedFrontAxleWithOffsetCoordinates = {
        x: headTube.end.x + forkOffsetLength,
        y: headTube.end.y - crownToAxleLength,
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

    super({ start, end });
  }
}
