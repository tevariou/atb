import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import rider from "@/app/bike/lib/riderSlice";
import bike from "@/app/bike/lib/bikeSlice";
import shadowBike from "@/app/bike/lib/shadowBikeSlice";

const rootReducer = combineReducers({
  rider,
  bike,
  shadowBike,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
