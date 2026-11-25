import * as d3 from "d3";
import Coordinates from "./Coordinates";
import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import TopTubeHorizontal from "./TopTubeHorizontal";
import { rotate } from "./helpers";

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
    // Intersect the seatpost axis with the circle measured from the bottom bracket.
    const axisX = -Math.cos(actualSeatTubeAngle);
    const axisY = Math.sin(actualSeatTubeAngle);
    const end = bottomBracket.coordinates;
    const dx = topTubeHorizontal.start.x - end.x;
    const dy = topTubeHorizontal.start.y - end.y;
    const perpendicular = dx * axisY - dy * axisX;
    if (Math.abs(perpendicular) > seatTubeLength) {
      throw new Error("Seat tube does not intersect with top tube");
    }
    const along = Math.sqrt(seatTubeLength ** 2 - perpendicular ** 2);
    const start = {
      x: end.x + perpendicular * axisY + along * axisX,
      y: end.y - perpendicular * axisX + along * axisY,
    };

    super({ start, end });

    const bendY = end.y + seatTubeLength / 2;
    if (axisY === 0 && start.y !== bendY) {
      throw new Error("Horizontal seat tube cannot reach the bend height");
    }
    this.breakPoint = {
      x: axisY === 0 ? start.x : start.x + ((bendY - start.y) * axisX) / axisY,
      y: bendY,
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

  tilt(angle: number, origin: Coordinates) {
    const newStart = rotate(this.start, angle, origin);
    const newEnd = rotate(this.end, angle, origin);
    const newBreakPoint = rotate(this.breakPoint, angle, origin);

    this.start = newStart;
    this.end = newEnd;
    this.breakPoint = newBreakPoint;
  }
}
