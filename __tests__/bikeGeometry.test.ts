import BikeGeometry from "../app/bike/lib/BikeGeometry";

jest.mock("d3", () => ({}));

it.each([
  [622, 622],
  [622, 584],
  [584, 622],
])("levels the tires for %i mm front and %i mm rear rims", (front, rear) => {
  const bike = new BikeGeometry({
    frontWheelDiameter: front,
    rearWheelDiameter: rear,
    frontTireWidth: 50,
    rearTireWidth: 50,
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
  });

  expect(bike.fork.end.y - bike.frontWheel.radiusWithTire).toBeCloseTo(
    bike.chainStay.start.y - bike.rearWheel.radiusWithTire,
    9,
  );
});
