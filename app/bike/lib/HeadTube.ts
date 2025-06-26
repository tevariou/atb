import Segment from "./Segment";
import BottomBracket from "./BottomBracket";

export default class HeadTube extends Segment {
  private readonly __brand = "HeadTube";
  angle: number;

  constructor({
    bottomBracket,
    headTubeLength,
    headTubeAngle,
    reachLength,
    stackLength,
  }: {
    bottomBracket: BottomBracket;
    headTubeLength: number;
    headTubeAngle: number;
    reachLength: number;
    stackLength: number;
  }) {
    const start = {
      x: reachLength + bottomBracket.coordinates.x,
      y: stackLength + bottomBracket.coordinates.y,
    };
    const end = {
      x: Math.cos(headTubeAngle) * headTubeLength + start.x,
      y: -Math.sin(headTubeAngle) * headTubeLength + start.y,
    };

    super({ start, end });
    this.angle = headTubeAngle;
  }
}
