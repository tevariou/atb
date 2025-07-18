import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import rider from "@/app/bike/lib/riderSlice";
import bike from "@/app/bike/lib/bikeSlice";
import shadowBike from "@/app/bike/lib/shadowBikeSlice";
import {
  clearAllPersistedData,
  loadAllPersistedData,
} from "@/lib/localStorage";
import { parseToken } from "@/app/bike/lib/useBikeGeometry";
import pkg from "@/package.json";
const version = pkg.version;

const rootReducer = combineReducers({
  rider,
  bike,
  shadowBike,
});

export type RootState = ReturnType<typeof rootReducer>;

// Get preloaded state from URL token or localStorage
function getPreloadedState(): Partial<RootState> | undefined {
  if (typeof window === "undefined") return undefined; // SSR safety

  try {
    // First, check for URL token parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("t");

    if (tokenParam) {
      const parsedData = parseToken(tokenParam);
      if (
        parsedData &&
        parsedData.majorVersion &&
        parsedData.majorVersion === version.split(".")[0]
      ) {
        // Return the parsed data as preloaded state
        return {
          bike: parsedData.rawBike,
          shadowBike: parsedData.rawShadowBike,
          rider: parsedData.rawRider,
        };
      }
    }

    // Fallback to localStorage if no valid token found
    const persistedData = loadAllPersistedData();

    if (
      !persistedData.version ||
      persistedData.version !== version.split(".")[0]
    ) {
      clearAllPersistedData();
      return undefined;
    }

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
    console.warn("Failed to load preloaded state:", error);
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
