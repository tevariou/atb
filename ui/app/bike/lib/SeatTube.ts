import * as d3 from "d3";
import Coordinates from "./Coordinates";
import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import TopTubeHorizontal from "./TopTubeHorizontal";

export default class SeatTube extends Segment {
  private readonly __brand = "SeatTube";

  actualAngle: number;
  private breakPoint: Coordinates;

  constructor({
    bottomBracket,
    topTubeHorizontal,
    seatTubeLength,
    actualSeatTubeAngle,
  }: {
    bottomBracket: BottomBracket;
    topTubeHorizontal: TopTubeHorizontal;
    seatTubeLength: number;
    actualSeatTubeAngle: number;
  }) {
    const alpha = -actualSeatTubeAngle;
    const h = topTubeHorizontal.start;
    const k = h.y - Math.tan(alpha) * h.x;
    const a = 1 + Math.tan(alpha) ** 2;
    const b =
      2 *
      ((k - bottomBracket.coordinates.y) * Math.tan(alpha) -
        bottomBracket.coordinates.x);
    const c =
      (k - bottomBracket.coordinates.y) ** 2 -
      seatTubeLength ** 2 +
      bottomBracket.coordinates.x ** 2;

    const d = b ** 2 - 4 * a * c;
    if (d < 0) {
      throw new Error("Seat tube does not intersect with top tube");
    }

    let x = (-b - Math.sqrt(d)) / (2 * a);
    let y = Math.tan(alpha) * x + h.y - Math.tan(alpha) * h.x;

    const start = {
      x: x,
      y: y,
    };
    const end = bottomBracket.coordinates;

    super({ start, end });

    y = bottomBracket.coordinates.y + seatTubeLength / 2;

    if (topTubeHorizontal.start.x === start.x) {
      throw new Error("Top tube horizontal and seat tube start x are the same");
    }

    const m =
      (topTubeHorizontal.start.y - start.y) /
      (topTubeHorizontal.start.x - start.x);
    x = (y - start.y + start.x * m) / m;

    this.breakPoint = {
      x: x,
      y: y,
    };

    this.actualAngle = actualSeatTubeAngle;
  }

  draw(): string {
    return (
      d3.line()([
        [this.start.x, this.start.y],
        [this.breakPoint.x, this.breakPoint.y],
        [this.end.x, this.end.y],
      ]) ?? ""
    );
  }
}
