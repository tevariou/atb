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
  static readonly feetPositionRatio: number = 2 / 3;
  private readonly _bottomBracket: BottomBracket;

  constructor({
    bottomBracket,
    seatPost,
    crank,
    riderInseamLength,
    riderUpperLegLength,
    riderFootLength,
  }: {
    bottomBracket: BottomBracket;
    seatPost: SeatPost;
    crank: Crank;
    riderInseamLength: number;
    riderUpperLegLength: number;
    riderFootLength: number;
  }) {
    const fromSaddleToPedal = Math.sqrt(
      (distance(seatPost.start, bottomBracket.coordinates) + crank.length) **
        2 +
        (crank.qFactor / 2) ** 2,
    );

    if (fromSaddleToPedal > riderInseamLength) {
      throw new Error("From saddle to pedal is greater than inseam length");
    }

    const lowerLeg = riderInseamLength - riderUpperLegLength;

    if (lowerLeg <= 0) {
      throw new Error("Lower leg is less than or equal to 0");
    }

    const heel = {
      x: crank.end.x - riderFootLength * LowerBody.feetPositionRatio,
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
  }

  draw(spinAngle?: number): string {
    const crankEnd = rotate(
      this._crank.end,
      toRadians((spinAngle && -spinAngle) || 0),
      this._bottomBracket.coordinates,
    );

    const heel = {
      x: crankEnd.x - this._footLength * LowerBody.feetPositionRatio,
      y: crankEnd.y,
    };

    const theta = Math.atan(
      (this._seatPost.start.y - heel.y) / (this._seatPost.start.x - heel.x),
    );
    const d = Math.sqrt(
      distance(heel, this._seatPost.start) ** 2 +
        (this._crank.qFactor / 2) ** 2,
    );

    const lowerLeg = this._inseamLength - this._upperLegLength;

    const gamma = Math.acos(
      (d ** 2 + lowerLeg ** 2 - this._upperLegLength ** 2) / (2 * d * lowerLeg),
    );

    const knee = {
      x: Math.abs(-lowerLeg * Math.cos(theta - gamma)) + heel.x,
      y: Math.abs(-lowerLeg * Math.sin(theta - gamma)) + heel.y,
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
}
