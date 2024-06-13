import * as d3 from "d3";

type Coordinates = {
  x: number,
  y: number
}

type Line = {
  top: Coordinates,
  bottom: Coordinates
}

const toRadians = (degrees: number) => degrees * Math.PI / 180;

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
  }

  private get headTubeTopCoordinates(): Coordinates {
    return {
      x: this.reachLength + this.bbCoordinates.x,
      y: this.stackLength + this.bbCoordinates.y
    };
  }

  private get headTubeBottomCoordinates(): Coordinates {
    return {
      x: Math.cos(this.headTubeAngle) * this.headTubeLength + this.headTubeTopCoordinates.x,
      y: -Math.sin(this.headTubeAngle) * this.headTubeLength + this.headTubeTopCoordinates.y
    };
  }

  private get headTube(): Line {
    return {
      top: this.headTubeTopCoordinates,
      bottom: this.headTubeBottomCoordinates
    };
  }

  drawHeadTube(): string {
    return d3.line()([
      [this.headTube.top.x, this.headTube.top.y],
      [this.headTube.bottom.x, this.headTube.bottom.y]
    ]) || "";
  }

  get downTube(): Line {
    return {
      top: this.headTubeBottomCoordinates,
      bottom: this.bbCoordinates
    };
  }

  drawDownTube(): string {
    return d3.line()([
      [this.downTube.top.x, this.downTube.top.y],
      [this.downTube.bottom.x, this.downTube.bottom.y]
    ]) || "";
  }

  get frontAxleCoordinates(): Coordinates {
    if (this.frontCenterLength !== 0) {
      return {
        x: Math.sqrt(this.frontCenterLength**2 - this.bbDropLength**2) + this.bbCoordinates.x,
        y: this.bbDropLength + this.bbCoordinates.y
      };
    }

    // const y = -Math.sqrt((this.crownToAxleLength**2 - (this.forkOffsetLength / Math.sin(this.headTubeAngle))**2) / (1 + (1 / Math.tan(this.headTubeAngle))**2)) + this.headTubeBottomCoordinate.y;
    // const x = (this.headTubeBottomCoordinate.y - y) / Math.tan(this.headTubeAngle) + this.forkOffsetLength / Math.sin(this.headTubeAngle) + this.headTubeBottomCoordinate.x;

    return {
      x: Math.sin(this.headTubeAngle) * this.forkOffsetLength  + Math.sqrt(this.crownToAxleLength**2 - this.forkOffsetLength**2) * Math.cos(this.headTubeAngle) + this.headTubeBottomCoordinates.x,
      y: Math.cos(this.headTubeAngle) * this.forkOffsetLength - Math.sqrt(this.crownToAxleLength**2 - this.forkOffsetLength**2) * Math.sin(this.headTubeAngle) + this.headTubeBottomCoordinates.y
    };
  }

  private get fork(): Line {
    return {
      top: this.headTubeBottomCoordinates,
      bottom: this.frontAxleCoordinates
    };
  }

  drawFork(): string {
    return d3.line()([
      [this.fork.top.x, this.fork.top.y],
      [this.fork.bottom.x, this.fork.bottom.y]
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
      top: this.rearAxleCoordinates,
      bottom: this.bbCoordinates
    };
  }

  drawChainStay(): string {
    return d3.line()([
      [this.chainStay.top.x, this.chainStay.top.y],
      [this.chainStay.bottom.x, this.chainStay.bottom.y]
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
      top: this.seatTubeTopCoordinates,
      bottom: this.bbCoordinates
    };
  }

  drawSeatTube(): string {
    return d3.line()([
      [this.seatTube.top.x, this.seatTube.top.y],
      [this.seatTube.bottom.x, this.seatTube.bottom.y]
    ]) || "";
  }

  drawTopTube(): string {
    return d3.line()([
      [this.headTubeTopCoordinates.x, this.headTubeTopCoordinates.y],
      [this.seatTubeTopCoordinates.x, this.seatTubeTopCoordinates.y]
    ]) || "";
  }

  private get seatStay(): Line {
    return {
      top: this.seatTubeTopCoordinates,
      bottom: this.rearAxleCoordinates
    };
  }

  drawSeatStay(): string {
    return d3.line()([
      [this.seatStay.top.x, this.seatStay.top.y],
      [this.seatStay.bottom.x, this.seatStay.bottom.y]
    ]) || "";
  }

  private get crank(): Line {
    return {
      top: this.bbCoordinates,
      bottom: {x: this.bbCoordinates.x + this.crankLength, y: this.bbCoordinates.y}
    };
  }

  drawCrank(): string {
    return d3.line()([
      [this.crank.top.x, this.crank.top.y],
      [this.crank.bottom.x, this.crank.bottom.y]
    ]) || "";
  }

}
