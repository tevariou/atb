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

export class BikeGeometry {
  bbCoordinates: Coordinates = {x: 0, y: 0};

  protected reachLength: number = 0;
  protected stackLength: number = 0;
  protected headTubeLength: number = 0;
  protected headTubeAngle: number = 0;
  protected chainStayLength: number = 0;
  protected seatTubeAngle: number = 0;
  protected seatTubeLength: number = 0;
  protected forkOffsetLength: number = 0;
  protected bbDropLength: number = 0;
  protected crownToAxleLength: number = 0;
  protected frontCenterLength: number = 0;
  protected crankLength: number = 0;
  protected spacersLength: number = 0;
  protected stemLength: number = 0;
  protected stemAngle: number = 0;
  protected riderInseamLength: number = 0;
  protected seatPostOffset: number = 0;
  protected riderUpperLegLength: number = 0;
  protected riderFootLength: number = 0;
  protected qFactor: number = 0;
  protected handlebarWidth: number = 0;
  protected riderArmLength: number = 0;
  protected riderSpineLength: number = 0;

  constructor(
    reachLength= 0,
    stackLength= 0,
    headTubeLength= 0,
    headTubeAngle= 0,
    chainStayLength= 0,
    seatTubeAngle= 0,
    seatTubeLength= 0,
    forkOffsetLength= 0,
    bbDropLength= 0,
    crownToAxleLength= 0,
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
    riderSpineLength = 0
  ){
    this.reachLength = reachLength;
    this.stackLength = stackLength;
    this.headTubeLength = headTubeLength;
    this.headTubeAngle = toRadians(headTubeAngle);
    this.chainStayLength = chainStayLength;
    this.seatTubeAngle = toRadians(seatTubeAngle);
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

    return {
      x: Math.sin(this.headTubeAngle) * this.forkOffsetLength  + Math.sqrt(this.crownToAxleLength**2 - this.forkOffsetLength**2) * Math.cos(this.headTubeAngle) + this.headTubeEndCoordinates.x,
      y: Math.cos(this.headTubeAngle) * this.forkOffsetLength - Math.sqrt(this.crownToAxleLength**2 - this.forkOffsetLength**2) * Math.sin(this.headTubeAngle) + this.headTubeEndCoordinates.y
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

  private get seatTubeTopCoordinates(): Coordinates {
    return {
      x: -Math.cos(this.seatTubeAngle) * this.seatTubeLength + this.bbCoordinates.x,
      y: Math.sin(this.seatTubeAngle) * this.seatTubeLength + this.bbCoordinates.y
    };
  }

  private get seatTube(): Line {
    return {
      start: this.seatTubeTopCoordinates,
      end: this.bbCoordinates
    };
  }

  drawSeatTube(): string {
    return d3.line()([
      [this.seatTube.start.x, this.seatTube.start.y],
      [this.seatTube.end.x, this.seatTube.end.y]
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
        x: this.crank.end.x * Math.cos(toRadians(-90)) - this.crank.end.y * Math.sin(toRadians(-90)),
        y: this.crank.end.x * Math.sin(toRadians(-90)) + this.crank.end.y * Math.cos(toRadians(-90))
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

  private get seatPost(): Line {
    let seatPostLength = Math.sqrt(this.riderInseamLength**2 - this.qFactor**2) - this.crankLength - this.seatTubeLength;
    seatPostLength = Number.isNaN(seatPostLength) || seatPostLength < 1 ? 0 : seatPostLength;

    const x = -Math.cos(this.seatTubeAngle) * seatPostLength + this.seatTube.start.x;
    const y = Math.sin(this.seatTubeAngle) * seatPostLength + this.seatTube.start.y;
    const d = distance(this.bbCoordinates, {x, y});

    const getXWithOffset = (seatPostLength: number) => -Math.cos(this.seatTubeAngle) * seatPostLength + this.seatTube.start.x - this.seatPostOffset;
    const getYWithOffset = (seatPostLength: number) => Math.sin(this.seatTubeAngle) * seatPostLength + this.seatTube.start.y;
    const getDWithOffset = (seatPostLength: number) => distance(this.bbCoordinates, {x: getXWithOffset(seatPostLength), y: getYWithOffset(seatPostLength)});
    const getSeatPostLength = (seatPostLength: number): number => {
      if (seatPostLength === 0 || d >= getDWithOffset(seatPostLength)) {
          return seatPostLength;
      }
      return getSeatPostLength(seatPostLength - 1);
    };
    const xWithOffset = getXWithOffset(getSeatPostLength(seatPostLength));
    const yWithOffset = getYWithOffset(getSeatPostLength(seatPostLength));

    return {
      start: {
        x: xWithOffset <= this.seatTube.start.x ? xWithOffset : this.seatTube.start.x,
        y: yWithOffset >= this.seatTube.start.y ? yWithOffset : this.seatTube.start.y
      },
      end: this.seatTube.start
    }
  }

  drawSeatPost(): string {
    return d3.line()([
      [this.seatPost.start.x, this.seatPost.start.y],
      [this.seatPost.end.x, this.seatPost.end.y]
    ]) || "";
  }

  private get fromSaddleToPedal(): number {
    return Math.sqrt((distance(this.seatPost.start, this.bbCoordinates) + this.crankLength)**2 + this.qFactor**2);
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
      x:  -lowerLeg * Math.cos(theta - gamma) + this.heel.x,
      y:  -lowerLeg * Math.sin(theta - gamma) + this.heel.y
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

  private get fromSadleToHandlebar(): number {
    return distance(this.seatPost.start, this.handlebar);
  }

  private get riderShoulder(): Coordinates {
    const projectedArmlength = Math.sqrt(this.riderArmLength**2 - (this.handlebarWidth / 2)**2);
    const d = (this.riderSpineLength**2 - projectedArmlength**2 + this.fromSadleToHandlebar**2) / (2 * this.fromSadleToHandlebar);
    const h = Math.sqrt(this.riderSpineLength**2 - d**2);
    const x = this.seatPost.start.x + ((this.handlebar.x - this.seatPost.start.x) * d / this.fromSadleToHandlebar + (this.handlebar.y - this.seatPost.start.y) * h / this.fromSadleToHandlebar);
    const y = this.seatPost.start.y - ((this.handlebar.y - this.seatPost.start.y) * d / this.fromSadleToHandlebar - (this.handlebar.x - this.seatPost.start.x) * h / this.fromSadleToHandlebar);
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
    console.log(this.riderShoulder, this.handlebar)
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
