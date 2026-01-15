import Segment from "./Segment";
import HeadTube from "./HeadTube";

export default class Spacers extends Segment {
  private readonly __brand = "Spacers";

  constructor({
    headTube,
    tiltAngle,
    spacersLength,
  }: {
    headTube: HeadTube;
    tiltAngle: number;
    spacersLength: number;
  }) {
    const start = {
      x:
        -Math.cos(headTube.angle - tiltAngle) * spacersLength +
        headTube.start.x,
      y:
        Math.sin(headTube.angle - tiltAngle) * spacersLength + headTube.start.y,
    };
    const end = headTube.start;

    super({ start, end });
  }
}
