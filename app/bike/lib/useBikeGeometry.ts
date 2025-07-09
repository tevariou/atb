"use client";

import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BikeGeometry from "./BikeGeometry";
import type { BikeState } from "./bikeSlice";
import type { RiderState } from "./riderSlice";
import { riderSelectors, riderInitialState } from "./riderSlice";
import { bikeSelectors, bikeInitialState } from "./bikeSlice";
import { shadowBikeSelectors } from "./shadowBikeSlice";
import { STORAGE_KEYS, saveToLocalStorage } from "@/lib/localStorage";

function toBikeGeometry(bike?: BikeState, rider?: RiderState): BikeGeometry {
  return new BikeGeometry({
    reachLength: bike?.reach,
    stackLength: bike?.stack,
    headTubeLength: bike?.headTube,
    headTubeAngle: bike?.headTubeAngle,
    chainStayLength: bike?.chainStay,
    actualSeatTubeAngle: bike?.actualSeatTubeAngle,
    seatTubeLength: bike?.seatTube,
    forkOffsetLength: bike?.forkOffset,
    bbDropLength: bike?.bottomBracketDrop,
    crownToAxleLength: bike?.forkAxleToCrown,
    frontCenterLength: bike?.frontCenter,
    crankLength: bike?.crankLength,
    spacersLength: bike?.spacers,
    stemLength: bike?.stemLength,
    stemAngle: bike?.stemAngle,
    seatPostOffset: bike?.seatOffset,
    qFactor: bike?.crankQFactor,
    handleBarWidth: bike?.handlebarWidth,
    handleBarReach: bike?.handlebarReach,
    handleBarHeight: bike?.handlebarRise,
    effectiveSeatTubeAngle: bike?.effectiveSeatTubeAngle,
    riderUpperLegLength: rider?.upperLegLength && rider.upperLegLength * 10,
    riderFootLength: rider?.footLength && rider.footLength * 10,
    riderArmLength: rider?.armLength && rider.armLength * 10,
    riderSpineLength: rider?.spineLength && rider.spineLength * 10,
    riderInseamLength: rider?.inseamLength && rider.inseamLength * 10,
    frontWheelDiameter: bike?.wheelFrontDiameter,
    rearWheelDiameter: bike?.wheelRearDiameter,
    frontTireWidth: bike?.tireFrontWidth,
    rearTireWidth: bike?.tireRearWidth,
    forkTravel: bike?.forkTravel,
    forkSag: bike?.forkSag,
  });
}

function createToken(
  rawBike: BikeState,
  rawShadowBike: BikeState,
  rawRider: RiderState
): string {
  // Use bikeInitialState to construct bikeKeys for consistent ordering
  const bikeKeys = Object.keys(
    bikeInitialState
  ).toSorted() as (keyof BikeState)[];

  // Use riderInitialState to construct riderKeys for consistent ordering
  const riderKeys = Object.keys(
    riderInitialState
  ).toSorted() as (keyof RiderState)[];

  // Extract non-zero values in order
  const bikeValues = bikeKeys.map((key) => rawBike[key]);

  const shadowBikeValues = bikeKeys.map((key) => rawShadowBike[key]);

  const riderValues = riderKeys.map((key) => rawRider[key]);

  // Create compact data with just the values
  const compactData = {
    b: bikeValues,
    s: shadowBikeValues,
    r: riderValues,
  };

  const jsonString = JSON.stringify(compactData);
  return btoa(jsonString);
}

export function parseToken(token: string): {
  rawBike: BikeState;
  rawShadowBike: BikeState;
  rawRider: RiderState;
} | null {
  try {
    const jsonString = atob(token);
    const compactData = JSON.parse(jsonString);

    // Use bikeInitialState to construct bikeKeys for consistent ordering
    const bikeKeys = Object.keys(
      bikeInitialState
    ).toSorted() as (keyof BikeState)[];

    // Use riderInitialState to construct riderKeys for consistent ordering
    const riderKeys = Object.keys(
      riderInitialState
    ).toSorted() as (keyof RiderState)[];

    const rawBike = bikeKeys.reduce(
      (acc, val, idx) => ({
        ...acc,
        [val]: compactData.b[idx],
      }),
      {} as BikeState
    );

    const rawShadowBike = bikeKeys.reduce(
      (acc, val, idx) => ({
        ...acc,
        [val]: compactData.s[idx],
      }),
      {} as BikeState
    );

    const rawRider = riderKeys.reduce(
      (acc, val, idx) => ({
        ...acc,
        [val]: compactData.r[idx],
      }),
      {} as RiderState
    );

    return { rawBike, rawShadowBike, rawRider };
  } catch {
    return null;
  }
}

export function useBikeGeometry() {
  const bike = useAppSelector(bikeSelectors.selectBike);
  const shadowBike = useAppSelector(shadowBikeSelectors.selectShadowBike);
  const rider = useAppSelector(riderSelectors.selectRider);
  const rawBike = useAppSelector(bikeSelectors.selectRawBike);
  const rawShadowBike = useAppSelector(shadowBikeSelectors.selectRawShadowBike);
  const rawRider = useAppSelector(riderSelectors.selectRawRider);
  const [hasCleanedUrl, setHasCleanedUrl] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!hasCleanedUrl) {
      const tokenParam = searchParams.get("t");
      if (tokenParam) {
        setHasCleanedUrl(true);
        // Remove the token parameter from the URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("t");
        router.replace(newUrl.pathname + newUrl.search);
      }
    }
  }, [searchParams, router, hasCleanedUrl]);

  // Save data to localStorage when values change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.BIKE, rawBike);
  }, [rawBike]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SHADOW_BIKE, rawShadowBike);
  }, [rawShadowBike]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.RIDER, rawRider);
  }, [rawRider]);

  const token = useMemo(
    () => createToken(rawBike, rawShadowBike, rawRider), [rawBike, rawShadowBike, rawRider]
  );

  let bikeGeometry: BikeGeometry | undefined;
  try {
    bikeGeometry = toBikeGeometry(bike, rider);
  } catch {
    bikeGeometry = undefined;
  }

  let shadowBikeGeometry: BikeGeometry | undefined;
  try {
    shadowBikeGeometry = toBikeGeometry(shadowBike, rider);
  } catch {
    shadowBikeGeometry = undefined;
  }

  return {
    bike: bikeGeometry,
    shadowBike: shadowBikeGeometry,
    token,
  };
}
