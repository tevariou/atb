import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import rider from "@/app/bike/lib/riderSlice";
import bike from "@/app/bike/lib/bikeSlice";
import shadowBike from "@/app/bike/lib/shadowBikeSlice";
import { loadAllPersistedData } from "@/lib/localStorage";

const rootReducer = combineReducers({
  rider,
  bike,
  shadowBike,
});

export type RootState = ReturnType<typeof rootReducer>;

// Get preloaded state from localStorage
function getPreloadedState(): Partial<RootState> | undefined {
  if (typeof window === "undefined") return undefined; // SSR safety

  try {
    const persistedData = loadAllPersistedData();
    const preloadedState: Partial<RootState> = {};

    if (persistedData.bike) {
      preloadedState.bike = persistedData.bike;
    }
    if (persistedData.shadowBike) {
      preloadedState.shadowBike = persistedData.shadowBike;
    }
    if (persistedData.rider) {
      preloadedState.rider = persistedData.rider;
    }

    return Object.keys(preloadedState).length > 0 ? preloadedState : undefined;
  } catch (error) {
    console.warn("Failed to load preloaded state from localStorage:", error);
    return undefined;
  }
}

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState || getPreloadedState(),
  });
  setupListeners(store.dispatch);
  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
