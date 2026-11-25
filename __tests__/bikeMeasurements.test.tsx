import { render, within, screen } from "@testing-library/react";
import { wheelDiameterMm } from "../app/bike/lib/Wheel";
import BikeGeometry from "../app/bike/lib/BikeGeometry";
import BikeMeasurementsTable from "../app/bike/components/BikeMeasurementsTable";
import bike, {
  bikeInitialState,
  setBike,
  bikeSelectors,
} from "../app/bike/lib/bikeSlice";
import shadowBike, {
  setShadowBike,
  shadowBikeSelectors,
} from "../app/bike/lib/shadowBikeSlice";
import type { RootState } from "../lib/store";

jest.mock("d3", () => ({}));

const frame = {
  reachLength: 365,
  stackLength: 574,
  headTubeLength: 127,
  headTubeAngle: 69,
  chainStayLength: 450,
  bbDropLength: 63,
  actualSeatTubeAngle: 73.5,
  effectiveSeatTubeAngle: 73.5,
  seatTubeLength: 380,
  crownToAxleLength: 440,
  forkOffsetLength: 55,
  crankLength: 170,
  qFactor: 172,
  frontWheelDiameter: 622,
  rearWheelDiameter: 622,
  frontTireWidth: 54,
  rearTireWidth: 54,
};
const rider = {
  riderInseamLength: 870,
  riderUpperLegLength: 390,
  riderFootLength: 290,
  riderCleatOffset: 70,
  riderArmLength: 690,
  riderSpineLength: 700,
  handleBarWidth: 420,
};

it("round-trips identical geometry through the main and comparison reducers", () => {
  const input = {
    ...bikeInitialState,
    frontCenter: 640,
    actualSeatTubeAngle: 70.07,
    headTubeAngle: 72.75,
    effectiveSeatTubeAngle: 71.13,
  };
  const state = {
    bike: bike(undefined, setBike(input)),
    shadowBike: shadowBike(undefined, setShadowBike(input)),
  } as RootState;
  expect(bikeSelectors.selectBike(state)).toEqual(input);
  expect(shadowBikeSelectors.selectShadowBike(state)).toEqual(input);
  const legacy = {
    ...state,
    shadowBike: { ...state.shadowBike, headTubeAngle: 727 },
  };
  expect(shadowBikeSelectors.selectShadowBike(legacy).headTubeAngle).toBe(72.7);
});

it.each([
  { frontCenterLength: 640 },
  { wheelBase: 1100 },
  { crownToAxleLength: 440 },
])("applies sag along the steering axis for %o", (input) => {
  const options = { ...frame, crownToAxleLength: 0, ...input, forkTravel: 100 };
  const raw = new BikeGeometry(options);
  const sagged = new BikeGeometry({ ...options, forkSag: 25 });
  function forkComponents(b: BikeGeometry) {
    const ax = b.headTube.end.x - b.headTube.start.x,
      ay = b.headTube.end.y - b.headTube.start.y;
    const dx = b.fork.end.x - b.fork.start.x,
      dy = b.fork.end.y - b.fork.start.y;
    return [
      (dx * ax + dy * ay) / Math.hypot(ax, ay),
      (dy * ax - dx * ay) / Math.hypot(ax, ay),
    ];
  }
  const [length, offset] = forkComponents(raw);
  const [compressed, afterOffset] = forkComponents(sagged);
  expect(length - compressed).toBeCloseTo(25, 9);
  expect(afterOffset).toBeCloseTo(offset, 9);
});

it("preserves the specified unsagged horizontal wheelbase with unequal tires", () => {
  const b = new BikeGeometry({
    ...frame,
    crownToAxleLength: 0,
    wheelBase: 1100,
    rearWheelDiameter: 584,
  });
  expect(b.fork.end.x - b.chainStay.start.x).toBeCloseTo(1100, 9);
  expect(b.fork.end.y - b.frontWheel.radiusWithTire).toBeCloseTo(b.ground, 9);
});

it("rejects an impossible offset and excessive compression", () => {
  expect(() => new BikeGeometry({ ...frame, crownToAxleLength: 40 })).toThrow(
    /offset/,
  );
  expect(
    () =>
      new BikeGeometry({
        ...frame,
        crownToAxleLength: 100,
        forkTravel: 150,
        forkSag: 100,
      }),
  ).toThrow(/sag/);
});

it("keeps measurements independent of unrelated rider inputs", () => {
  const complete = new BikeGeometry({ ...frame, ...rider });
  const arms = new BikeGeometry({ ...frame, ...rider, riderArmLength: 200 });
  const legs = new BikeGeometry({ ...frame, ...rider, riderUpperLegLength: 1 });
  const short = new BikeGeometry({
    ...frame,
    ...rider,
    riderInseamLength: 500,
  });
  expect(complete.toeOverlapClearance).toBeCloseTo(16.98835);
  for (const b of [arms, legs, short])
    expect(b.toeOverlapClearance).toBe(complete.toeOverlapClearance);
  expect(arms.lowerBody).toBeDefined();
  expect(arms.spineAngle).toBeUndefined();
  expect(legs.lowerBody).toBeUndefined();
  expect(legs.spineAngle).toBe(complete.spineAngle);
  expect(short.seatPost).toBeUndefined();
  expect(short.handlebarToSaddleHeight).toBeUndefined();
});

it("displays valid zero heights and distinguishes missing shoe data from overlap", () => {
  const b = new BikeGeometry({ ...frame, ...rider });
  const level = new BikeGeometry({
    ...frame,
    ...rider,
    handleBarHeight: -b.handlebarToSaddleHeight!,
  });
  const missing = new BikeGeometry(frame);
  render(
    <BikeMeasurementsTable bikeGeometry={level} shadowBikeGeometry={missing} />,
  );
  const row = (name: string) => within(screen.getByText(name).closest("tr")!);
  expect(row("Handlebar to Saddle Height").getByText("0mm")).toBeDefined();
  expect(
    row("Toe Overlap Clearance").queryByText("might be too short"),
  ).toBeNull();
  expect(row("Standover Height").getAllByRole("cell")[1].textContent).toEqual(
    row("Standover Height").getAllByRole("cell")[2].textContent,
  );
});

it("uses the steering angle for trail even with zero head-tube length", () => {
  const b = new BikeGeometry({
    ...frame,
    headTubeLength: 0,
    crownToAxleLength: 0,
    wheelBase: 1100,
  });
  const expected =
    frame.reachLength +
    (frame.stackLength - b.ground) /
      Math.tan((frame.headTubeAngle * Math.PI) / 180) -
    b.fork.end.x;
  expect(b.trail).toBeCloseTo(expected, 9);
  expect(
    new BikeGeometry({
      ...frame,
      headTubeAngle: 0,
      crownToAxleLength: 0,
      wheelBase: 1100,
    }).trail,
  ).toBeUndefined();
});

it("keeps seat-tube length when the top coincides with the effective top-tube reference", () => {
  const b = new BikeGeometry({
    ...frame,
    stackLength: 300,
    seatTubeLength: 500,
    actualSeatTubeAngle: (Math.atan2(3, 4) * 180) / Math.PI,
    effectiveSeatTubeAngle: (Math.atan2(3, 4) * 180) / Math.PI,
  });
  expect(
    Math.hypot(
      b.seatTube.start.x - b.seatTube.end.x,
      b.seatTube.start.y - b.seatTube.end.y,
    ),
  ).toBeCloseTo(500, 9);
});

it("accepts measured rim diameters alongside nominal wheel sizes", () => {
  expect(wheelDiameterMm({ value: 622, unit: "mm" })).toBe(622);
  expect(wheelDiameterMm({ value: 58.4, unit: "cm" })).toBe(584);
  expect(wheelDiameterMm({ value: 27.5, unit: null })).toBe(584);
});
