import * as d3 from "d3";

type Coordinates = {
  x: number,
  y: number
}

type Line = {
  start: Coordinates,
  end: Coordinates
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
  protected riderArmLength = 0;
  protected riderSpineLength = 0;

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
    this.riderArmLength = riderArmLength;
    this.riderSpineLength = riderSpineLength;
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

  private get headTube(): Line {
    return {
      start: this.headTubeStartCoordinates,
      end: this.headTubeEndCoordinates
    };
  }

  drawHeadTube(): string {
    return d3.line()([
      [this.headTube.start.x, this.headTube.start.y],
      [this.headTube.end.x, this.headTube.end.y]
    ]) || "";
  }

  get downTube(): Line {
    return {
      start: this.headTubeEndCoordinates,
      end: this.bbCoordinates
    };
  }

  drawDownTube(): string {
    return d3.line()([
      [this.downTube.start.x, this.downTube.start.y],
      [this.downTube.end.x, this.downTube.end.y]
    ]) || "";
  }

  get frontAxleCoordinates(): Coordinates {
    if (this.frontCenterLength !== 0) {
      return {
        x: Math.sqrt(this.frontCenterLength**2 - this.bbDropLength**2) + this.bbCoordinates.x,
        y: this.bbDropLength + this.bbCoordinates.y
      };
    }

    const unRotatedFrontAxleWithOffsetCoordinates = {
      x:this.headTubeEndCoordinates.x + this.forkOffsetLength,
      y: this.headTubeEndCoordinates.y - this.crownToAxleLength
    }

    const frontAxleWithOffsetCoordinates = rotate(unRotatedFrontAxleWithOffsetCoordinates, toRadians(90) - this.headTubeAngle, this.headTube.end)
    return {
      x: frontAxleWithOffsetCoordinates.x,
      y: frontAxleWithOffsetCoordinates.y
    };
  }

  private get fork(): Line {
    return {
      start: this.headTubeEndCoordinates,
      end: this.frontAxleCoordinates
    };
  }

  drawFork(): string {
    return d3.line()([
      [this.fork.start.x, this.fork.start.y],
      [this.fork.end.x, this.fork.end.y]
    ]) || "";
  }

  get rearAxleCoordinates(): Coordinates {
    return {
      x: -Math.sqrt(this.chainStayLength**2 - this.bbDropLength**2) + this.bbCoordinates.x,
      y: this.bbDropLength + this.bbCoordinates.y
    };
  }

  get chainStay(): Line {
    return {
      start: this.rearAxleCoordinates,
      end: this.bbCoordinates
    };
  }

  drawChainStay(): string {
    return d3.line()([
      [this.chainStay.start.x, this.chainStay.start.y],
      [this.chainStay.end.x, this.chainStay.end.y]
    ]) || "";
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
    // const x = (this.topTubeHorizontal.start.y - Math.tan(this.actualSeatTubeAngle) * this.topTubeHorizontal.start.y / Math.tan(this.effectiveSeatTubeAngle) - y) / Math.tan(this.actualSeatTubeAngle) + this.bbCoordinates.x;
    const x = (y - this.seatTubeTopCoordinates.y + this.seatTubeTopCoordinates.x * m) / m;
    return {
      x: x,
      y: y
    };
  }

  drawSeatTube(): string {
    return d3.line()([
      [this.seatTubeTopCoordinates.x, this.seatTubeTopCoordinates.y],
      [this.seatTubeFlexPointCoordinates.x, this.seatTubeFlexPointCoordinates.y],
      [this.bbCoordinates.x, this.bbCoordinates.y]
    ]) || "";
  }

  drawTopTube(): string {
    return d3.line()([
      [this.headTubeStartCoordinates.x, this.headTubeStartCoordinates.y],
      [this.seatTubeTopCoordinates.x, this.seatTubeTopCoordinates.y]
    ]) || "";
  }

  private get seatStay(): Line {
    return {
      start: this.seatTubeTopCoordinates,
      end: this.rearAxleCoordinates
    };
  }

  drawSeatStay(): string {
    return d3.line()([
      [this.seatStay.start.x, this.seatStay.start.y],
      [this.seatStay.end.x, this.seatStay.end.y]
    ]) || "";
  }

  private get crank(): Line {
    return {
      start: this.bbCoordinates,
      end: {x: this.bbCoordinates.x + this.crankLength, y: this.bbCoordinates.y}
    };
  }

  drawCrank(): string {
    return d3.line()([
      [this.crank.start.x, this.crank.start.y],
      [this.crank.end.x, this.crank.end.y]
    ]) || "";
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

  private get spacers(): Line {
    return {
      start: {
        x: -Math.cos(this.headTubeAngle) * this.spacersLength + this.headTube.start.x,
        y: Math.sin(this.headTubeAngle) * this.spacersLength + this.headTube.start.y
      },
      end: this.headTube.start,
    };
  }

  drawSpacers(): string {
    return d3.line()([
      [this.spacers.start.x, this.spacers.start.y],
      [this.spacers.end.x, this.spacers.end.y]
    ]) || "";
  }

  private get stem(): Line {
    const x = -Math.cos(this.headTubeAngle) * this.stemLength;
    const y = Math.sin(this.headTubeAngle) * this.stemLength;
    return {
      start: {
        x: Math.sin(this.stemAngle) * x + Math.cos(this.stemAngle) * y + this.spacers.start.x,
        y: -Math.cos(this.stemAngle) * x + Math.sin(this.stemAngle) * y + this.spacers.start.y
      },
      end: this.spacers.start,
    }
  }

  drawStem(): string {
    return d3.line()([
      [this.stem.start.x, this.stem.start.y],
      [this.stem.end.x, this.stem.end.y]
    ]) || "";
  }

  private get fromSaddleToPedal(): number {
    return Math.sqrt((distance(this.seatPost.start, this.bbCoordinates) + this.crankLength)**2 + (this.qFactor / 2)**2);
  }

  private get seatPost(): Line {
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
      start: {
        x: xWithOffset,
        y: yWithOffset
      },
      end: this.seatTubeTopCoordinates
    }
  }

  drawSeatPost(): string {
    return d3.line()([
      [this.seatPost.start.x, this.seatPost.start.y],
      [this.seatPost.end.x, this.seatPost.end.y]
    ]) || "";
  }

  private get heel(): Coordinates {
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

  private get riderKnee(): Coordinates {
    if (this.fromSaddleToPedal > this.riderInseamLength) {
      return {
        x: this.seatPost.start.x,
        y: this.seatPost.start.y - this.riderUpperLegLength
      }
    }

    const lowerLeg = this.riderInseamLength - this.riderUpperLegLength;
    const theta = Math.atan((this.seatPost.start.y - this.heel.y) / (this.seatPost.start.x - this.heel.x));
    const d = Math.sqrt(distance(this.heel, this.seatPost.start)**2 + (this.qFactor / 2)**2);
    const gamma = Math.acos((d**2 + lowerLeg**2 - this.riderUpperLegLength**2) / (2 * d * lowerLeg));

    return {
      x:  Math.abs(-lowerLeg * Math.cos(theta - gamma)) + this.heel.x,
      y:  Math.abs(-lowerLeg * Math.sin(theta - gamma)) + this.heel.y
    };
  }

  private get riderFeet(): Line {
    return {
      start: this.heel,
      end: {
        x: this.heel.x + this.riderFootLength,
        y: this.heel.y
      }
    };
  }

  drawRiderFeet(): string {
    return d3.line()([
      [this.riderFeet.start.x, this.riderFeet.start.y],
      [this.riderFeet.end.x, this.riderFeet.end.y]
    ]) || "";
  }

  private get riderUpperLeg(): Line {
    return {
      start: this.seatPost.start,
      end: this.riderKnee
    };
  }

  drawRiderUpperLeg(): string {
    return d3.line()([
      [this.riderUpperLeg.start.x, this.riderUpperLeg.start.y],
      [this.riderUpperLeg.end.x, this.riderUpperLeg.end.y]
    ]) || "";
  }

  private get riderLowerLeg(): Line {
    return {
      start: this.riderKnee,
      end: this.heel
    };
  }

  drawRiderLowerLeg(): string {
    return d3.line()([
      [this.riderLowerLeg.start.x, this.riderLowerLeg.start.y],
      [this.riderLowerLeg.end.x, this.riderLowerLeg.end.y]
    ]) || "";
  }

  private get handlebar(): Coordinates {
    return this.stem.start;
  }

  private get riderShoulder(): Coordinates {
    const h = this.handlebar;
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

  private get riderSpine(): Line {
    return {
      start: this.seatPost.start,
      end: this.riderShoulder
    };
  }

  drawRiderSpine(): string {
    return d3.line()([
      [this.riderSpine.start.x, this.riderSpine.start.y],
      [this.riderSpine.end.x, this.riderSpine.end.y]
    ]) || "";
  }

  private get riderArm(): Line {
    return {
      start: this.riderShoulder,
      end: this.handlebar
    };
  }

  drawRiderArm(): string {
    return d3.line()([
      [this.riderArm.start.x, this.riderArm.start.y],
      [this.riderArm.end.x, this.riderArm.end.y]
    ]) || "";
  }

}
