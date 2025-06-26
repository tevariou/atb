import Point from "./Point";
import Stem from "./Stem";

export default class HandleBar extends Point {
  private readonly __brand = "HandleBar";
  readonly width: number;

  constructor({
    stem,
    handleBarReach,
    handleBarHeight,
    handleBarWidth,
  }: {
    stem: Stem;
    handleBarReach: number;
    handleBarHeight: number;
    handleBarWidth: number;
  }) {
    const coordinates = {
      x: stem.start.x + handleBarReach,
      y: stem.start.y + handleBarHeight,
    };
    super(coordinates);
    this.width = handleBarWidth;
  }
}
