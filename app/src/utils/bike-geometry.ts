import * as d3 from "d3";

interface Coordinates {
  x: number,
  y: number
}

type HeadTubeLength = number & { __brand: "HeadTubeLength" };

class Segment {
  protected _start: Coordinates;
  protected _end: Coordinates;

  constructor(start:Coordinates, end: Coordinates){
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

  constructor(bbCoordinates: Coordinates, headTubeLength: HeadTubeLength, headTubeAngle: number, reachLength: number, stackLength: number){
    const start = {
      x: reachLength + bbCoordinates.x,
      y: stackLength + bbCoordinates.y
    };
    const end = {
      x: Math.cos(headTubeAngle) * headTubeLength + start.x,
      y: -Math.sin(headTubeAngle) * headTubeLength + start.y
    };

    super(start, end);
  }
}

class ChainStay extends Segment {
  private readonly __brand = "ChainStay";

  constructor(bbCoordinates: Coordinates, bbDropLength: number, chainStayLength: number){
    const start = {
      x: -Math.sqrt(chainStayLength**2 - bbDropLength**2) + bbCoordinates.x,
      y: bbDropLength + bbCoordinates.y
    };
    const end = bbCoordinates;

    super(start, end);
  }
}

class Crank extends Segment {
  private readonly __brand = "Crank";

  constructor(bbCoordinates: Coordinates, crankLength: number){
    const start = bbCoordinates;
    const end = {
      x: crankLength + bbCoordinates.x, 
      y: bbCoordinates.y
    }

    super(start, end);
  }
}

class TopTubeHorizontal extends Segment {
  private readonly __brand = "TopTubeHorizontal";

  constructor(headTube: HeadTube, bbCoordinates: Coordinates, effectiveSeatTubeAngle: number){
    const epsilon = -effectiveSeatTubeAngle;
    const start = {
      x: (headTube.start.y - bbCoordinates.y) / Math.tan(epsilon) + bbCoordinates.x,
      y: headTube.start.y
    }
    const end = headTube.start;

    super(start, end);
  }
}

const toRadians = (degrees: number) => degrees * Math.PI / 180;

const distance = (start: Coordinates, end: Coordinates) => Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2);

const rotate = (coordinates: Coordinates, angle: number, origin: Coordinates = {x: 0, y: 0}): Coordinates => {
  return {
    x: ((coordinates.x - origin.x) * Math.cos(angle) - (coordinates.y - origin.y) * Math.sin(angle)) + origin.x,
    y: ((coordinates.x - origin.x) * Math.sin(angle) + (coordinates.y - origin.y) * Math.cos(angle)) + origin.y
  };
}

export class BikeGeometry {
  bbCoordinates: Coordinates = {x: 0, y: 0};

  protected reachLength = 0;
  protected stackLength = 0;
  protected headTubeLength = 0 as HeadTubeLength;
  protected headTubeAngle = 0;
  protected chainStayLength = 0;
  protected actualSeatTubeAngle = 0;
  protected effectiveSeatTubeAngle = 0;
  protected seatTubeLength = 0;
  protected forkOffsetLength = 0;
  protected bbDropLength = 0;
  protected crownToAxleLength = 0;
  protected frontCenterLength = 0;
  protected wheelBase = 0;
  protected crankLength = 0;
  protected spacersLength = 0;
  protected stemLength = 0;
  protected stemAngle = 0;
  protected riderInseamLength = 0;
  protected seatPostOffset = 0;
  protected riderUpperLegLength = 0;
  protected riderFootLength = 0;
  protected qFactor = 0;
  protected handlebarWidth = 0;
  protected handlebarReach = 0;
  protected handlebarHeight = 0;
  protected riderArmLength = 0;
  protected riderSpineLength = 0;

  private readonly _headTube: HeadTube;
  private _downTube: Segment;
  private _topTubeHorizontal: Segment;
  private _upperSeatTube: Segment;
  private _lowerSeatTube: Segment;
  private _seatStay: Segment;
  private _crank: Segment;
  private _crankDown: Segment;
  private _spacers: Segment;
  private _stem: Segment;
  private _seatPost: Segment; 
  private _chainStay: ChainStay;
  private _fork: Segment;
  private _topTube: Segment;

  private _lowerLeg: Segment;
  private _upperLeg: Segment;
  private _feet: Segment;
  private _spine: Segment;
  private _arm: Segment;

  constructor(
    {
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
      handlebarWidth = 0,
      handlebarReach = 0,
      handlebarHeight = 0,
      riderArmLength = 0,
      riderSpineLength = 0,
      effectiveSeatTubeAngle = 0
    }
  ){
    this.reachLength = reachLength;
    this.stackLength = stackLength;
    this.headTubeLength = headTubeLength as HeadTubeLength;
    this.headTubeAngle = toRadians(headTubeAngle);
    this.chainStayLength = chainStayLength;
    this.actualSeatTubeAngle = toRadians(actualSeatTubeAngle);
    this.effectiveSeatTubeAngle = toRadians(effectiveSeatTubeAngle);
    this.seatTubeLength = seatTubeLength;
    this.forkOffsetLength = forkOffsetLength;
    this.bbDropLength = bbDropLength;
    this.crownToAxleLength = crownToAxleLength;
    this.frontCenterLength = frontCenterLength;
    this.crankLength = crankLength;
    this.spacersLength = spacersLength;
    this.stemLength = stemLength;
    this.stemAngle = toRadians(stemAngle);
    this.riderInseamLength = riderInseamLength;
    this.seatPostOffset = seatPostOffset;
    this.riderUpperLegLength = riderUpperLegLength;
    this.riderFootLength = riderFootLength;
    this.qFactor = qFactor;
    this.handlebarWidth = handlebarWidth;
    this.handlebarReach = handlebarReach;
    this.handlebarHeight = handlebarHeight;
    this.riderArmLength = riderArmLength;
    this.riderSpineLength = riderSpineLength;
    this.wheelBase = wheelBase;

    const headTube = new HeadTube(this.bbCoordinates, this.headTubeLength, this.headTubeAngle, this.reachLength, this.stackLength);
    const chainStay = new ChainStay(this.bbCoordinates, this.bbDropLength, this.chainStayLength);
    const crank = new Crank(this.bbCoordinates, this.crankLength);

    const topTubeHorizontal = new TopTubeHorizontal(headTube, this.bbCoordinates, this.effectiveSeatTubeAngle);

    this._crankDown = new Segment(this.bbCoordinates, this.crankDownEndCoordinates)

    this._upperSeatTube = new Segment(this.seatTubeTopCoordinates, this.seatTubeFlexPointCoordinates);
    this._spacers = new Segment(this.spacersStartCoordinates, this.headTube.start);

    this._seatPost =  new Segment(this.seatPostStartCoordinates, this.upperSeatTube.start);
    this._stem = new Segment(this.stemStartCoordinates, this.spacers.start);

    this._downTube = new Segment(this.headTube.end, this.bbCoordinates);
    this._lowerSeatTube = new Segment(this.upperSeatTube.end, this.bbCoordinates);
    this._fork = new Segment(this.headTube.end, this.frontAxleCoordinates);
    this._topTube = new Segment(this.headTube.start, this.upperSeatTube.start);
    this._seatStay = new Segment(this.upperSeatTube.start, this.chainStay.start);

    this._feet = new Segment(this.heelCoordinates, this.feetEndCoordinates);
    this._upperLeg = new Segment(this.seatPost.start, this.riderKneeCoordinates);
    this._lowerLeg = new Segment(this.upperLeg.end, this.feet.start);
    this._spine = new Segment(this.seatPost.start, this.riderShoulderCoordinates);
    this._arm = new Segment(this.spine.end, this.handlebarCoordinates);

    this._headTube = headTube;
    this._chainStay = chainStay;
    this._crank = crank;
    this._topTubeHorizontal = topTubeHorizontal;
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

  get lowerSeatTube(): Segment {
    return this._lowerSeatTube;
  }
  
  get upperSeatTube(): Segment{
    return this._upperSeatTube;
  }

  get frontAxleCoordinates(): Coordinates {
    if (this.frontCenterLength !== 0) {
      return {
        x: Math.sqrt(this.frontCenterLength**2 - this.bbDropLength**2) + this.bbCoordinates.x,
        y: this.bbDropLength + this.bbCoordinates.y
      };
    }

    if (this.wheelBase !== 0) {
      return {
        x: this.chainStay.start.x + this.wheelBase,
        y: this.chainStay.start.y
      };
    }

    const unRotatedFrontAxleWithOffsetCoordinates = {
      x: this.headTube.end.x + this.forkOffsetLength,
      y: this.headTube.end.y - this.crownToAxleLength
    }

    const frontAxleWithOffsetCoordinates = rotate(unRotatedFrontAxleWithOffsetCoordinates, toRadians(90) - this.headTubeAngle, this.headTube.end)

    return {
      x: frontAxleWithOffsetCoordinates.x,
      y: frontAxleWithOffsetCoordinates.y
    };
  }

  get fork(): Segment {
    return this._fork;
  }

  get chainStay(): ChainStay {
    return this._chainStay;
  }

  get topTubeHorizontal() {
    return this._topTubeHorizontal;
  }

  private get seatTubeTopCoordinates(): Coordinates {
    const alpha = -this.actualSeatTubeAngle;
    const h = this.topTubeHorizontal.start;
    const k = h.y - Math.tan(alpha) * h.x;
    const a = 1 + Math.tan(alpha)**2;
    const b = 2 * ((k - this.bbCoordinates.y) * Math.tan(alpha) - this.bbCoordinates.x);
    const c = (k - this.bbCoordinates.y)**2 - this.seatTubeLength**2 + this.bbCoordinates.x**2;

    const x = (-b - Math.sqrt(b**2 - 4 * a * c)) / (2 * a);
    const y = Math.tan(alpha) * x + h.y - Math.tan(alpha) * h.x;

    return {
      x: x,
      y: y
    };
  }

  private get seatTubeFlexPointCoordinates(): Coordinates {
    // The height of flex point is arbitrary, we display it at 1/2 of the seat tube length
    const upperSeatTube =  this.seatTubeTopCoordinates;

    const y = this.bbCoordinates.y + this.seatTubeLength / 2;
    const m = (this.topTubeHorizontal.start.y - upperSeatTube.y) / (this.topTubeHorizontal.start.x - upperSeatTube.x);
    const x = (y - upperSeatTube.y + upperSeatTube.x * m) / m;
    return {
      x: x,
      y: y
    };
  }

  get seatStay(): Segment {
    return this._seatStay;
  }

  get crank(): Segment {
    return this._crank;
  }

  private get crankDownEndCoordinates(): Coordinates {
    return {
      x: (this.crank.end.x - this.bbCoordinates.x) * Math.cos(toRadians(-90)) - (this.crank.end.y - this.bbCoordinates.y) * Math.sin(toRadians(-90)) + this.bbCoordinates.x,
      y: (this.crank.end.x - this.bbCoordinates.x) * Math.sin(toRadians(-90)) + (this.crank.end.y - this.bbCoordinates.y) * Math.cos(toRadians(-90)) + this.bbCoordinates.y
    };
  }

  get crankDown() {
    return this._crankDown;
  }

  private get spacersStartCoordinates(): Coordinates {
    return {
      x: -Math.cos(this.headTubeAngle) * this.spacersLength + this.headTube.start.x,
      y: Math.sin(this.headTubeAngle) * this.spacersLength + this.headTube.start.y
    };
  }

  get spacers(): Segment {
    return this._spacers;
  }
  
  private get stemStartCoordinates(): Coordinates {
    const x = -Math.cos(this.headTubeAngle) * this.stemLength;
    const y = Math.sin(this.headTubeAngle) * this.stemLength;
    return {
        x: Math.sin(this.stemAngle) * x + Math.cos(this.stemAngle) * y + this.spacers.start.x,
        y: -Math.cos(this.stemAngle) * x + Math.sin(this.stemAngle) * y + this.spacers.start.y
    };
  }
  
  get stem(): Segment {
    return this._stem;
  }

  private get fromSaddleToPedal(): number {
    return Math.sqrt((distance(this.seatPost.start, this.bbCoordinates) + this.crankLength)**2 + (this.qFactor / 2)**2);
  }

  private get seatPostStartCoordinates(): Coordinates {
    const getXWithOffset = (seatPostLength: number) => -Math.cos(this.actualSeatTubeAngle) * seatPostLength + this.upperSeatTube.start.x - this.seatPostOffset;
    const getYWithOffset = (seatPostLength: number) => Math.sin(this.actualSeatTubeAngle) * seatPostLength + this.upperSeatTube.start.y;
    const getDWithOffset = (seatPostLength: number) => Math.sqrt((distance({x: getXWithOffset(seatPostLength), y: getYWithOffset(seatPostLength)}, this.bbCoordinates) + this.crankLength)**2 + (this.qFactor / 2)**2);
    const getSeatPostLength = (seatPostLength: number): number => {
      if (this.riderInseamLength - getDWithOffset(seatPostLength) < 1) {
          return seatPostLength;
      }
      return getSeatPostLength(seatPostLength + 1);
    };
    const xWithOffset = getXWithOffset(getSeatPostLength(0));
    const yWithOffset = getYWithOffset(getSeatPostLength(0));

    return {
        x: xWithOffset,
        y: yWithOffset
    };
  }

  get seatPost(): Segment {
    return this._seatPost;
  }

  private get heelCoordinates(): Coordinates {
    if (this.fromSaddleToPedal > this.riderInseamLength) {
      return {
        x: this.seatPost.start.x,
        y: this.seatPost.start.y - this.riderInseamLength
      }
    }

    return {
      x: this.crank.end.x - this.riderFootLength * 2 / 3,
      y: this.crank.end.y
    }
  }

  private get riderKneeCoordinates(): Coordinates {
    if (this.fromSaddleToPedal > this.riderInseamLength) {
      return {
        x: this.seatPost.start.x,
        y: this.seatPost.start.y - this.riderUpperLegLength
      }
    }

    const lowerLeg = this.riderInseamLength - this.riderUpperLegLength;
    const theta = Math.atan((this.seatPost.start.y - this.feet.start.y) / (this.seatPost.start.x - this.feet.start.x));
    const d = Math.sqrt(distance(this.feet.start, this.seatPost.start)**2 + (this.qFactor / 2)**2);
    const gamma = Math.acos((d**2 + lowerLeg**2 - this.riderUpperLegLength**2) / (2 * d * lowerLeg));

    return {
      x:  Math.abs(-lowerLeg * Math.cos(theta - gamma)) + this.feet.start.x,
      y:  Math.abs(-lowerLeg * Math.sin(theta - gamma)) + this.feet.start.y
    };
  }

  private get feetEndCoordinates(): Coordinates {
    const heelCoordinates = this.heelCoordinates;
    return {
      x: heelCoordinates.x + this.riderFootLength,
      y: heelCoordinates.y
    };
  }

  get feet(): Segment {
    return this._feet;
  }

  get upperLeg(): Segment {
    return this._upperLeg;
  }
  
  get lowerLeg(): Segment {
    return this._lowerLeg;
  }

  private get handlebarCoordinates(): Coordinates {
    return {
      x: this.stem.start.x + this.handlebarReach,
      y: this.stem.start.y + this.handlebarHeight
    }
  }

  private get riderShoulderCoordinates(): Coordinates {
    const h = this.handlebarCoordinates;
    const s = this.seatPost.start;
    const projectedArmlength = Math.sqrt(this.riderArmLength**2 - (this.handlebarWidth / 2)**2);

    const m = -(h.x - s.x) / (h.y - s.y);
    const k = -(s.x**2 + s.y**2 - h.x**2 - h.y**2 - this.riderSpineLength**2 + projectedArmlength**2) / (2 * (h.y - s.y));
    const a = 1 + m**2;
    const b = 2 * (m * (k - s.y) - s.x);
    const c = (k - s.y)**2 - this.riderSpineLength**2 + s.x**2;
    const delta = b**2 - 4 * a * c;

    // FIXME: handle case when delta < 0
    let x = (-b - Math.sqrt(delta)) / (2 * a);
    let y = m * x + k;
    if (y < h.y) {
      x = (-b + Math.sqrt(delta)) / (2 * a);
      y = m * x + k;
    }

    return {
      x: x,
      y: y
    };
  }
  
  get spine(): Segment {
    return this._spine;
  }
  
  get arm(): Segment {
    return this._arm;
  }
}
