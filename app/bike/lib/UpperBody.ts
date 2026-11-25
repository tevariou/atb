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

    const squaredProjectedArmLength =
      riderArmLength ** 2 - (handleBar.width / 2) ** 2;
    if (squaredProjectedArmLength < 0) {
      throw new Error("Invalid arm length or handlebar width");
    }

    const projectedArmLength = Math.sqrt(squaredProjectedArmLength);

    const dx = h.x - s.x;
    const dy = h.y - s.y;
    const span = Math.hypot(dx, dy);
    if (
      span > riderSpineLength + projectedArmLength ||
      span < Math.abs(riderSpineLength - projectedArmLength)
    ) {
      throw new Error("Upper body does not intersect with seat post");
    }

    super({ start: s, end: h });

    if (span === 0) {
      // Coincident, equal-radius circles allow an upright shoulder.
      this._shoulder = { x: s.x, y: s.y + riderSpineLength };
    } else {
      const along =
        (span ** 2 + riderSpineLength ** 2 - projectedArmLength ** 2) /
        (2 * span);
      const height = Math.sqrt(Math.max(0, riderSpineLength ** 2 - along ** 2));
      // Choose the higher intersection (the rearward one for a vertical span).
      const offset = dx < 0 || (dx === 0 && dy < 0) ? -height : height;
      this._shoulder = {
        x: s.x + (along * dx - offset * dy) / span,
        y: s.y + (along * dy + offset * dx) / span,
      };
    }

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
