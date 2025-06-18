import Segment from "./Segment";
import Coordinates from "./Coordinates";
import SeatPost from "./SeatPost";
import HandleBar from "./HandleBar";
import * as d3 from "d3";

export default class UpperBody extends Segment {
  private readonly __brand = "UpperBody";
  private readonly _shoulder: Coordinates;
  private readonly _spineLength: number;

  constructor({
    seatPost,
    handleBar,
    riderArmLength,
    riderSpineLength,
  }: {
    seatPost: SeatPost;
    handleBar: HandleBar;
    riderArmLength: number;
    riderSpineLength: number;
  }) {
    const h = handleBar.coordinates;
    const s = seatPost.start;

    const squaredProjectedArmLength = riderArmLength ** 2 - (handleBar.width / 2) ** 2;
    if (squaredProjectedArmLength < 0) {
      throw new Error("Invalid arm length or handlebar width");
    }

    const projectedArmLength = Math.sqrt(squaredProjectedArmLength);

    const m = -(h.x - s.x) / (h.y - s.y);
    const k =
      -(
        s.x ** 2 +
        s.y ** 2 -
        h.x ** 2 -
        h.y ** 2 -
        riderSpineLength ** 2 +
        projectedArmLength ** 2
      ) /
      (2 * (h.y - s.y));
    const a = 1 + m ** 2;
    const b = 2 * (m * (k - s.y) - s.x);
    const c = (k - s.y) ** 2 - riderSpineLength ** 2 + s.x ** 2;
    const delta = b ** 2 - 4 * a * c;

    if (delta < 0) {
      throw new Error("Upper body does not intersect with seat post");
    }

    let x = (-b - Math.sqrt(delta)) / (2 * a);
    let y = m * x + k;
    if (y < h.y) {
      x = (-b + Math.sqrt(delta)) / (2 * a);
      y = m * x + k;
    }

    super({ start: seatPost.start, end: handleBar.coordinates });

    this._shoulder = {
      x: x,
      y: y,
    };

    this._spineLength = riderSpineLength;
  }

  get shoulder(): Coordinates {
    return this._shoulder;
  }

  get spineLength(): number {
    return this._spineLength;
  }

  draw(): string {
    return (
      d3.line()([
        [this.start.x, this.start.y],
        [this._shoulder.x, this._shoulder.y],
        [this.end.x, this.end.y],
      ]) ?? ""
    );
  }
}
