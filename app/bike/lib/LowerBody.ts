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
  private readonly _seatPost: SeatPost;
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

    const fromSaddleToPedal = Math.sqrt(
      (distance(seatPost.start, bottomBracket.coordinates) + crank.length) **
        2 +
        (crank.qFactor / 2) ** 2,
    );

    if (Math.floor(fromSaddleToPedal) > riderInseamLength) {
      throw new Error("From saddle to pedal is greater than inseam length");
    }

    const lowerLegLength = riderInseamLength - riderUpperLegLength;

    if (lowerLegLength <= 0) {
      throw new Error("Lower leg is less than or equal to 0");
    }

    // Calculate d at both crank positions to validate triangle inequality
    // d_max: pedal at bottom (spin angle 0)
    const heelAtBottom = {
      x: crank.end.x - riderFootLength * feetPositionRatio,
      y: crank.end.y,
    };
    const dMax = Math.sqrt(
      distance(heelAtBottom, seatPost.start) ** 2 + (crank.qFactor / 2) ** 2,
    );

    // d_min: pedal at top (spin angle 180)
    const crankEndAtTop = rotate(
      crank.end,
      toRadians(180),
      bottomBracket.coordinates,
    );
    const heelAtTop = {
      x: crankEndAtTop.x - riderFootLength * feetPositionRatio,
      y: crankEndAtTop.y,
    };
    const dMin = Math.sqrt(
      distance(heelAtTop, seatPost.start) ** 2 + (crank.qFactor / 2) ** 2,
    );

    // Triangle inequality: upperLegLength must be > |lowerLegLength - d| for all d
    const minUpperLegRequired = Math.max(
      Math.abs(lowerLegLength - dMin),
      Math.abs(lowerLegLength - dMax),
    );

    if (riderUpperLegLength <= minUpperLegRequired) {
      throw new Error(
        "Upper leg length is too short relative to inseam length for the given bike geometry",
      );
    }

    const heel = {
      x: crank.end.x - riderFootLength * feetPositionRatio,
      y: crank.end.y,
    };

    if (distance(heel, seatPost.start) === 0) {
      throw new Error("Heel is on the seat post");
    }

    const end = {
      x: heel.x + riderFootLength,
      y: heel.y,
    };

    super({ start: seatPost.start, end });
    this._bottomBracket = bottomBracket;
    this._footLength = riderFootLength;
    this._crank = crank;
    this._seatPost = seatPost;
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

    const theta = Math.atan(
      (this._seatPost.start.y - heel.y) / (this._seatPost.start.x - heel.x),
    );
    const d = Math.sqrt(
      distance(heel, this._seatPost.start) ** 2 +
        (this._crank.qFactor / 2) ** 2,
    );

    const lowerLegLength = this._inseamLength - this._upperLegLength;

    const gamma = Math.acos(
      (d ** 2 + lowerLegLength ** 2 - this._upperLegLength ** 2) /
        (2 * d * lowerLegLength),
    );

    const knee = {
      x: Math.abs(-lowerLegLength * Math.cos(theta - gamma)) + heel.x,
      y: Math.abs(-lowerLegLength * Math.sin(theta - gamma)) + heel.y,
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
