import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import { rotate, toRadians } from "./helpers";

export default class Crank extends Segment {
  private readonly __brand = "Crank";
  readonly length: number;
  readonly qFactor: number;

  constructor({
    bottomBracket,
    crankLength,
    qFactor,
    spinAngle = 0,
  }: {
    bottomBracket: BottomBracket;
    crankLength: number;
    qFactor: number;
    spinAngle: number;
  }) {
    const start = bottomBracket.coordinates;
    const end = rotate(
      {
        x: crankLength + bottomBracket.coordinates.x,
        y: bottomBracket.coordinates.y,
      },
      toRadians(-spinAngle),
      bottomBracket.coordinates,
    );
    
    super({ start, end });
    this.length = crankLength;
    this.qFactor = qFactor;
  }
}
