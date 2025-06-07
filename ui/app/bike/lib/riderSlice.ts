import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface RiderState {
  inseamLength: number;
  upperLegLength: number;
  footLength: number;
  armLength: number;
  spineLength: number;
}

const initialState = {
  inseamLength: 0,
  upperLegLength: 0,
  footLength: 0,
  armLength: 0,
  spineLength: 0,
} satisfies RiderState as RiderState;

const riderSlice = createSlice({
  name: "rider",
  initialState,
  reducers: {
    setRider(state, action: PayloadAction<RiderState>) {
      const {
        inseamLength,
        upperLegLength,
        footLength,
        armLength,
        spineLength,
      } = action.payload;
      state.inseamLength = Math.trunc(inseamLength * 10); // Convert cm to mm
      state.upperLegLength = Math.trunc(upperLegLength * 10);
      state.footLength = Math.trunc(footLength * 10);
      state.armLength = Math.trunc(armLength * 10);
      state.spineLength = Math.trunc(spineLength * 10);
    },
  },
  selectors: {
    selectRider: createSelector([(state) => state], (state) => ({
      inseamLength: state.inseamLength / 10,
      upperLegLength: state.upperLegLength / 10,
      footLength: state.footLength / 10,
      armLength: state.armLength / 10,
      spineLength: state.spineLength / 10,
    })),
  },
});

export const { setRider } = riderSlice.actions;
export default riderSlice.reducer;
export const riderSelectors = riderSlice.getSelectors<RootState>(
  (state) => state.rider
);
