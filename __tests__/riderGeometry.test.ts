import BottomBracket from "../app/bike/lib/BottomBracket";
import Crank from "../app/bike/lib/Crank";
import HandleBar from "../app/bike/lib/HandleBar";
import LowerBody from "../app/bike/lib/LowerBody";
import SeatPost from "../app/bike/lib/SeatPost";
import UpperBody from "../app/bike/lib/UpperBody";

// Inspect the points passed to the renderer without SVG path rounding.
jest.mock("d3", () => ({ line: () => JSON.stringify }));

function leg(
  hipX: number,
  inseam: number,
  thigh: number,
  heelOffset: number,
  qFactor: number,
) {
  const bottomBracket = new BottomBracket({ x: 0, y: 0 });
  return new LowerBody({
    bottomBracket,
    crank: new Crank({ bottomBracket, crankLength: 170, qFactor }),
    seatPost: { start: { x: hipX, y: 650 } } as SeatPost,
    riderInseamLength: inseam,
    riderUpperLegLength: thigh,
    riderFootLength: 270,
    riderCleatOffset: 270 - heelOffset,
  });
}

it.each([0, 160])(
  "preserves both leg lengths throughout a turn at Q-factor %i",
  (qFactor) => {
    const body = leg(-300, 895, 200, 100, qFactor);
    for (let angle = 0; angle < 360; angle++) {
      const [hip, knee, heel]: number[][] = JSON.parse(body.draw(angle));
      const shinXY = Math.hypot(knee[0] - heel[0], knee[1] - heel[1]);
      const thighXY = Math.hypot(knee[0] - hip[0], knee[1] - hip[1]);
      if (qFactor === 0) {
        expect(shinXY).toBeCloseTo(695, 8);
        expect(thighXY).toBeCloseTo(200, 8);
      } else {
        // Recover the knee's lateral position from the two squared limb lengths.
        const width = qFactor / 2;
        const kneeZ =
          (200 ** 2 - thighXY ** 2 - 695 ** 2 + shinXY ** 2 + width ** 2) /
          (2 * width);
        expect(Math.hypot(thighXY, kneeZ)).toBeCloseTo(200, 8);
        expect(Math.hypot(shinXY, width - kneeZ)).toBeCloseTo(695, 8);
      }
    }
  },
);

it.each([
  [-200, 860, 160],
  [0, 830, 400],
])("rejects an unreachable part of the heel orbit", (hipX, inseam, thigh) => {
  expect(() => leg(hipX, inseam, thigh, 200, 0)).toThrow(/pedal stroke/);
});

it.each([0, 0.001, -0.001])(
  "solves the shoulder at a grip height difference of %f",
  (dy) => {
    const body = new UpperBody({
      seatPost: { start: { x: 0, y: 500 } } as SeatPost,
      handleBar: {
        coordinates: { x: 600, y: 500 + dy },
        width: 0,
      } as HandleBar,
      riderArmLength: 500,
      riderSpineLength: 500,
    });
    const { x, y } = body.shoulder;
    expect(y).toBeGreaterThan(500);
    expect(Math.hypot(x, y - 500)).toBeCloseTo(500, 9);
    expect(Math.hypot(x - 600, y - 500 - dy)).toBeCloseTo(500, 9);
  },
);
