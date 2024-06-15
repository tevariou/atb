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
  protected spacersLength: number = 0;
  protected stemLength: number = 0;
  protected stemAngle: number = 0;
  protected riderInseamLength: number = 0;
  protected seatPostOffset: number = 0;

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
    seatPostOffset = 0
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

  private get spacers(): Line {
    return {
      top: {
        x: -Math.cos(this.headTubeAngle) * this.spacersLength + this.headTube.top.x,
        y: Math.sin(this.headTubeAngle) * this.spacersLength + this.headTube.top.y
      },
      bottom: this.headTube.top,
    };
  }

  drawSpacers(): string {
    return d3.line()([
      [this.spacers.top.x, this.spacers.top.y],
      [this.spacers.bottom.x, this.spacers.bottom.y]
    ]) || "";
  }

  private get stem(): Line {
    const x = -Math.cos(this.headTubeAngle) * this.stemLength;
    const y = Math.sin(this.headTubeAngle) * this.stemLength;
    return {
      top: {
        x: Math.sin(this.stemAngle) * x + Math.cos(this.stemAngle) * y + this.spacers.top.x,
        y: -Math.cos(this.stemAngle) * x + Math.sin(this.stemAngle) * y + this.spacers.top.y
      },
      bottom: this.spacers.top,
    }
  }

  drawStem(): string {
    return d3.line()([
      [this.stem.top.x, this.stem.top.y],
      [this.stem.bottom.x, this.stem.bottom.y]
    ]) || "";
  }

  private get seatPost(): Line {
    const x = -Math.cos(this.seatTubeAngle) * (this.riderInseamLength - this.crankLength - this.seatTubeLength) + this.seatTube.top.x;
    const y = Math.sin(this.seatTubeAngle) * (this.riderInseamLength - this.crankLength - this.seatTubeLength) + this.seatTube.top.y;
    const d = Math.sqrt((x - this.bbCoordinates.x)**2 + (y - this.bbCoordinates.y)**2);
    const seatPostLength = this.riderInseamLength - this.crankLength - this.seatTubeLength;
    const xWithOffset = (seatPostLength: number) => -Math.cos(this.seatTubeAngle) * seatPostLength + this.seatTube.top.x - this.seatPostOffset;
    const yWithOffset = (seatPostLength: number) => Math.sin(this.seatTubeAngle) * seatPostLength + this.seatTube.top.y;
    const dWithOffset = (seatPostLength: number) => Math.sqrt((xWithOffset(seatPostLength) - this.bbCoordinates.x)**2 + (yWithOffset(seatPostLength) - this.bbCoordinates.y)**2);
    const getSeatPostLength = (seatPostLength: number): number => {
      if (seatPostLength <= 0 || d >= dWithOffset(seatPostLength)) {
          return seatPostLength;
      }
      return getSeatPostLength(seatPostLength - 1);
    };

    return {
      top: {
        x: xWithOffset(getSeatPostLength(seatPostLength)),
        y: yWithOffset(getSeatPostLength(seatPostLength))
      },
      bottom: this.seatTube.top
    }
  }

  drawSeatPost(): string {
    return d3.line()([
      [this.seatPost.top.x, this.seatPost.top.y],
      [this.seatPost.bottom.x, this.seatPost.bottom.y]
    ]) || "";
  }

}
