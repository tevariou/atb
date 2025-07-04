import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import SeatTube from "./SeatTube";
import Crank from "./Crank";
import { distance } from "./helpers";
import Coordinates from "./Coordinates";

export default class SeatPost extends Segment {
  private readonly __brand = "SeatPost";
  private readonly _seatPostLength: number;

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
    const MAX_SEAT_POST_LENGTH = 450;
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
      if (
        riderInseamLength - getDWithOffset(seatPostLength) < 1 ||
        seatPostLength > MAX_SEAT_POST_LENGTH
      ) {
        return seatPostLength;
      }
      return getSeatPostLength(seatPostLength + 1);
    };
    const seatPostLength = getSeatPostLength(0);

    if (seatPostLength > MAX_SEAT_POST_LENGTH) {
      throw new Error("Seatpost length is too long");
    }

    const xWithOffset = getXWithOffset(seatPostLength);
    const yWithOffset = getYWithOffset(seatPostLength);

    const start = {
      x: xWithOffset,
      y: yWithOffset,
    };
    const end = seatTube.start;

    super({ start, end });
    this._seatPostLength = seatPostLength;
  }

  get start(): Coordinates {
    return this._start;
  }

  get seatPostLength(): number {
    return this._seatPostLength;
  }
}
