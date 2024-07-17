import * as d3 from "d3";

interface Coordinates {
  x: number,
  y: number
}

class Segment {
  protected _start: Coordinates;
  protected _end: Coordinates;

  constructor({
    start,
    end
  }:{start:Coordinates, end: Coordinates}){
    this._start = start;
    this._end = end;
  }

  draw(): string {
    return d3.line()([
      [this.start.x, this.start.y],
      [this.end.x, this.end.y]
    ]) ?? "";
  }
  
  get start(): Coordinates{
    return this._start;
  }

  get end(): Coordinates{
    return this._end;
  }
}

class HeadTube extends Segment {
  private readonly __brand = "HeadTube";
  angle: number;

  constructor({
    bottomBracket, 
    headTubeLength, 
    headTubeAngle, 
    reachLength, 
    stackLength
  }: {bottomBracket: BottomBracket, headTubeLength: number, headTubeAngle: number, reachLength: number, stackLength: number}){    
    const start = {
      x: reachLength + bottomBracket.coordinates.x,
      y: stackLength + bottomBracket.coordinates.y
    };
    const end = {
      x: Math.cos(headTubeAngle) * headTubeLength + start.x,
      y: -Math.sin(headTubeAngle) * headTubeLength + start.y
    };

    super({start, end});
    this.angle = headTubeAngle;
  }
}

class ChainStay extends Segment {
  private readonly __brand = "ChainStay";
  bbDropLength: number;

  constructor({
    bottomBracket, 
    bbDropLength, 
    chainStayLength
  }: {bottomBracket: BottomBracket, bbDropLength: number, chainStayLength: number}){
    const start = {
      x: -Math.sqrt(chainStayLength**2 - bbDropLength**2) + bottomBracket.coordinates.x,
      y: bbDropLength + bottomBracket.coordinates.y
    };
    const end = bottomBracket.coordinates;

    super({start, end});
    this.bbDropLength = bbDropLength;
  }
}

class Crank extends Segment {
  private readonly __brand = "Crank";
  readonly length: number;
  readonly qFactor: number;

  constructor({
    bottomBracket, 
    crankLength, 
    qFactor,
    spinAngle = 0,
  }: {bottomBracket: BottomBracket, crankLength: number, qFactor: number, spinAngle: number}){
    const start = bottomBracket.coordinates;
    const end = rotate(
      {
        x: crankLength + bottomBracket.coordinates.x, 
        y: bottomBracket.coordinates.y
      },
      toRadians(-spinAngle),
      bottomBracket.coordinates
    )
    super({start, end});
    this.length = crankLength;
    this.qFactor = qFactor;
  }
}

class TopTubeHorizontal extends Segment {
  private readonly __brand = "TopTubeHorizontal";

  constructor({
    bottomBracket,
    headTube, 
    effectiveSeatTubeAngle
  }: {bottomBracket: BottomBracket, headTube: HeadTube, effectiveSeatTubeAngle: number}){
    const start = {
      x: (headTube.start.y - bottomBracket.coordinates.y) / Math.tan(-effectiveSeatTubeAngle) + bottomBracket.coordinates.x,
      y: headTube.start.y
    }
    const end = headTube.start;

    super({start, end});
  }
}

class SeatTube extends Segment {
  private readonly __brand = "SeatTube";

  actualAngle: number;
  private breakPoint: Coordinates;

  constructor({
    bottomBracket, 
    topTubeHorizontal, 
    seatTubeLength, 
    actualSeatTubeAngle
  }: {bottomBracket: BottomBracket, topTubeHorizontal: TopTubeHorizontal, seatTubeLength: number, actualSeatTubeAngle: number}){
    const alpha = -actualSeatTubeAngle;
    const h = topTubeHorizontal.start;
    const k = h.y - Math.tan(alpha) * h.x;
    const a = 1 + Math.tan(alpha)**2;
    const b = 2 * ((k - bottomBracket.coordinates.y) * Math.tan(alpha) - bottomBracket.coordinates.x);
    const c = (k - bottomBracket.coordinates.y)**2 - seatTubeLength**2 + bottomBracket.coordinates.x**2;

    let x = (-b - Math.sqrt(b**2 - 4 * a * c)) / (2 * a);
    let y = Math.tan(alpha) * x + h.y - Math.tan(alpha) * h.x;

    const start = {
      x: x,
      y: y
    }
    const end = bottomBracket.coordinates;

    super({start, end});

    y = bottomBracket.coordinates.y + seatTubeLength / 2;
    const m = (topTubeHorizontal.start.y - start.y) / (topTubeHorizontal.start.x - start.x);
    x = (y - start.y + start.x * m) / m;

    this.breakPoint = {
      x: x,
      y: y
    };

    this.actualAngle = actualSeatTubeAngle;
  }

  draw(): string {
    return d3.line()([
      [this.start.x, this.start.y],
      [this.breakPoint.x, this.breakPoint.y],
      [this.end.x, this.end.y],
    ]) ?? "";
  }
}

class Spacers extends Segment {
  private readonly __brand = "Spacers";

  constructor({
    headTube, 
    spacersLength
  }: {headTube: HeadTube, spacersLength: number}){
    const start = {
      x: -Math.cos(headTube.angle) * spacersLength + headTube.start.x,
      y: Math.sin(headTube.angle) * spacersLength + headTube.start.y
    };
    const end = headTube.start;

    super({start, end});
  }
}

class SeatPost extends Segment {
  private readonly __brand = "SeatPost";

  constructor({
    bottomBracket, 
    seatTube, 
    crank, 
    seatPostOffset, 
    riderInseamLength
  }: {bottomBracket: BottomBracket, seatTube: SeatTube, crank: Crank, riderInseamLength: number, seatPostOffset: number}){
    const getXWithOffset = (seatPostLength: number) => -Math.cos(seatTube.actualAngle) * seatPostLength + seatTube.start.x - seatPostOffset;
    const getYWithOffset = (seatPostLength: number) => Math.sin(seatTube.actualAngle) * seatPostLength + seatTube.start.y;
    const getDWithOffset = (seatPostLength: number) => Math.sqrt((distance({x: getXWithOffset(seatPostLength), y: getYWithOffset(seatPostLength)}, bottomBracket.coordinates) + crank.length)**2 + (crank.qFactor / 2)**2);
    const getSeatPostLength = (seatPostLength: number): number => {
      if (riderInseamLength - getDWithOffset(seatPostLength) < 1) {
          return seatPostLength;
      }
      return getSeatPostLength(seatPostLength + 1);
    };
    const xWithOffset = getXWithOffset(getSeatPostLength(0));
    const yWithOffset = getYWithOffset(getSeatPostLength(0));

    const start = {
        x: xWithOffset,
        y: yWithOffset
    };
    const end = seatTube.start;

    super({start, end});
  }
}

class Stem extends Segment {
  private readonly __brand = "Stem";

  constructor({
    spacers, 
    headTube, 
    stemLength, 
    stemAngle
  }: {spacers: Spacers, headTube: HeadTube, stemLength: number, stemAngle: number}){
    const x = -Math.cos(headTube.angle) * stemLength;
    const y = Math.sin(headTube.angle) * stemLength;
    const start = {
        x: Math.sin(stemAngle) * x + Math.cos(stemAngle) * y + spacers.start.x,
        y: -Math.cos(stemAngle) * x + Math.sin(stemAngle) * y + spacers.start.y
    };

    const end = spacers.start;

    super({start, end});
  }
}

class Fork extends Segment {
  private readonly __brand = "Fork";

  constructor({
    bottomBracket, 
    headTube, 
    chainStay, 
    forkOffsetLength, 
    crownToAxleLength, 
    frontCenterLength, 
    wheelBase
  }: {bottomBracket: BottomBracket, headTube: HeadTube, chainStay: ChainStay, forkOffsetLength: number, crownToAxleLength: number, frontCenterLength: number, wheelBase: number}){
    let end: Coordinates;

    if (frontCenterLength !== 0) {
      end = {
        x: Math.sqrt(frontCenterLength**2 - chainStay.bbDropLength**2) + bottomBracket.coordinates.x,
        y: chainStay.bbDropLength + bottomBracket.coordinates.y
      };
    } else if (wheelBase !== 0) {
      end = {
        x: chainStay.start.x + wheelBase,
        y: chainStay.start.y
      };
    } else {
      const unRotatedFrontAxleWithOffsetCoordinates = {
        x: headTube.end.x + forkOffsetLength,
        y: headTube.end.y - crownToAxleLength
      }
  
      const frontAxleWithOffsetCoordinates = rotate(unRotatedFrontAxleWithOffsetCoordinates, toRadians(90) - headTube.angle, headTube.end)
  
      end = {
        x: frontAxleWithOffsetCoordinates.x,
        y: frontAxleWithOffsetCoordinates.y
      };
    }

    const start = headTube.end;

    super({start, end});
  }
}

class RoundedSegment extends Segment {

    protected readonly radius: number;

    constructor({start, end, radius}: {start:Coordinates, end:Coordinates, radius:number}){
      super({start, end});
      this.radius = radius;
    }

    draw(): string {
        const aboveStart = {
          x: this.start.x + this.radius ,
          y: this.start.y + this.radius / 2, // above in horizontal
        }
        const aboveEnd = {
          x: this.end.x + this.radius / 2, // above in vertical
          y: this.end.y + this.radius 
        }
        const angle = Math.atan2(aboveEnd.y - aboveStart.y, aboveEnd.x - aboveStart.x);
        const offsetX = this.radius * Math.sin(angle);
        const offsetY = this.radius * Math.cos(angle);

        return `
            M${aboveStart.x - offsetX},${aboveStart.y + offsetY}
            A${this.radius},${this.radius} 0 0,1 ${aboveStart.x + offsetX},${aboveStart.y - offsetY}
            L${aboveEnd.x + offsetX},${aboveEnd.y - offsetY}
            A${this.radius},${this.radius} 0 0,1 ${aboveEnd.x - offsetX},${aboveEnd.y + offsetY}
            Z
        `;
    }
}

class SvgDrawing {
  private readonly _path: string;
  private readonly _start: Coordinates;
  private readonly _end: Coordinates;

  constructor({start, end, path}:{start: Coordinates, end: Coordinates, path: string}){
    this._path = path;
    this._start = start;
    this._end = end ;
  }

  transform(newStart: Coordinates, newEnd: Coordinates): string{
    let result = `translate(${newStart.x}, ${newStart.y}) `
    result += `rotate(${(- Math.atan2((this._end.y - this._start.y), (this._end.x - this._start.x))) * 180 / Math.PI}) `
    result += `scale(${distance(newStart, newEnd) / distance(this._start, this._end)}) `
    result += `rotate(${(( Math.atan2((newEnd.y - newStart.y), (newEnd.x - newStart.x))) * 180 / Math.PI)}) `
    result += `translate(${-this._start.x}, ${-this._start.y})` 
    return result
  }
  get path(){
    return this._path;
  }

}

class LowerBody {
  private readonly __brand = "LowerBody";
  private readonly upperLeg: Segment;
  private readonly upperLegDrawing: SvgDrawing;
  private readonly lowerLeg: Segment;
  private readonly lowerLegDrawing: SvgDrawing;
  private readonly feet: Segment;
  private readonly feetDrawing: SvgDrawing;
  private readonly _knee: Coordinates;
  private readonly _end: Coordinates;

  constructor({
    bottomBracket, 
    seatPost, 
    crank, 
    riderInseamLength,
    riderUpperLegLength,
    riderFootLength
  }: {bottomBracket: BottomBracket, seatPost: SeatPost, crank: Crank, riderInseamLength: number, riderUpperLegLength: number, riderFootLength: number}){
    const fromSaddleToPedal = Math.sqrt((distance(seatPost.start, bottomBracket.coordinates) + crank.length)**2 + (crank.qFactor / 2)**2);

    let heel: Coordinates;

    if (fromSaddleToPedal > riderInseamLength) {
      heel = {
        x: seatPost.start.x,
        y: seatPost.start.y - riderInseamLength
      }
    }

    heel = {
      x: crank.end.x - riderFootLength * 2 / 3,
      y: crank.end.y
    }
    
    let knee: Coordinates;

    if (fromSaddleToPedal > riderInseamLength) {
      knee = {
        x: seatPost.start.x,
        y: seatPost.start.y - riderUpperLegLength
      }
    } else {
      const lowerLeg = riderInseamLength - riderUpperLegLength;
      const theta = Math.atan((seatPost.start.y - heel.y) / (seatPost.start.x - heel.x));
      const d = Math.sqrt(distance(heel, seatPost.start)**2 + (crank.qFactor / 2)**2);
      const gamma = Math.acos((d**2 + lowerLeg**2 - riderUpperLegLength**2) / (2 * d * lowerLeg));

      knee = {
        x:  Math.abs(-lowerLeg * Math.cos(theta - gamma)) + heel.x,
        y:  Math.abs(-lowerLeg * Math.sin(theta - gamma)) + heel.y
      };
    }
    this._end = {
      x: heel.x + riderFootLength,
      y: heel.y
    }
    this._knee = knee;
    this.upperLeg = new Segment({start: seatPost.start, end: knee});
    this.upperLegDrawing = new SvgDrawing({start: {x: 2348, y: 625}, end: {x: 583, y: 1593}, path: "M2238.45 3S1517 177 1283 311c-134 50-928.553 698-928.553 698l-302 312c-71.972 97.79-51.849 152.47-24 250 29.192 66.99 544.001 30 558 20 14-10 141-114 155-128 104.067-27.45 149-47.45 253-78 316.223-92.89 416.153-164.51 601.323-297.21l6.68-4.79c185.05-126.276 293.11-203.129 416-242 481.03-149.165 409.39-386.648 220-838Z"});
    this.lowerLeg= new Segment({start: knee, end: heel});
    this.lowerLegDrawing = new SvgDrawing({start: {x:510, y: 257} , end: {x: 1149, y: 2416}, path: "M85 475.002C-32.224 273.782-23.968 90.089 113 17c136.969-73.088 310 161.5 497 422.5l116.5 193C828.759 788.854 818.837 928.689 841 1165c44.261 472.09 204 792 218 820 14 28.01 1 97.5-23 128-99.5 93.5-417 10-417-72s-98.314-490.71-234-754c-78.258-192.57-137.009-310.564-172-473.998-31.465-134.024-60.089-203.517-128-338Z"})
    this.feet = new Segment({start: heel, end: this._end});
    this.feetDrawing = new SvgDrawing({start: {x: 1306, y: 381}, end: {x:3, y: 719}, path: "M514 259C366.818 382.995 131.999 395 50 425c-82 30-44 128 16 160 60 31.999 276.409 78.931 414 42 137.59-36.931 220.98-80.143 394-154 76.928-33.565 150.75-32.65 256-48 80.39-15.522 120.89-28.533 142-100 40.12-58.305-28.99-315.54-90-322-56.24 21.285-51.78 29.893-52 46-21.69 106.773-127.23 169.389-460 24-27.5 84.715-83.497 124.919-156 186Z"})


  }

  draw(): string {
    return this.upperLeg.draw() + " " + this.lowerLeg.draw() + " " + this.feet.draw()
  }

  upperLegTransform(): string {
    return this.upperLegDrawing.transform(this.upperLeg.start, this.upperLeg.end);
  }
  lowerLegTransform(): string{
    return this.lowerLegDrawing.transform(this.lowerLeg.start, this.lowerLeg.end);
  }
  feetTransform(): string{
    return this.feetDrawing.transform(this.lowerLeg.end, this._end);
  }
  
  getfeetPath(): string {
    return this.feetDrawing.path;
  }

  getUpperLegPath(){
    return this.upperLegDrawing.path;
  }

  getLowerLegPath(){
    return this.lowerLegDrawing.path;
  }
}

class UpperBody {
  private readonly __brand = "UpperBody";
  private readonly shoulder: Coordinates;
  private readonly spine: Segment;
  private readonly spineDrawing: SvgDrawing;
  private readonly arm: Segment;
  private readonly armDrawing: SvgDrawing;
  private readonly headDrawing: SvgDrawing;

  constructor({
    seatPost, 
    handleBar,
    riderArmLength, 
    riderSpineLength
  }: {seatPost: SeatPost, handleBar: HandleBar, riderArmLength: number, riderSpineLength: number}){
    const h = handleBar.coordinates;
    const s = seatPost.start;
    const projectedArmlength = Math.sqrt(riderArmLength**2 - (handleBar.width / 2)**2);

    const m = -(h.x - s.x) / (h.y - s.y);
    const k = -(s.x**2 + s.y**2 - h.x**2 - h.y**2 - riderSpineLength**2 + projectedArmlength**2) / (2 * (h.y - s.y));
    const a = 1 + m**2;
    const b = 2 * (m * (k - s.y) - s.x);
    const c = (k - s.y)**2 - riderSpineLength**2 + s.x**2;
    const delta = b**2 - 4 * a * c;

    // FIXME: handle case when delta < 0
    let x = (-b - Math.sqrt(delta)) / (2 * a);
    let y = m * x + k;
    if (y < h.y) {
      x = (-b + Math.sqrt(delta)) / (2 * a);
      y = m * x + k;
    }

    this.shoulder = {
      x: x,
      y: y
    };

    this.spine = new RoundedSegment({start: seatPost.start, end: this.shoulder, radius:45});
    this.spineDrawing = new SvgDrawing({start: {x:2504, y:2192}, end: {x:360, y:0}, path: "M683 92c-226.5-66-333.127-60.826-524 98C49 281.531 3 474 3 524s311.5 227.5 447.5 355.5 268.5 184.5 320 214S1063 1320 1063 1320s206 258 280 334 208 438 244 476 273.93 563.11 842 190c132.16-73.78 89.72-281.36-76-780-110-273-197-373.5-351-538-201-188.5-275-282.261-385-368-316.58-246.754-510.48-370.033-934-542Z"});
    this.arm= new RoundedSegment({start: this.shoulder, end: handleBar.coordinates, radius: 35});
    this.armDrawing = new SvgDrawing({start: {x:2191, y:0}, end: {x:563, y:2414}, path: "M2115 45c198.34-36.832 421.94 142.692 358 280s-255.4 358-302 462c-46.6 104-298 570-318 602s-105.17 123.57-152 184c-46.83 60.43-238 324-326 404s-520.396 399.16-565.5 466c-45.103 66.84-54.5 103.5-98.5 116-20.5 4-379 81-388 84.5s-98.5 44.5-98.5 44.5c6.5-5-74.168 58.74-108 149-7 28-6.936 44.88-31.5 50-13.492 1.63-21.32.98-38-16-5.667-5.75-6.429-10.84 0-26-6.72-1.8-9.891-6.41-14-24 0 0-30-56-30-76s8.5-100.5 8.5-100.5-1.672-63.35-8.5-71.5c-2.271-25.71 2.601-43.07 30-83 11.442-19.28 76.677-85.38 76-87-.677-1.62 8.514-61.23 37-71 28.486-9.77 266 21 307 12s41.537-6.6 66-19c27.054-13.71 64-44 64-44l294-304 166-216s71.78-125.46 376-442l332-532c50.6-110.67 47.99-224.096 40-280-5.4-37.743 28.52-200.88 129.22-326 48.45-60.202 112.35-111.603 194.78-136Z"});
    this.headDrawing =  new SvgDrawing({start: {x:1128, y:747}, end: {x:1131, y:807}, path:"M3 438.126s6 34.874 22.5 60L77 538l10 56 41.5 140.626-51.5 102.5c-16.095 46.899-10.991 59.33 17 63l80 17c27.096-.266-24.077 60.007 0 68.5 24.076 8.493 38.769-11.462 41.5 0 1.652 6.934-44.049 25.124-18.048 35.674 26 10.55 60.412 62.04 62.499 92 2.088 29.97-.967 52.16 22.549 71.83 23.515 19.67 46.36 53.75 171 0 39.052-15.78 60.948-26.66 100 0l48.5 34.5 139.5 74C787.427 1056.03 858.56 914.447 1076 832c8-3.033-8-36-8-66v-22c30.25-14.85 33.88-29.153 38.95-49.188l.05-.186c5.1-20.133 45-9.626 45-9.626l34-49-8-20c-8.97-10.832-9.76-19.337 0-40.874h51.5c11.5 0 17-28.5 17-28.5l-31.5-63s-41.71-110.55-23-106.626c18.71 3.924 30.36-45.414 23-63.5-2.87-7.062-6-8.349-7-14-1.56-8.822 0-20.374 0-20.374L888 74S228.388-222.503 37.5 397C36.3 405.121 3 438.126 3 438.126Z" })
  }

  spineDrawingTransform(): string{
    return this.spineDrawing.transform(this.spine.start, this.spine.end);
  }

  getSpineDrawingPath(): string{
    return this.spineDrawing.path;
  }

  getArmDrawingPath(): string{
    return this.armDrawing.path
  }

  armDrawingTransform(): string{
    return this.armDrawing.transform(this.arm.start, this.arm.end);
  }

  headTransform(): string {
    return this.headDrawing.transform(this.spine.end, {x: this.spine.end.x, y: this.spine.end.y - (this.spine.end.y - this.spine.start.y) / 45} )
  }

  getHeadDrawing(): string{
    return this.headDrawing.path;
  }

  draw(): string {
    return this.arm.draw()
  }
}

class Point {
  coordinates: Coordinates = {
    x: 0,
    y: 0
  };

  constructor(coordinates: Coordinates) {
    this.coordinates = coordinates;
  }
}

class BottomBracket extends Point {
  private readonly __brand = "BottomBracket";
}

class HandleBar extends Point {
  private readonly __brand = "HandleBar";
  readonly width: number;

  constructor({
    stem, 
    handleBarReach, 
    handleBarHeight, 
    handleBarWidth
  }: {stem: Stem, handleBarReach: number, handleBarHeight: number, handleBarWidth: number}) {
    const coordinates = {
      x: stem.start.x + handleBarReach,
      y: stem.start.y + handleBarHeight
    }
    super(coordinates);
    this.width = handleBarWidth;
  }
};

const toRadians = (degrees: number) => degrees * Math.PI / 180;

const distance = (start: Coordinates, end: Coordinates) => Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2);

const rotate = (coordinates: Coordinates, angle: number, origin: Coordinates = {x: 0, y: 0}): Coordinates => {
  return {
    x: ((coordinates.x - origin.x) * Math.cos(angle) - (coordinates.y - origin.y) * Math.sin(angle)) + origin.x,
    y: ((coordinates.x - origin.x) * Math.sin(angle) + (coordinates.y - origin.y) * Math.cos(angle)) + origin.y
  };
}

export class BikeGeometry {
  private _headTube: HeadTube;
  private _downTube: Segment;
  private _topTubeHorizontal: TopTubeHorizontal;
  private _seatTube: SeatTube;
  private _seatStay: Segment;
  private _crank: Crank;
  private _spacers: Spacers;
  private _stem: Stem;
  private _seatPost: SeatPost; 
  private _chainStay: ChainStay;
  private _fork: Fork;
  private _topTube: Segment;

  private _lowerBody: LowerBody;
  private _upperBody: UpperBody;

  constructor(
    {
      bottomBracketCoordinates = {x: 0, y: 0} as Coordinates,
      reachLength = 0,
      stackLength = 0,
      headTubeLength = 0,
      headTubeAngle = 0,
      chainStayLength = 0,
      actualSeatTubeAngle = 0,
      seatTubeLength = 0,
      forkOffsetLength = 0,
      bbDropLength = 0,
      crownToAxleLength = 0,
      frontCenterLength = 0,
      wheelBase = 0,
      crankLength = 0,
      spacersLength = 0,
      stemLength = 0,
      stemAngle = 0,
      riderInseamLength = 0,
      seatPostOffset = 0,
      riderUpperLegLength = 0,
      riderFootLength = 0,
      qFactor = 0,
      handleBarWidth = 0,
      handleBarReach = 0,
      handleBarHeight = 0,
      riderArmLength = 0,
      riderSpineLength = 0,
      effectiveSeatTubeAngle = 0,
      spinAngle = 0
    }
  ){
    const bottomBracket = new BottomBracket(bottomBracketCoordinates);

    const headTube = new HeadTube({bottomBracket, headTubeLength, headTubeAngle: toRadians(headTubeAngle), reachLength, stackLength});
    const chainStay = new ChainStay({bottomBracket, bbDropLength, chainStayLength});

    const topTubeHorizontal = new TopTubeHorizontal({headTube, bottomBracket, effectiveSeatTubeAngle: toRadians(effectiveSeatTubeAngle)});

    const seatTube = new SeatTube({bottomBracket, topTubeHorizontal, seatTubeLength, actualSeatTubeAngle: toRadians(actualSeatTubeAngle)});

    const fork = new Fork({bottomBracket, headTube, chainStay, forkOffsetLength, crownToAxleLength, frontCenterLength, wheelBase});

    this._downTube = new Segment({start: headTube.end, end: bottomBracket.coordinates});
    this._topTube = new Segment({start: headTube.start, end: seatTube.start});
    this._seatStay = new Segment({start: seatTube.start, end: chainStay.start});

    const crank = new Crank({bottomBracket, crankLength, qFactor, spinAngle});
    const spacers = new Spacers({headTube, spacersLength});
    const stem = new Stem({spacers, headTube, stemLength, stemAngle: toRadians(stemAngle)});
    const handleBar = new HandleBar({stem, handleBarReach, handleBarHeight, handleBarWidth});

    const seatPost =  new SeatPost({bottomBracket, seatTube, crank, riderInseamLength, seatPostOffset});
    const lowerBody = new LowerBody({bottomBracket, seatPost, crank, riderInseamLength, riderUpperLegLength, riderFootLength});
    const upperBody = new UpperBody({seatPost, handleBar, riderArmLength, riderSpineLength});

    this._headTube = headTube;
    this._chainStay = chainStay;
    this._crank = crank;
    this._topTubeHorizontal = topTubeHorizontal;
    this._seatTube = seatTube;
    this._spacers = spacers;
    this._seatPost = seatPost;
    this._stem = stem;
    this._fork = fork;
    this._lowerBody = lowerBody;
    this._upperBody = upperBody;
  }

  get headTube(): HeadTube {
    return this._headTube;
  }

  get downTube(): Segment {
    return this._downTube;
  }

  get topTube(): Segment {
    return this._topTube;
  }
  
  get seatTube(): SeatTube{
    return this._seatTube;
  }

  get fork(): Fork {
    return this._fork;
  }

  get chainStay(): ChainStay {
    return this._chainStay;
  }

  get topTubeHorizontal(): TopTubeHorizontal {
    return this._topTubeHorizontal;
  }

  get seatStay(): Segment {
    return this._seatStay;
  }

  get crank(): Crank {
    return this._crank;
  }

  get spacers(): Spacers {
    return this._spacers;
  }
  
  get stem(): Stem {
    return this._stem;
  }

  get seatPost(): SeatPost {
    return this._seatPost;
  }

  get lowerBody(): LowerBody {
    return this._lowerBody;
  }

  get upperBody(): UpperBody {
    return this._upperBody;
  }
}
