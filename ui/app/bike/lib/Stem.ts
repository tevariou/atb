import Segment from "./Segment";
import Spacers from "./Spacers";
import HeadTube from "./HeadTube";

export default class Stem extends Segment {
  private readonly __brand = "Stem";

  constructor({
    spacers,
    headTube,
    stemLength,
    stemAngle,
  }: {
    spacers: Spacers;
    headTube: HeadTube;
    stemLength: number;
    stemAngle: number;
  }) {
    const x = -Math.cos(headTube.angle) * stemLength;
    const y = Math.sin(headTube.angle) * stemLength;
    const start = {
      x: Math.sin(stemAngle) * x + Math.cos(stemAngle) * y + spacers.start.x,
      y: -Math.cos(stemAngle) * x + Math.sin(stemAngle) * y + spacers.start.y,
    };

    const end = spacers.start;

    super({ start, end });
  }
}
