import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { BikeState } from "@/app/bike/lib/bikeSlice";

const initialState = {
  reach: 0,
  stack: 0,
  headTube: 0,
  headTubeAngle: 0,
  chainStay: 0,
  actualSeatTubeAngle: 0,
  effectiveSeatTubeAngle: 0,
  seatTube: 0,
  bottomBracketDrop: 0,
  frontCenter: 0,
  wheelBase: 0,
  forkAxleToCrown: 0,
  forkOffset: 0,
  forkTravel: 0,
  crankLength: 0,
  crankQFactor: 0,
  spacers: 0,
  stemLength: 0,
  stemAngle: 0,
  stemSteererHeight: 0,
  seatOffset: 0,
  handlebarWidth: 0,
  handlebarReach: 0,
  handlebarRise: 0,
  tireFrontWidth: 0,
  tireRearWidth: 0,
  wheelFrontDiameter: 0,
  wheelRearDiameter: 0,
} satisfies BikeState as BikeState;

const shadowBikeSlice = createSlice({
  name: "shadowBike",
  initialState,
  reducers: {
    setShadowBike(state, action: PayloadAction<BikeState>) {
      const {
        reach,
        stack,
        headTube,
        headTubeAngle,
        chainStay,
        actualSeatTubeAngle,
        effectiveSeatTubeAngle,
        seatTube,
        bottomBracketDrop,
        wheelBase,
        forkAxleToCrown,
        forkOffset,
        forkTravel,
        crankLength,
        crankQFactor,
        spacers,
        stemLength,
        stemAngle,
        stemSteererHeight,
        seatOffset,
        handlebarWidth,
        handlebarReach,
        handlebarRise,
        tireFrontWidth,
        tireRearWidth,
        wheelFrontDiameter,
        wheelRearDiameter,
      } = action.payload;
      state.reach = Math.trunc(reach);
      state.stack = Math.trunc(stack);
      state.headTube = Math.trunc(headTube);
      state.headTubeAngle = Math.trunc(headTubeAngle * 10);
      state.chainStay = Math.trunc(chainStay);
      state.actualSeatTubeAngle = Math.trunc(actualSeatTubeAngle * 10);
      state.effectiveSeatTubeAngle = Math.trunc(effectiveSeatTubeAngle * 10);
      state.seatTube = Math.trunc(seatTube);
      state.bottomBracketDrop = Math.trunc(bottomBracketDrop);
      state.wheelBase = Math.trunc(wheelBase);
      state.forkAxleToCrown = Math.trunc(forkAxleToCrown);
      state.forkOffset = Math.trunc(forkOffset);
      state.forkTravel = Math.trunc(forkTravel);
      state.crankLength = Math.trunc(crankLength);
      state.crankQFactor = Math.trunc(crankQFactor);
      state.spacers = Math.trunc(spacers);
      state.stemLength = Math.trunc(stemLength);
      state.stemAngle = Math.trunc(stemAngle);
      state.stemSteererHeight = Math.trunc(stemSteererHeight);
      state.seatOffset = Math.trunc(seatOffset);
      state.handlebarWidth = Math.trunc(handlebarWidth);
      state.handlebarReach = Math.trunc(handlebarReach);
      state.handlebarRise = Math.trunc(handlebarRise);
      state.tireFrontWidth = Math.trunc(tireFrontWidth);
      state.tireRearWidth = Math.trunc(tireRearWidth);
      state.wheelFrontDiameter = Math.trunc(wheelFrontDiameter);
      state.wheelRearDiameter = Math.trunc(wheelRearDiameter);
    },
  },
  selectors: {
    selectShadowBike: createSelector([(state) => state], (state) => ({
      ...state,
      headTubeAngle: state.headTubeAngle / 10,
      actualSeatTubeAngle: state.actualSeatTubeAngle / 10,
      effectiveSeatTubeAngle: state.effectiveSeatTubeAngle / 10,
    })),
  },
});

export const { setShadowBike } = shadowBikeSlice.actions;
export const shadowBikeSelectors = shadowBikeSlice.getSelectors<RootState>(
  (state) => state.shadowBike,
);
export default shadowBikeSlice.reducer;
