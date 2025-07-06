import * as d3 from "d3";
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
  }: {
    bottomBracket: BottomBracket;
    crankLength: number;
    qFactor: number;
  }) {
    const start = bottomBracket.coordinates;
    const end = {
      x: crankLength + bottomBracket.coordinates.x,
      y: bottomBracket.coordinates.y,
    };

    super({ start, end });
    this.length = crankLength;
    this.qFactor = qFactor;
  }

  override draw(spinAngle?: number, origin?: BottomBracket): string {
    const end = spinAngle ? rotate(
      this.end,
      toRadians(-spinAngle),
      origin?.coordinates,
    ) : this.end;

    return (
      d3.line()([
        [this.start.x, this.start.y],
        [end.x, end.y],
      ]) ?? ""
    );
  }
}
