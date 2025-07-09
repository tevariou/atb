import type { BikeState } from "@/app/bike/lib/bikeSlice";
import type { RiderState } from "@/app/bike/lib/riderSlice";

// LocalStorage keys
export const STORAGE_KEYS = {
  BIKE: "atb-bike-data",
  SHADOW_BIKE: "atb-shadow-bike-data",
  RIDER: "atb-rider-data",
} as const;

// Save data to localStorage
export function saveToLocalStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return; // SSR safety

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
}

// Load data from localStorage
export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null; // SSR safety

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return null;
  }
}

// Load all persisted data
export function loadAllPersistedData() {
  return {
    bike: loadFromLocalStorage<BikeState>(STORAGE_KEYS.BIKE),
    shadowBike: loadFromLocalStorage<BikeState>(STORAGE_KEYS.SHADOW_BIKE),
    rider: loadFromLocalStorage<RiderState>(STORAGE_KEYS.RIDER),
  };
}

// Clear all persisted data
export function clearAllPersistedData(): void {
  if (typeof window === "undefined") return; // SSR safety

  try {
    localStorage.removeItem(STORAGE_KEYS.BIKE);
    localStorage.removeItem(STORAGE_KEYS.SHADOW_BIKE);
    localStorage.removeItem(STORAGE_KEYS.RIDER);
  } catch (error) {
    console.warn("Failed to clear localStorage:", error);
  }
}
