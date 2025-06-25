"use client";

import { useState, useCallback } from "react";
import Bike from "@/app/bike/components/Bike";
import BikeForm from "@/app/bike/components/BikeForm";
import { Button } from "@/components/ui/button";
import { useInterval } from "@/lib/hooks";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RiderForm from "./components/RiderForm";
import { useBikeGeometry } from "@/app/bike/lib/useBikeGeometry";

export default function BikePage() {
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinState, setSpinState] = useState(false);

  const { bike: bikeGeometry, shadowBike: shadowBikeGeometry } =
    useBikeGeometry(spinAngle);

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
        <main className="flex flex-col w-full justify-center row-start-2 items-center">
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
            {!shadowBikeGeometry?.seatPost && (
              <div>Shadow bike is too short</div>
            )}
          </div>

          <div className="w-full max-w-7xl h-[500px] relative">
            {bikeGeometry && (
              <div className="absolute inset-0">
                <Bike bike={bikeGeometry} spinAngle={spinAngle} />
              </div>
            )}
            {shadowBikeGeometry && (
              <div className="absolute inset-0">
                <Bike
                  bike={shadowBikeGeometry}
                  spinAngle={spinAngle}
                  isShadow
                />
              </div>
            )}
          </div>

          {/* Bike Measurements Table */}
          {bikeGeometry && shadowBikeGeometry && (
            <div className="w-full max-w-7xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Measurement</TableHead>
                    <TableHead>Bike</TableHead>
                    <TableHead>Shadow Bike</TableHead>
                    <TableHead>Delta</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Rider spine angle row */}
                  <TableRow>
                    <TableCell>Rider Spine Angle</TableCell>
                    <TableCell>{bikeGeometry.spineAngle.toFixed(0)}°</TableCell>
                    <TableCell>
                      {shadowBikeGeometry.spineAngle.toFixed(0)}°
                    </TableCell>
                    <TableCell>
                      {(
                        bikeGeometry.spineAngle - shadowBikeGeometry.spineAngle
                      ).toFixed(0)}
                      °
                    </TableCell>
                    <TableCell>
                      {bikeGeometry.spineAngle - shadowBikeGeometry.spineAngle >
                      0
                        ? "Bike is more upright"
                        : "Shadow bike is more upright"}
                    </TableCell>
                  </TableRow>

                  {/* Standover height row */}
                  {bikeGeometry.lowerBody && shadowBikeGeometry.lowerBody && (
                    <TableRow>
                      <TableCell>Standover Height</TableCell>
                      <TableCell>
                        {(bikeGeometry.standoverHeight / 10).toFixed(0)}cm
                      </TableCell>
                      <TableCell>
                        {(shadowBikeGeometry.standoverHeight / 10).toFixed(0)}cm
                      </TableCell>
                      <TableCell>
                        {(
                          (bikeGeometry.standoverHeight -
                            shadowBikeGeometry.standoverHeight) /
                          10
                        ).toFixed(2)}
                        cm
                      </TableCell>
                      <TableCell>
                        {bikeGeometry.standoverHeight >
                        bikeGeometry.lowerBody.inseamLength
                          ? "Bike is too tall"
                          : ""}
                        {shadowBikeGeometry.standoverHeight >
                        shadowBikeGeometry.lowerBody.inseamLength
                          ? "Shadow bike is too tall"
                          : ""}
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Ground pedal clearance row */}
                  <TableRow>
                    <TableCell>Ground Pedal Clearance</TableCell>
                    <TableCell>
                      {bikeGeometry.groundPedalClearance.toFixed(0)}mm
                    </TableCell>
                    <TableCell>
                      {shadowBikeGeometry.groundPedalClearance.toFixed(0)}mm
                    </TableCell>
                    <TableCell>
                      {(
                        bikeGeometry.groundPedalClearance -
                        shadowBikeGeometry.groundPedalClearance
                      ).toFixed(0)}
                      mm
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {/* Toe overlap clearance row */}
                  <TableRow>
                    <TableCell>Toe Overlap Clearance</TableCell>
                    <TableCell>
                      {bikeGeometry.toeOverlapClearance.toFixed(0)}mm
                    </TableCell>
                    <TableCell>
                      {shadowBikeGeometry.toeOverlapClearance.toFixed(0)}mm
                    </TableCell>
                    <TableCell>
                      {(
                        bikeGeometry.toeOverlapClearance -
                        shadowBikeGeometry.toeOverlapClearance
                      ).toFixed(0)}
                      mm
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {/* Trail row */}
                  <TableRow>
                    <TableCell>Trail</TableCell>
                    <TableCell>{bikeGeometry.trail.toFixed(0)}mm</TableCell>
                    <TableCell>
                      {shadowBikeGeometry.trail.toFixed(0)}mm
                    </TableCell>
                    <TableCell>
                      {(bikeGeometry.trail - shadowBikeGeometry.trail).toFixed(
                        0,
                      )}
                      mm
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </main>
        <footer className="flex row-start-3 gap-[24px] flex-wrap items-center justify-center">
          Ad Astra ✨
        </footer>
      </div>
    </div>
  );
}
