"use client";

import { useState, useCallback } from "react";
import Bike from "@/app/bike/components/Bike";
import BikeForm from "@/app/bike/components/BikeForm";
import { Button } from "@/components/ui/button";
import { useInterval } from "@/lib/hooks"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerPortal,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiderForm from "./components/RiderForm";
import { useBikeGeometry } from "@/app/bike/lib/useBikeGeometry";


export default function BikePage() {
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinState, setSpinState] = useState(false);

  const { bike: bikeGeometry, shadowBike: shadowBikeGeometry } = useBikeGeometry(spinAngle);

  const incrementAngle = useCallback(() => {
    if (spinAngle < 360) {
      setSpinAngle(spinAngle + 1);
    } else {
      setSpinAngle(0);
    }
  }, [spinAngle]);

  useInterval(incrementAngle, spinState ? 42 : undefined);

  const handleSpin = () => {
    setSpinState(!spinState);
  };

  return (
    <div className="container mx-auto">
      <div className="min-h-screen p-10 pb-20">
        <main className="flex flex-col w-full justify-center row-start-2 items-center gap-4">
          <div className="flex flex-row gap-4">
            <Button onClick={handleSpin} variant="outline">
              {spinState ? "Stop" : "Spin"} the bike
            </Button>
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="outline">Configure</Button>
              </DrawerTrigger>
              <DrawerPortal>
                <DrawerContent className="min-h-full overflow-y-auto overflow-x-hidden max-h-screen">
                  <DrawerHeader>
                    <DrawerTitle>Configure your bike here</DrawerTitle>
                    <DrawerDescription>
                      You can save if logged in
                    </DrawerDescription>
                  </DrawerHeader>
                  <Tabs defaultValue="bike">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="bike">Bike</TabsTrigger>
                      <TabsTrigger value="shadow">Shadow Bike</TabsTrigger>
                      <TabsTrigger value="rider">Rider</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bike">
                      <BikeForm />
                    </TabsContent>
                    <TabsContent value="shadow">
                      <BikeForm isShadow />
                    </TabsContent>
                    <TabsContent value="rider">
                      <RiderForm />
                    </TabsContent>
                  </Tabs>
                </DrawerContent>
              </DrawerPortal>
            </Drawer>
          </div>
          <div className="flex flex-row gap-4">
            {!bikeGeometry?.seatPost && <div>Bike is too short</div>}
            {!shadowBikeGeometry?.seatPost && <div>Shadow bike is too short</div>}
          </div>
          {/* Rider spine angle row */}
          {bikeGeometry && shadowBikeGeometry && (
            <div className="flex flex-row gap-4">
              <div>Rider spine angle on bike: {bikeGeometry.spineAngle.toFixed(2)}°</div>
              <div>Rider spine angle on shadow bike: {shadowBikeGeometry.spineAngle.toFixed(2)}°</div>
              <div>Delta: {(bikeGeometry.spineAngle - shadowBikeGeometry.spineAngle).toFixed(2)}°</div>
              <div>{bikeGeometry.spineAngle - shadowBikeGeometry.spineAngle > 0 ? "Bike is more upright" : "Shadow bike is more upright"}</div>
            </div>
          )}
          {/* Standover height row */}
          {bikeGeometry && shadowBikeGeometry && bikeGeometry.lowerBody && shadowBikeGeometry.lowerBody && (
            <div className="flex flex-row gap-4">
              <div>Bike standover height: {(bikeGeometry.standoverHeight / 10).toFixed(0)}cm</div>
              <div>Shadow bike standover height: {(shadowBikeGeometry.standoverHeight / 10).toFixed(0)}cm</div>
              <div>Delta: {((bikeGeometry.standoverHeight - shadowBikeGeometry.standoverHeight) / 10).toFixed(2)}cm</div>
              <div>{bikeGeometry.standoverHeight > bikeGeometry.lowerBody.inseamLength ? "Bike is too tall" : ""}</div>
              <div>{shadowBikeGeometry.standoverHeight > shadowBikeGeometry.lowerBody.inseamLength ? "Shadow bike is too tall" : ""}</div>
            </div>
          )}
          {/* Ground pedal clearance row */}
          {bikeGeometry && shadowBikeGeometry && (
            <div className="flex flex-row gap-4">
              <div>Ground pedal clearance: {bikeGeometry.groundPedalClearance.toFixed(0)}mm</div>
              <div>Shadow bike ground pedal clearance: {shadowBikeGeometry.groundPedalClearance.toFixed(0)}mm</div>
              <div>Delta: {(bikeGeometry.groundPedalClearance - shadowBikeGeometry.groundPedalClearance).toFixed(0)}mm</div>
            </div>
          )}
          {/* Toe overlap clearance row */}
          {bikeGeometry && shadowBikeGeometry && (
            <div className="flex flex-row gap-4">
              <div>Toe overlap clearance: {bikeGeometry.toeOverlapClearance.toFixed(0)}mm</div>
              <div>Shadow bike toe overlap clearance: {shadowBikeGeometry.toeOverlapClearance.toFixed(0)}mm</div>
              <div>Delta: {(bikeGeometry.toeOverlapClearance - shadowBikeGeometry.toeOverlapClearance).toFixed(0)}mm</div>
            </div>
          )}
          {/* Trail row */}
          {bikeGeometry && shadowBikeGeometry && (
            <div className="flex flex-row gap-4">
              <div>Trail: {bikeGeometry.trail.toFixed(0)}mm</div>
              <div>Shadow bike trail: {shadowBikeGeometry.trail.toFixed(0)}mm</div>
              <div>Delta: {(bikeGeometry.trail - shadowBikeGeometry.trail).toFixed(0)}mm</div>
            </div>
          )}
          <div className="w-full max-w-7xl h-[750px] relative">
            {bikeGeometry && <div className="absolute inset-0"><Bike bike={bikeGeometry} spinAngle={spinAngle} /></div>}
            {shadowBikeGeometry && <div className="absolute inset-0"><Bike bike={shadowBikeGeometry} spinAngle={spinAngle} isShadow /></div>}
          </div>
        </main>
        <footer className="flex row-start-3 gap-[24px] flex-wrap items-center justify-center">
          Ad Astra ✨
        </footer>
      </div>
    </div>
  );
}
