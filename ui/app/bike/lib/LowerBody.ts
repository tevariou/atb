import * as d3 from "d3";
import Segment from "./Segment";
import Coordinates from "./Coordinates";
import BottomBracket from "./BottomBracket";
import SeatPost from "./SeatPost";
import Crank from "./Crank";
import { distance } from "./helpers";

export default class LowerBody extends Segment {
  private readonly __brand = "LowerBody";
  private readonly knee: Coordinates;
  private readonly heel: Coordinates;
  private readonly _inseamLength: number;

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

    const heel = {
      x: crank.end.x - (riderFootLength * 2) / 3,
      y: crank.end.y,
    };

    let knee: Coordinates;

    if (fromSaddleToPedal > riderInseamLength) {
      knee = {
        x: seatPost.start.x,
        y: seatPost.start.y - riderUpperLegLength,
      };
    } else {
      const lowerLeg = riderInseamLength - riderUpperLegLength;
      const theta = Math.atan(
        (seatPost.start.y - heel.y) / (seatPost.start.x - heel.x),
      );
      const d = Math.sqrt(
        distance(heel, seatPost.start) ** 2 + (crank.qFactor / 2) ** 2,
      );

      if (d === 0 || lowerLeg === 0) {
        throw new Error("Lower leg or distance is 0");
      }

      const gamma = Math.acos(
        (d ** 2 + lowerLeg ** 2 - riderUpperLegLength ** 2) /
          (2 * d * lowerLeg),
      );

      knee = {
        x: Math.abs(-lowerLeg * Math.cos(theta - gamma)) + heel.x,
        y: Math.abs(-lowerLeg * Math.sin(theta - gamma)) + heel.y,
      };
    }

    const end = {
      x: heel.x + riderFootLength,
      y: heel.y,
    };

    super({ start: seatPost.start, end });
    this.knee = knee;
    this.heel = heel;
    this._inseamLength = riderInseamLength;
  }

  draw(): string {
    return (
      d3.line()([
        [this.start.x, this.start.y],
        [this.knee.x, this.knee.y],
        [this.heel.x, this.heel.y],
        [this.end.x, this.end.y],
      ]) ?? ""
    );
  }

  get inseamLength(): number {
    return this._inseamLength;
  }
}
