import Segment from "./Segment";
import HeadTube from "./HeadTube";

export default class Spacers extends Segment {
  private readonly __brand = "Spacers";

  constructor({
    headTube,
    spacersLength,
  }: {
    headTube: HeadTube;
    spacersLength: number;
  }) {
    const start = {
      x: -Math.cos(headTube.angle) * spacersLength + headTube.start.x,
      y: Math.sin(headTube.angle) * spacersLength + headTube.start.y,
    };
    const end = headTube.start;

    super({ start, end });
  }
}
