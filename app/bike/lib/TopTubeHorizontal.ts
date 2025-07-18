import Segment from "./Segment";
import BottomBracket from "./BottomBracket";
import HeadTube from "./HeadTube";

export default class TopTubeHorizontal extends Segment {
  private readonly __brand = "TopTubeHorizontal";

  constructor({
    bottomBracket,
    headTube,
    effectiveSeatTubeAngle,
  }: {
    bottomBracket: BottomBracket;
    headTube: HeadTube;
    effectiveSeatTubeAngle: number;
  }) {
    if (effectiveSeatTubeAngle === 0) {
      throw new Error("Effective seat tube angle cannot be 0");
    }

    const start = {
      x:
        (headTube.start.y - bottomBracket.coordinates.y) /
          Math.tan(-effectiveSeatTubeAngle) +
        bottomBracket.coordinates.x,
      y: headTube.start.y,
    };
    const end = headTube.start;

    super({ start, end });
  }
}
