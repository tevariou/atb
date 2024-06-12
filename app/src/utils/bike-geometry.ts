type Coordinates = {
  x: number,
  y: number
}

const toRadians = (degrees: number) => degrees * Math.PI / 180;

export class BikeGeometry {
  bbCoordinates: Coordinates = {x: 0, y: 0};

  reachLength: number = 0;
  stackLength: number = 0;
  headTubeLength: number = 0;
  headTubeAngle: number = 0;
  chainStayLength: number = 0;
  seatTubeAngle: number = 0;
  seatTubeLength: number = 0;
  forkOffsetLength: number = 0;
  bbDropLength: number = 0;
  crownToAxleLength: number = 0;
  frontCenterLength: number = 0;

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
    frontCenterLength = 0
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
  }

  get headTubeTopCoordinate(): Coordinates {
    return {
      x: this.reachLength + this.bbCoordinates.x,
      y: this.stackLength + this.bbCoordinates.y
    };
  }

  get headTubeBottomCoordinate(): Coordinates {
    return {
      x: Math.cos(this.headTubeAngle) * this.headTubeLength + this.headTubeTopCoordinate.x,
      y: -Math.sin(this.headTubeAngle) * this.headTubeLength + this.headTubeTopCoordinate.y
    };
  }

  get frontAxleCoordinate(): Coordinates {
    if (this.frontCenterLength !== 0) {
      return {
        x: Math.sqrt(this.frontCenterLength**2 - this.bbDropLength**2) + this.bbCoordinates.x,
        y: this.bbDropLength + this.bbCoordinates.y
      };
    }

    // const y = -Math.sqrt((this.crownToAxleLength**2 - (this.forkOffsetLength / Math.sin(this.headTubeAngle))**2) / (1 + (1 / Math.tan(this.headTubeAngle))**2)) + this.headTubeBottomCoordinate.y;
    // const x = (this.headTubeBottomCoordinate.y - y) / Math.tan(this.headTubeAngle) + this.forkOffsetLength / Math.sin(this.headTubeAngle) + this.headTubeBottomCoordinate.x;

    return {
      x: Math.sin(this.headTubeAngle) * this.forkOffsetLength  + Math.sqrt(this.crownToAxleLength**2 - this.forkOffsetLength**2) * Math.cos(this.headTubeAngle) + this.headTubeBottomCoordinate.x,
      y: Math.cos(this.headTubeAngle) * this.forkOffsetLength - Math.sqrt(this.crownToAxleLength**2 - this.forkOffsetLength**2) * Math.sin(this.headTubeAngle) + this.headTubeBottomCoordinate.y
    };
  }

  get rearAxleCoordinate(): Coordinates {
    return {
      x: -Math.sqrt(this.chainStayLength**2 - this.bbDropLength**2) + this.bbCoordinates.x,
      y: this.bbDropLength + this.bbCoordinates.y
    };
  }

  get seatTubeTopCoordinate(): Coordinates {
    return {
      x: -Math.cos(this.seatTubeAngle) * this.seatTubeLength + this.bbCoordinates.x,
      y: Math.sin(this.seatTubeAngle) * this.seatTubeLength + this.bbCoordinates.y
    };
  }
}
