import * as d3 from "d3";

type Coordinates = {
  x: number,
  y: number
}

type Line = {
  start: Coordinates,
  end: Coordinates
}

class Segment {
  private _start: Coordinates;
  private _end: Coordinates;

  constructor(
    start: Coordinates, 
    end: Coordinates
  ){
    this._start = start;
    this._end = end;
  }

  draw(): string {
    return d3.line()([
      [this.start.x, this.start.y],
      [this.end.x, this.end.y]
    ]) || "";
  }
  
  get start(): Coordinates{
    return this._start;
  }

  get end(): Coordinates{
    return this._end;
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
  protected headTubeLength = 0;
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

  private _headTube: Segment;
  private _downTube: Segment;
  private _upperSeatTube: Segment;
  private _lowerSeatTube: Segment;
  private _seatStay: Segment;
  private _crank: Segment;
  private _spacers: Segment;
  private _stem: Segment;
  private _seatPost: Segment; 
  private _chainStay: Segment;
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
    this.headTubeLength = headTubeLength;
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

    this._headTube = new Segment(this.headTubeStartCoordinates, this.headTubeEndCoordinates);
    this._downTube = new Segment(this.headTubeEndCoordinates, this.bbCoordinates);
    this._fork = new Segment(this.headTubeEndCoordinates, this.frontAxleCoordinates);
    this._chainStay = new Segment(this.rearAxleCoordinates, this.bbCoordinates);
    this._upperSeatTube = new Segment(this.seatTubeTopCoordinates, this.seatTubeFlexPointCoordinates);
    this._lowerSeatTube = new Segment(this.seatTubeFlexPointCoordinates, this.bbCoordinates);
    this._topTube = new Segment(this.headTubeStartCoordinates, this.seatTubeTopCoordinates);
    this._seatStay = new Segment(this.seatTubeTopCoordinates, this.rearAxleCoordinates);
    this._crank = new Segment(this.bbCoordinates, this.crankEndCoordinates);
    this._spacers = new Segment(this.spacersStartCoordinates ,this.headTubeStartCoordinates);
    this._stem = new Segment(this.stemStartCoordinates, this.spacersStartCoordinates);
    this._seatPost =  new Segment(this.seatPostStartCoordinates, this.seatTubeTopCoordinates);
    this._feet = new Segment(this.heelCoordinates, this.feetEndCoordinates);
    this._upperLeg = new Segment(this.seatPostStartCoordinates, this.riderKneeCoordinates);
    this._lowerLeg = new Segment(this.riderKneeCoordinates, this.heelCoordinates);
    this._spine = new Segment(this.seatPostStartCoordinates, this.riderShoulderCoordinates);
    this._arm = new Segment(this.riderShoulderCoordinates, this.handlebarCoordinates);
  }

  private get headTubeStartCoordinates(): Coordinates {
    return {
      x: this.reachLength + this.bbCoordinates.x,
      y: this.stackLength + this.bbCoordinates.y
    };
  }

  private get headTubeEndCoordinates(): Coordinates {
    return {
      x: Math.cos(this.headTubeAngle) * this.headTubeLength + this.headTubeStartCoordinates.x,
      y: -Math.sin(this.headTubeAngle) * this.headTubeLength + this.headTubeStartCoordinates.y
    };
  }

  get headTube(): Segment {
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
        x: this.rearAxleCoordinates.x + this.wheelBase,
        y: this.rearAxleCoordinates.y
      };
    }

    const unRotatedFrontAxleWithOffsetCoordinates = {
      x: this.headTubeEndCoordinates.x + this.forkOffsetLength,
      y: this.headTubeEndCoordinates.y - this.crownToAxleLength
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

  get rearAxleCoordinates(): Coordinates {
    return {
      x: -Math.sqrt(this.chainStayLength**2 - this.bbDropLength**2) + this.bbCoordinates.x,
      y: this.bbDropLength + this.bbCoordinates.y
    };
  }

  get chainStay(): Segment {
    return this._chainStay;
  }

  private get topTubeHorizontal(): Line {
    const epsilon = -this.effectiveSeatTubeAngle;

    return {
      start: {
        x: (this.headTube.start.y - this.bbCoordinates.y) / Math.tan(epsilon) + this.bbCoordinates.x,
        y: this.headTube.start.y
      },
      end: this.headTube.start
    }
  }

  private get seatTubeTopCoordinates(): Coordinates {
    const alpha = -this.actualSeatTubeAngle;
    const h = {
      x: this.topTubeHorizontal.start.x,
      y: this.topTubeHorizontal.start.y
    }
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
    const y = this.bbCoordinates.y + this.seatTubeLength / 2;
    const m = (this.topTubeHorizontal.start.y - this.seatTubeTopCoordinates.y) / (this.topTubeHorizontal.start.x - this.seatTubeTopCoordinates.x);
    const x = (y - this.seatTubeTopCoordinates.y + this.seatTubeTopCoordinates.x * m) / m;
    return {
      x: x,
      y: y
    };
  }

  get seatStay(): Segment {
    return this._seatStay;
  }

  private get crankEndCoordinates(): Coordinates {
    return {
      x: this.bbCoordinates.x + this.crankLength, 
      y: this.bbCoordinates.y
    }
  }

  get crank(): Segment {
    return this._crank;
  }

  private get crankDown(): Line {
    return {
      start: this.bbCoordinates,
      end: {
        x: (this.crank.end.x - this.bbCoordinates.x) * Math.cos(toRadians(-90)) - (this.crank.end.y - this.bbCoordinates.y) * Math.sin(toRadians(-90)) + this.bbCoordinates.x,
        y: (this.crank.end.x - this.bbCoordinates.x) * Math.sin(toRadians(-90)) + (this.crank.end.y - this.bbCoordinates.y) * Math.cos(toRadians(-90)) + this.bbCoordinates.y
      }
    };
  }

  drawCrankDown(): string {
    return d3.line()([
      [this.crankDown.start.x, this.crankDown.start.y],
      [this.crankDown.end.x, this.crankDown.end.y]
    ]) || "";
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
    const getXWithOffset = (seatPostLength: number) => -Math.cos(this.actualSeatTubeAngle) * seatPostLength + this.seatTubeTopCoordinates.x - this.seatPostOffset;
    const getYWithOffset = (seatPostLength: number) => Math.sin(this.actualSeatTubeAngle) * seatPostLength + this.seatTubeTopCoordinates.y;
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
    const theta = Math.atan((this.seatPost.start.y - this.heelCoordinates.y) / (this.seatPost.start.x - this.heelCoordinates.x));
    const d = Math.sqrt(distance(this.heelCoordinates, this.seatPost.start)**2 + (this.qFactor / 2)**2);
    const gamma = Math.acos((d**2 + lowerLeg**2 - this.riderUpperLegLength**2) / (2 * d * lowerLeg));

    return {
      x:  Math.abs(-lowerLeg * Math.cos(theta - gamma)) + this.heelCoordinates.x,
      y:  Math.abs(-lowerLeg * Math.sin(theta - gamma)) + this.heelCoordinates.y
    };
  }

  private get feetEndCoordinates(): Coordinates {
    return {
      x: this.heelCoordinates.x + this.riderFootLength,
      y: this.heelCoordinates.y
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
