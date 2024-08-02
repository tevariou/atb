import * as d3 from "d3";

interface Coordinates {
  x: number;
  y: number;
}

class Segment {
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

class HeadTube extends Segment {
  private readonly __brand = "HeadTube";
  angle: number;

  constructor({
    bottomBracket,
    headTubeLength,
    headTubeAngle,
    reachLength,
    stackLength,
  }: {
    bottomBracket: BottomBracket;
    headTubeLength: number;
    headTubeAngle: number;
    reachLength: number;
    stackLength: number;
  }) {
    const start = {
      x: reachLength + bottomBracket.coordinates.x,
      y: stackLength + bottomBracket.coordinates.y,
    };
    const end = {
      x: Math.cos(headTubeAngle) * headTubeLength + start.x,
      y: -Math.sin(headTubeAngle) * headTubeLength + start.y,
    };

    super({ start, end });
    this.angle = headTubeAngle;
  }
}

class ChainStay extends Segment {
  private readonly __brand = "ChainStay";
  bbDropLength: number;

  constructor({
    bottomBracket,
    bbDropLength,
    chainStayLength,
  }: {
    bottomBracket: BottomBracket;
    bbDropLength: number;
    chainStayLength: number;
  }) {
    const start = {
      x:
        -Math.sqrt(chainStayLength ** 2 - bbDropLength ** 2) +
        bottomBracket.coordinates.x,
      y: bbDropLength + bottomBracket.coordinates.y,
    };
    const end = bottomBracket.coordinates;

    super({ start, end });
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
  }: {
    bottomBracket: BottomBracket;
    crankLength: number;
    qFactor: number;
    spinAngle: number;
  }) {
    const start = bottomBracket.coordinates;
    const end = rotate(
      {
        x: crankLength + bottomBracket.coordinates.x,
        y: bottomBracket.coordinates.y,
      },
      toRadians(-spinAngle),
      bottomBracket.coordinates
    );
    super({ start, end });
    this.length = crankLength;
    this.qFactor = qFactor;
  }
}

class TopTubeHorizontal extends Segment {
  private readonly __brand = "TopTubeHorizontal";

  constructor({
    bottomBracket,
    headTube,
    effectiveSeatTubeAngle,
  }: {
    bottomBracket: BottomBracket;
    headTube: HeadTube;
    effectiveSeatTubeAngle: number;
  }) {
    const start = {
      x:
        (headTube.start.y - bottomBracket.coordinates.y) /
          Math.tan(-effectiveSeatTubeAngle) +
        bottomBracket.coordinates.x,
      y: headTube.start.y,
    };
    const end = headTube.start;

    super({ start, end });
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
    actualSeatTubeAngle,
  }: {
    bottomBracket: BottomBracket;
    topTubeHorizontal: TopTubeHorizontal;
    seatTubeLength: number;
    actualSeatTubeAngle: number;
  }) {
    const alpha = -actualSeatTubeAngle;
    const h = topTubeHorizontal.start;
    const k = h.y - Math.tan(alpha) * h.x;
    const a = 1 + Math.tan(alpha) ** 2;
    const b =
      2 *
      ((k - bottomBracket.coordinates.y) * Math.tan(alpha) -
        bottomBracket.coordinates.x);
    const c =
      (k - bottomBracket.coordinates.y) ** 2 -
      seatTubeLength ** 2 +
      bottomBracket.coordinates.x ** 2;

    let x = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
    let y = Math.tan(alpha) * x + h.y - Math.tan(alpha) * h.x;

    const start = {
      x: x,
      y: y,
    };
    const end = bottomBracket.coordinates;

    super({ start, end });

    y = bottomBracket.coordinates.y + seatTubeLength / 2;
    const m =
      (topTubeHorizontal.start.y - start.y) /
      (topTubeHorizontal.start.x - start.x);
    x = (y - start.y + start.x * m) / m;

    this.breakPoint = {
      x: x,
      y: y,
    };

    this.actualAngle = actualSeatTubeAngle;
  }

  draw(): string {
    return (
      d3.line()([
        [this.start.x, this.start.y],
        [this.breakPoint.x, this.breakPoint.y],
        [this.end.x, this.end.y],
      ]) ?? ""
    );
  }
}

class Spacers extends Segment {
  private readonly __brand = "Spacers";

  constructor({
    headTube,
    spacersLength,
  }: {
    headTube: HeadTube;
    spacersLength: number;
  }) {
    const start = {
      x: -Math.cos(headTube.angle) * spacersLength + headTube.start.x,
      y: Math.sin(headTube.angle) * spacersLength + headTube.start.y,
    };
    const end = headTube.start;

    super({ start, end });
  }
}

class SeatPost extends Segment {
  private readonly __brand = "SeatPost";

  constructor({
    bottomBracket,
    seatTube,
    crank,
    seatPostOffset,
    riderInseamLength,
  }: {
    bottomBracket: BottomBracket;
    seatTube: SeatTube;
    crank: Crank;
    riderInseamLength: number;
    seatPostOffset: number;
  }) {
    const getXWithOffset = (seatPostLength: number) =>
      -Math.cos(seatTube.actualAngle) * seatPostLength +
      seatTube.start.x -
      seatPostOffset;
    const getYWithOffset = (seatPostLength: number) =>
      Math.sin(seatTube.actualAngle) * seatPostLength + seatTube.start.y;
    const getDWithOffset = (seatPostLength: number) =>
      Math.sqrt(
        (distance(
          {
            x: getXWithOffset(seatPostLength),
            y: getYWithOffset(seatPostLength),
          },
          bottomBracket.coordinates
        ) +
          crank.length) **
          2 +
          (crank.qFactor / 2) ** 2
      );
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
      y: yWithOffset,
    };
    const end = seatTube.start;

    super({ start, end });
  }
}

class Stem extends Segment {
  private readonly __brand = "Stem";

  constructor({
    spacers,
    headTube,
    stemLength,
    stemAngle,
  }: {
    spacers: Spacers;
    headTube: HeadTube;
    stemLength: number;
    stemAngle: number;
  }) {
    const x = -Math.cos(headTube.angle) * stemLength;
    const y = Math.sin(headTube.angle) * stemLength;
    const start = {
      x: Math.sin(stemAngle) * x + Math.cos(stemAngle) * y + spacers.start.x,
      y: -Math.cos(stemAngle) * x + Math.sin(stemAngle) * y + spacers.start.y,
    };

    const end = spacers.start;

    super({ start, end });
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
    wheelBase,
  }: {
    bottomBracket: BottomBracket;
    headTube: HeadTube;
    chainStay: ChainStay;
    forkOffsetLength: number;
    crownToAxleLength: number;
    frontCenterLength: number;
    wheelBase: number;
  }) {
    let end: Coordinates;

    if (frontCenterLength !== 0) {
      end = {
        x:
          Math.sqrt(frontCenterLength ** 2 - chainStay.bbDropLength ** 2) +
          bottomBracket.coordinates.x,
        y: chainStay.bbDropLength + bottomBracket.coordinates.y,
      };
    } else if (wheelBase !== 0) {
      end = {
        x: chainStay.start.x + wheelBase,
        y: chainStay.start.y,
      };
    } else {
      const unRotatedFrontAxleWithOffsetCoordinates = {
        x: headTube.end.x + forkOffsetLength,
        y: headTube.end.y - crownToAxleLength,
      };

      const frontAxleWithOffsetCoordinates = rotate(
        unRotatedFrontAxleWithOffsetCoordinates,
        toRadians(90) - headTube.angle,
        headTube.end
      );

      end = {
        x: frontAxleWithOffsetCoordinates.x,
        y: frontAxleWithOffsetCoordinates.y,
      };
    }

    const start = headTube.end;

    super({ start, end });
  }
}

class LowerBody extends Segment {
  private readonly __brand = "LowerBody";
  private readonly knee: Coordinates;
  private readonly heel: Coordinates;

  constructor({
    bottomBracket,
    seatPost,
    crank,
    riderInseamLength,
    riderUpperLegLength,
    riderFootLength,
  }: {
    bottomBracket: BottomBracket;
    seatPost: SeatPost;
    crank: Crank;
    riderInseamLength: number;
    riderUpperLegLength: number;
    riderFootLength: number;
  }) {
    const fromSaddleToPedal = Math.sqrt(
      (distance(seatPost.start, bottomBracket.coordinates) + crank.length) **
        2 +
        (crank.qFactor / 2) ** 2
    );

    let heel: Coordinates;

    if (fromSaddleToPedal > riderInseamLength) {
      heel = {
        x: seatPost.start.x,
        y: seatPost.start.y - riderInseamLength,
      };
    }

    heel = {
      x: crank.end.x - (riderFootLength * 2) / 3,
      y: crank.end.y,
    };

    let knee: Coordinates;

    if (fromSaddleToPedal > riderInseamLength) {
      knee = {
        x: seatPost.start.x,
        y: seatPost.start.y - riderUpperLegLength,
      };
    } else {
      const lowerLeg = riderInseamLength - riderUpperLegLength;
      const theta = Math.atan(
        (seatPost.start.y - heel.y) / (seatPost.start.x - heel.x)
      );
      const d = Math.sqrt(
        distance(heel, seatPost.start) ** 2 + (crank.qFactor / 2) ** 2
      );
      const gamma = Math.acos(
        (d ** 2 + lowerLeg ** 2 - riderUpperLegLength ** 2) / (2 * d * lowerLeg)
      );

      knee = {
        x: Math.abs(-lowerLeg * Math.cos(theta - gamma)) + heel.x,
        y: Math.abs(-lowerLeg * Math.sin(theta - gamma)) + heel.y,
      };
    }

    const end = {
      x: heel.x + riderFootLength,
      y: heel.y,
    };
    super({ start: seatPost.start, end });
    this.knee = knee;
    this.heel = heel;
  }

  draw(): string {
    return (
      d3.line()([
        [this.start.x, this.start.y],
        [this.knee.x, this.knee.y],
        [this.heel.x, this.heel.y],
        [this.end.x, this.end.y],
      ]) ?? ""
    );
  }
}

class UpperBody extends Segment {
  private readonly __brand = "UpperBody";
  private readonly shoulder: Coordinates;

  constructor({
    seatPost,
    handleBar,
    riderArmLength,
    riderSpineLength,
  }: {
    seatPost: SeatPost;
    handleBar: HandleBar;
    riderArmLength: number;
    riderSpineLength: number;
  }) {
    const h = handleBar.coordinates;
    const s = seatPost.start;
    const projectedArmLength = Math.sqrt(
      riderArmLength ** 2 - (handleBar.width / 2) ** 2
    );

    const m = -(h.x - s.x) / (h.y - s.y);
    const k =
      -(
        s.x ** 2 +
        s.y ** 2 -
        h.x ** 2 -
        h.y ** 2 -
        riderSpineLength ** 2 +
        projectedArmLength ** 2
      ) /
      (2 * (h.y - s.y));
    const a = 1 + m ** 2;
    const b = 2 * (m * (k - s.y) - s.x);
    const c = (k - s.y) ** 2 - riderSpineLength ** 2 + s.x ** 2;
    const delta = b ** 2 - 4 * a * c;

    // FIXME: handle case when delta < 0
    let x = (-b - Math.sqrt(delta)) / (2 * a);
    let y = m * x + k;
    if (y < h.y) {
      x = (-b + Math.sqrt(delta)) / (2 * a);
      y = m * x + k;
    }

    super({ start: seatPost.start, end: handleBar.coordinates });

    this.shoulder = {
      x: x,
      y: y,
    };
  }

  draw(): string {
    return (
      d3.line()([
        [this.start.x, this.start.y],
        [this.shoulder.x, this.shoulder.y],
        [this.end.x, this.end.y],
      ]) ?? ""
    );
  }
}

class Point {
  coordinates: Coordinates = {
    x: 0,
    y: 0,
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
    handleBarWidth,
  }: {
    stem: Stem;
    handleBarReach: number;
    handleBarHeight: number;
    handleBarWidth: number;
  }) {
    const coordinates = {
      x: stem.start.x + handleBarReach,
      y: stem.start.y + handleBarHeight,
    };
    super(coordinates);
    this.width = handleBarWidth;
  }
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const distance = (start: Coordinates, end: Coordinates) =>
  Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);

const rotate = (
  coordinates: Coordinates,
  angle: number,
  origin: Coordinates = { x: 0, y: 0 }
): Coordinates => {
  return {
    x:
      (coordinates.x - origin.x) * Math.cos(angle) -
      (coordinates.y - origin.y) * Math.sin(angle) +
      origin.x,
    y:
      (coordinates.x - origin.x) * Math.sin(angle) +
      (coordinates.y - origin.y) * Math.cos(angle) +
      origin.y,
  };
};

export class BikeGeometry {
  private readonly _headTube: HeadTube;
  private readonly _downTube: Segment;
  private readonly _topTubeHorizontal: TopTubeHorizontal;
  private readonly _seatTube: SeatTube;
  private readonly _seatStay: Segment;
  private readonly _crank: Crank;
  private readonly _spacers: Spacers;
  private readonly _stem: Stem;
  private readonly _seatPost: SeatPost;
  private readonly _chainStay: ChainStay;
  private readonly _fork: Fork;
  private readonly _topTube: Segment;

  private readonly _lowerBody: LowerBody;
  private readonly _upperBody: UpperBody;

  constructor({
    bottomBracketCoordinates = { x: 0, y: 0 } as Coordinates,
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
    spinAngle = 0,
  }) {
    const bottomBracket = new BottomBracket(bottomBracketCoordinates);

    const headTube = new HeadTube({
      bottomBracket,
      headTubeLength,
      headTubeAngle: toRadians(headTubeAngle),
      reachLength,
      stackLength,
    });
    const chainStay = new ChainStay({
      bottomBracket,
      bbDropLength,
      chainStayLength,
    });

    const topTubeHorizontal = new TopTubeHorizontal({
      headTube,
      bottomBracket,
      effectiveSeatTubeAngle: toRadians(effectiveSeatTubeAngle),
    });

    const seatTube = new SeatTube({
      bottomBracket,
      topTubeHorizontal,
      seatTubeLength,
      actualSeatTubeAngle: toRadians(actualSeatTubeAngle),
    });

    const fork = new Fork({
      bottomBracket,
      headTube,
      chainStay,
      forkOffsetLength,
      crownToAxleLength,
      frontCenterLength,
      wheelBase,
    });

    this._downTube = new Segment({
      start: headTube.end,
      end: bottomBracket.coordinates,
    });
    this._topTube = new Segment({ start: headTube.start, end: seatTube.start });
    this._seatStay = new Segment({
      start: seatTube.start,
      end: chainStay.start,
    });

    const crank = new Crank({ bottomBracket, crankLength, qFactor, spinAngle });
    const spacers = new Spacers({ headTube, spacersLength });
    const stem = new Stem({
      spacers,
      headTube,
      stemLength,
      stemAngle: toRadians(stemAngle),
    });
    const handleBar = new HandleBar({
      stem,
      handleBarReach,
      handleBarHeight,
      handleBarWidth,
    });

    const seatPost = new SeatPost({
      bottomBracket,
      seatTube,
      crank,
      riderInseamLength,
      seatPostOffset,
    });
    const lowerBody = new LowerBody({
      bottomBracket,
      seatPost,
      crank,
      riderInseamLength,
      riderUpperLegLength,
      riderFootLength,
    });
    const upperBody = new UpperBody({
      seatPost,
      handleBar,
      riderArmLength,
      riderSpineLength,
    });

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

  get seatTube(): SeatTube {
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
