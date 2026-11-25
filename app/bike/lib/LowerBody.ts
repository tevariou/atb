import * as d3 from "d3";
import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import SeatPost from "./SeatPost";
import Crank from "./Crank";
import { distance, rotate, toRadians } from "./helpers";

export default class LowerBody extends Segment {
  private readonly __brand = "LowerBody";
  private readonly _inseamLength: number;
  private readonly _footLength: number;
  private readonly _upperLegLength: number;
  private readonly _crank: Crank;
  private readonly _feetPositionRatio: number;
  private readonly _bottomBracket: BottomBracket;

  constructor({
    bottomBracket,
    seatPost,
    crank,
    riderInseamLength,
    riderUpperLegLength,
    riderFootLength,
    riderCleatOffset,
  }: {
    bottomBracket: BottomBracket;
    seatPost: SeatPost;
    crank: Crank;
    riderInseamLength: number;
    riderUpperLegLength: number;
    riderFootLength: number;
    riderCleatOffset: number;
  }) {
    if (riderCleatOffset >= riderFootLength) {
      throw new Error("Cleat offset is greater than foot length");
    }

    if (riderUpperLegLength >= riderInseamLength) {
      throw new Error("Upper leg length is greater than inseam length");
    }

    const feetPositionRatio = 1 - riderCleatOffset / riderFootLength;

    const fromSaddleToPedal = Math.hypot(
      distance(seatPost.start, bottomBracket.coordinates) + crank.length,
      crank.qFactor / 2,
    );

    if (Math.floor(fromSaddleToPedal) > riderInseamLength) {
      throw new Error("From saddle to pedal is greater than inseam length");
    }

    const lowerLegLength = riderInseamLength - riderUpperLegLength;

    if (lowerLegLength <= 0) {
      throw new Error("Lower leg is less than or equal to 0");
    }

    // The horizontal foot shifts the heel's orbit behind the bottom bracket.
    const heelOrbitCenter = {
      x: bottomBracket.coordinates.x - riderFootLength * feetPositionRatio,
      y: bottomBracket.coordinates.y,
    };
    const centerDistance = distance(heelOrbitCenter, seatPost.start);
    const lateralOffset = crank.qFactor / 2;
    const minDistance = Math.hypot(
      centerDistance - crank.length,
      lateralOffset,
    );
    const maxDistance = Math.hypot(
      centerDistance + crank.length,
      lateralOffset,
    );
    if (
      minDistance < Math.abs(riderUpperLegLength - lowerLegLength) ||
      maxDistance > riderInseamLength
    ) {
      throw new Error(
        "Leg lengths cannot reach the heel throughout the pedal stroke",
      );
    }

    const heel = {
      x: crank.end.x - riderFootLength * feetPositionRatio,
      y: crank.end.y,
    };

    const end = {
      x: heel.x + riderFootLength,
      y: heel.y,
    };

    super({ start: seatPost.start, end });
    this._bottomBracket = bottomBracket;
    this._footLength = riderFootLength;
    this._crank = crank;
    this._inseamLength = riderInseamLength;
    this._upperLegLength = riderUpperLegLength;
    this._feetPositionRatio = feetPositionRatio;
  }

  draw(spinAngle?: number): string {
    const crankEnd = rotate(
      this._crank.end,
      toRadians((spinAngle && -spinAngle) || 0),
      this._bottomBracket.coordinates,
    );

    const heel = {
      x: crankEnd.x - this._footLength * this._feetPositionRatio,
      y: crankEnd.y,
    };

    const dx = this.start.x - heel.x;
    const dy = this.start.y - heel.y;
    const sideViewDistance = Math.hypot(dx, dy);
    const hipDistance = Math.hypot(sideViewDistance, this._crank.qFactor / 2);
    const lowerLegLength = this._inseamLength - this._upperLegLength;

    // Locate the knee along the 3D heel-to-hip line, then bend it forward
    // perpendicular to that line in the side view.
    const along =
      hipDistance === 0
        ? 0
        : (hipDistance ** 2 + lowerLegLength ** 2 - this._upperLegLength ** 2) /
          (2 * hipDistance);
    const fraction = hipDistance === 0 ? 0 : along / hipDistance;
    const bend = Math.sqrt(Math.max(0, lowerLegLength ** 2 - along ** 2));
    const knee = {
      x:
        heel.x +
        fraction * dx +
        bend * (sideViewDistance === 0 ? 1 : dy / sideViewDistance),
      y:
        heel.y +
        fraction * dy -
        bend * (sideViewDistance === 0 ? 0 : dx / sideViewDistance),
    };

    const end = {
      x: heel.x + this._footLength,
      y: heel.y,
    };

    return (
      d3.line()([
        [this.start.x, this.start.y],
        [knee.x, knee.y],
        [heel.x, heel.y],
        [end.x, end.y],
      ]) ?? ""
    );
  }

  get inseamLength(): number {
    return this._inseamLength;
  }

  get footLength(): number {
    return this._footLength;
  }

  get feetPositionRatio(): number {
    return this._feetPositionRatio;
  }
}
