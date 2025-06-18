import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import SeatTube from "./SeatTube";
import Crank from "./Crank";
import { distance } from "./helpers";
import Coordinates from "./Coordinates";

export default class SeatPost extends Segment {
  private readonly __brand = "SeatPost";

  constructor({
    bottomBracket,
    seatTube,
    crank,
    seatPostOffset,
    riderInseamLength,
  }: {
    bottomBracket: BottomBracket;
    seatTube: SeatTube;
    crank: Crank;
    riderInseamLength: number;
    seatPostOffset: number;
  }) {
    const getXWithOffset = (seatPostLength: number) =>
      -Math.cos(seatTube.actualAngle) * seatPostLength +
      seatTube.start.x -
      seatPostOffset;
    const getYWithOffset = (seatPostLength: number) =>
      Math.sin(seatTube.actualAngle) * seatPostLength + seatTube.start.y;
    const getDWithOffset = (seatPostLength: number) =>
      Math.sqrt(
        (distance(
          {
            x: getXWithOffset(seatPostLength),
            y: getYWithOffset(seatPostLength),
          },
          bottomBracket.coordinates,
        ) +
          crank.length) **
          2 +
          (crank.qFactor / 2) ** 2,
      );
    const getSeatPostLength = (seatPostLength: number): number => {
      if (riderInseamLength - getDWithOffset(seatPostLength) < 1 || seatPostLength > 1000) {
        return seatPostLength;
      }
      return getSeatPostLength(seatPostLength + 1);
    };
    const xWithOffset = getXWithOffset(getSeatPostLength(0));
    const yWithOffset = getYWithOffset(getSeatPostLength(0));

    const start = {
      x: xWithOffset,
      y: yWithOffset,
    };
    const end = seatTube.start;

    super({ start, end });
  }

  get start(): Coordinates {
    return this._start;
  }
}
