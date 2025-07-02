import Segment from "./Segment";
import HeadTube from "./HeadTube";
import Coordinates from "./Coordinates";
import ChainStay from "./ChainStay";
import TopTubeHorizontal from "./TopTubeHorizontal";
import SeatTube from "./SeatTube";
import Fork from "./Fork";
import Crank from "./Crank";
import Spacers from "./Spacers";
import Stem from "./Stem";
import SeatPost from "./SeatPost";
import LowerBody from "./LowerBody";
import UpperBody from "./UpperBody";
import HandleBar from "./HandleBar";
import BottomBracket from "./BottomBracket";
import { distance, toDegrees, toRadians } from "./helpers";
import Wheel from "./Wheel";

export type BikeGeometryParams = {
  bottomBracketCoordinates?: Coordinates;
  reachLength?: number;
  stackLength?: number;
  headTubeLength?: number;
  headTubeAngle?: number;
  chainStayLength?: number;
  actualSeatTubeAngle?: number;
  seatTubeLength?: number;
  forkOffsetLength?: number;
  bbDropLength?: number;
  crownToAxleLength?: number;
  frontCenterLength?: number;
  wheelBase?: number;
  crankLength?: number;
  spacersLength?: number;
  stemLength?: number;
  stemAngle?: number;
  riderInseamLength?: number;
  seatPostOffset?: number;
  riderUpperLegLength?: number;
  riderFootLength?: number;
  qFactor?: number;
  handleBarWidth?: number;
  handleBarReach?: number;
  handleBarHeight?: number;
  riderArmLength?: number;
  riderSpineLength?: number;
  effectiveSeatTubeAngle?: number;
  frontWheelDiameter?: number;
  rearWheelDiameter?: number;
  frontTireWidth?: number;
  rearTireWidth?: number;
  spinAngle?: number;
  forkTravel?: number;
  forkSag?: number;
};

export default class BikeGeometry {
  private readonly _bottomBracket: BottomBracket;
  private readonly _headTube: HeadTube;
  private readonly _downTube: Segment;
  private readonly _topTubeHorizontal: TopTubeHorizontal;
  private readonly _seatTube: SeatTube;
  private readonly _seatStay: Segment;
  private readonly _crank: Crank;
  private readonly _spacers: Spacers;
  private readonly _stem: Stem;
  private readonly _seatPost: SeatPost | undefined;
  private readonly _chainStay: ChainStay;
  private readonly _fork: Fork;
  private readonly _topTube: Segment;

  private readonly _lowerBody: LowerBody | undefined;
  private readonly _upperBody: UpperBody | undefined;

  private readonly _frontWheel: Wheel;
  private readonly _rearWheel: Wheel;

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
    frontWheelDiameter = 0,
    rearWheelDiameter = 0,
    frontTireWidth = 0,
    rearTireWidth = 0,
    spinAngle = 0,
    forkTravel = 0,
    forkSag = 0,
  }: BikeGeometryParams) {
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
      forkTravel,
      forkSag,
    });

    const frontWheel = new Wheel(frontWheelDiameter, frontTireWidth);
    const rearWheel = new Wheel(rearWheelDiameter, rearTireWidth);
    const groundRearWheelCoordinates = {
      x: chainStay.start.x,
      y: chainStay.start.y - rearWheel.radiusWithTire,
    };
    const groundFrontWheelCoordinates = {
      x: fork.end.x,
      y: fork.end.y - frontWheel.radiusWithTire,
    };
    const wheelBaseLength = distance(
      groundRearWheelCoordinates,
      groundFrontWheelCoordinates
    );

    const tiltAngle =
      wheelBaseLength !== 0
        ? Math.asin(
            (groundRearWheelCoordinates.y - groundFrontWheelCoordinates.y) /
              wheelBaseLength
          )
        : 0;

    if (tiltAngle !== 0) {
      // Rotate all bike components by the tilt angle around the bottom bracket
      chainStay.tilt(tiltAngle, bottomBracket.coordinates);
      headTube.tilt(tiltAngle, bottomBracket.coordinates);
      topTubeHorizontal.tilt(tiltAngle, bottomBracket.coordinates);
      seatTube.tilt(tiltAngle, bottomBracket.coordinates);
      fork.tilt(tiltAngle, bottomBracket.coordinates);
    }

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

    try {
      const seatPost = new SeatPost({
        bottomBracket,
        seatTube,
        crank,
        riderInseamLength,
        seatPostOffset,
      });

      this._seatPost = seatPost;

      try {
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

        this._lowerBody = lowerBody;
        this._upperBody = upperBody;
      } catch {}
    } catch {}

    this._frontWheel = frontWheel;
    this._rearWheel = rearWheel;

    this._bottomBracket = bottomBracket;
    this._headTube = headTube;
    this._chainStay = chainStay;
    this._crank = crank;
    this._topTubeHorizontal = topTubeHorizontal;
    this._seatTube = seatTube;
    this._spacers = spacers;
    this._stem = stem;
    this._fork = fork;
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

  get seatPost(): SeatPost | undefined {
    return this._seatPost;
  }

  get lowerBody(): LowerBody | undefined {
    return this._lowerBody;
  }

  get upperBody(): UpperBody | undefined {
    return this._upperBody;
  }

  get frontWheel(): Wheel {
    return this._frontWheel;
  }

  get rearWheel(): Wheel {
    return this._rearWheel;
  }

  get spineAngle(): number {
    if (!this.upperBody || !this.seatPost) {
      return 0;
    }

    return toDegrees(
      Math.asin(
        (this.upperBody.shoulder.y - this.seatPost.start.y) /
          this.upperBody.spineLength
      )
    );
  }

  get standoverHeight(): number {
    const _standoverHeight =
      (this.headTube.start.y - this.seatTube.start.y) / 2 +
      this.seatTube.start.y -
      this.chainStay.start.y +
      this.rearWheel.radiusWithTire;
    return _standoverHeight > 0 ? _standoverHeight : 0;
  }

  get groundPedalClearance(): number {
    const groundPedalClearance =
      this.rearWheel.radiusWithTire -
      (this.crank.length +
        this.chainStay.start.y -
        this._bottomBracket.coordinates.y);
    return groundPedalClearance > 0 ? groundPedalClearance : 0;
  }

  get toeOverlapClearance(): number {
    if (!this.lowerBody) {
      return 0;
    }

    const feetCircleRadius =
      this.crank.length +
      this.lowerBody.footLength * (1 - LowerBody.feetPositionRatio);
    const frontWheelCircleRadius = this.frontWheel.radiusWithTire;
    const frontHubToOriginDistance = distance(
      this.fork.end,
      this._bottomBracket.coordinates
    );
    const _distance =
      frontHubToOriginDistance - (frontWheelCircleRadius + feetCircleRadius);
    return _distance > 0 ? _distance : 0;
  }

  get trail(): number {
    return (
      this.frontWheel.radiusWithTire * Math.abs((this.headTube.end.x - this.headTube.start.x) / (this.headTube.start.y - this.headTube.end.y)) -
      this.fork.forkOffsetLength / Math.cos(Math.atan(Math.abs((this.headTube.end.x - this.headTube.start.x) / (this.headTube.start.y - this.headTube.end.y))))
    );
  }
}
