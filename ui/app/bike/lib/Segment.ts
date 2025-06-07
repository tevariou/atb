import * as d3 from "d3";

import Coordinates from "./Coordinates";

export default class Segment {
  protected _start: Coordinates;
  protected _end: Coordinates;

  constructor({ start, end }: { start: Coordinates; end: Coordinates }) {
    this._start = start;
    this._end = end;
  }

  draw(): string {
    return (
      d3.line()([
        [this.start.x, this.start.y],
        [this.end.x, this.end.y],
      ]) ?? ""
    );
  }

  get start(): Coordinates {
    return this._start;
  }

  get end(): Coordinates {
    return this._end;
  }
}
