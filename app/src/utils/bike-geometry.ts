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
    this.upperLegDrawing = new SvgDrawing({start: {x: 1594, y: 484}, end: {x:479, y:1900}, path: "M671 368C253.5 994 143.923 1267.02.5 1918c34.388 327.13 387.5 238.5 506.5 0S1495 857.001 1610 472c115-385-521.5-730-939-104Z"})
    this.lowerLeg= new Segment({start: knee, end: heel});
    this.lowerLegDrawing = new SvgDrawing({start: {x:467, y:178} , end: {x: 1087, y: 2102}, path: "M79 415C36.5 231.5 23.27 163.365 69 107c86-106 310.839-133.474 403 0 261 378 247 774 281 976s224 702 201.5 750.5-287.5 54.5-298.5 0S121.5 598.5 79 415Z"})
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
    this.spineDrawing = new SvgDrawing({start: {x:2545, y:2222}, end: {x:617, y:1}, path: "M482.5 1C340.094 266.091 306.455 285.78 1.152 388 64 500 53.63 626.733 114 774c132 322 286.916 552.85 460.001 618C1286 1660 1452 1798 1624 1996s499.86 428.23 721.5 375c221.65-53.23 308.5-223 283.5-462C2610 1562 1968.68 648.966 482.5 1Z"})
    this.arm= new RoundedSegment({start: this.shoulder, end: handleBar.coordinates, radius: 35});
    this.armDrawing = new SvgDrawing({start: {x:2244 , y:0}, end: {x:412, y:2246}, path: "M993.334 1698.26c161.796-158.66 235.826-212.3 357.876-373.01 182.26-239.99 312.78-564.56 354.07-685.251 41.28-120.69 93.19-226.603 122.98-275.113 29.8-48.511 91.91-99.872 185.4-114.771C2221.3 217.021 2381.5 476.854 2328.28 640c-53.23 163.146-141.57 240.184-194.8 300.683L1619.61 1539.6c-44.57 51-211.56 237.45-310.28 340.94-98.72 103.5-495.311 336.85-538.24 393.26-42.929 56.41-51.873 87.35-93.752 97.9-19.512 3.37-257.953 45.96-369.296 71.31-111.343 25.34-151.592 64.19-196.545 163.29-6.663 23.63-6.602 37.88-29.982 42.2-12.841 1.37-20.292.83-36.168-13.51 0 0-13.325-19.95-13.325-42.19s-28.554-47.26-28.554-64.14c0-16.88 10.659-52.05 9.112-85.65-1.08-23.48-9.112-43.72-9.112-59.5 0-15.78 2.476-36.35 28.554-70.04 10.89-16.28 49.493-64.62 49.493-64.62s12.082-54.74 58.06-68.72c45.977-13.99 253.177 17.72 292.2 10.13 39.024-7.6 39.535-5.57 62.819-16.04 25.749-11.57 60.915-37.13 60.915-37.13 27.381-29.19 276.028-280.18 437.825-438.83Z"})
    this.headDrawing =  new SvgDrawing({start: {x:1138, y:747}, end: {x:1141, y:807}, path: "M92.323 432.507s2.201 35.318 15.893 62.078l46.896 45.198 3.899 56.752 26.081 144.283-62.26 96.344c-21.062 44.888-17.33 57.797 10.102 64.467l77.698 25.534c26.967 2.66-30.412 57.058-7.392 68.1 23.019 11.037 39.779-7.211 41.257 4.479.895 7.068-46.503 20.228-21.792 33.518 24.71 13.29 53.365 68.19 52.206 98.21-1.159 30.01-6.59 51.75 14.665 73.84 21.256 22.09 40.289 58.44 170.002 18.45 40.527-11.47 63.469-19.92 99.416 10.79l44.493 39.54L792 1371c164 24 455.06-147.24 402-375.737-1.94-8.334-81.52-92.041-78.28-121.866l2.37-21.872c31.68-11.499 36.83-25.326 44.04-44.696l.06-.181c7.25-19.464 45.78-4.713 45.78-4.713l39.09-45.045-5.8-20.746c-7.74-11.737-7.61-20.278 4.42-40.636l51.2 5.558c11.43 1.241 19.97-26.499 19.97-26.499l-24.52-66.031s-29.53-114.406-11.35-108.486c18.17 5.921 35.08-41.872 29.71-60.647-2.09-7.33-5.06-8.947-5.44-14.673-.61-8.939 2.19-20.255 2.19-20.255l-295.99-238.462S387.687-199.941 131.06 395.344c-2.07 7.944-38.737 37.163-38.737 37.163Z"})
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
    return this.headDrawing.transform({x: this.spine.end.x + 45, y: this.spine.end.y + 70},
      {x: this.spine.end.x + 45, y: this.spine.end.y - (this.spine.end.y - this.spine.start.y) / 44 + 70 }  )
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
