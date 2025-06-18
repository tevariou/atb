import Segment from "./Segment";
import BottomBracket from "./BottomBracket";

export default class ChainStay extends Segment {
  private readonly __brand = "ChainStay";
  bbDropLength: number;

  constructor({
    bottomBracket,
    bbDropLength,
    chainStayLength,
  }: {
    bottomBracket: BottomBracket;
    bbDropLength: number;
    chainStayLength: number;
  }) {
    if (Math.abs(chainStayLength) < Math.abs(bbDropLength)) {
      throw new Error(
        `Chain stay length (${chainStayLength}) must be greater than or equal to bottom bracket drop length (${bbDropLength})`
      );
    }

    const start = {
      x:
        -Math.sqrt(chainStayLength ** 2 - bbDropLength ** 2) +
        bottomBracket.coordinates.x,
      y: bbDropLength + bottomBracket.coordinates.y,
    };
    const end = bottomBracket.coordinates;

    super({ start, end });
    this.bbDropLength = bbDropLength;
  }
}
