"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Bike from "@/app/bike/components/Bike";
import BikeForm from "@/app/bike/components/BikeForm";
import BikeMeasurementsTable from "@/app/bike/components/BikeMeasurementsTable";
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
import RiderForm from "./components/RiderForm";
import { useBikeGeometry } from "@/app/bike/lib/useBikeGeometry";
import { Share2, Settings } from "lucide-react";

function Loading() {
  return (
    <div className="container mx-auto">
      <div className="min-h-screen p-10 pb-20">
        <main className="flex flex-col w-full justify-center row-start-2 items-center">
          <div>Loading...</div>
        </main>
      </div>
    </div>
  );
}

function BikePageContent() {
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinState, setSpinState] = useState(false);
  const [showBike, setShowBike] = useState(true);
  const [showShadowBike, setShowShadowBike] = useState(true);
  const [shareStatus, setShareStatus] = useState<string>("Share");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    bike: bikeGeometry,
    shadowBike: shadowBikeGeometry,
    token,
  } = useBikeGeometry();

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

  const handleShare = async () => {
    if (!token) {
      return;
    }

    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("t", token);

      await navigator.clipboard.writeText(currentUrl.toString());
      setShareStatus("Copied!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }

    setTimeout(() => setShareStatus("Share"), 2000);
  };

  if (!isClient) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto">
      <div className="min-h-screen p-10 pb-20">
        <main className="flex flex-col w-full justify-center row-start-2 items-center">
          <div className="flex flex-row gap-4">
            <Button onClick={() => setShowBike(!showBike)} variant="outline">
              {showBike ? "Hide" : "Show"} Bike
            </Button>
            <Button
              onClick={() => setShowShadowBike(!showShadowBike)}
              variant="outline"
            >
              {showShadowBike ? "Hide" : "Show"} Shadow Bike
            </Button>
            <Button onClick={handleSpin} variant="outline">
              {spinState ? "Stop" : "Spin"} the bikes
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {shareStatus}
            </Button>
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                </Button>
              </DrawerTrigger>
              <DrawerPortal>
                <DrawerContent className="min-h-full overflow-y-auto overflow-x-hidden max-h-screen">
                  <DrawerHeader>
                    <DrawerTitle>Configure your bikes here</DrawerTitle>
                    <DrawerDescription>
                      Select one below or fill in the fields
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
          <div className="w-full max-w-7xl h-[500px] relative">
            {bikeGeometry && shadowBikeGeometry && showShadowBike && (
              <div className="absolute inset-0">
                <Bike
                  bike={shadowBikeGeometry}
                  spinAngle={spinAngle}
                  isShadow
                  adjustYAxis={bikeGeometry.ground - shadowBikeGeometry.ground}
                />
              </div>
            )}
            {bikeGeometry && showBike && (
              <div className="absolute inset-0">
                <Bike bike={bikeGeometry} spinAngle={spinAngle} />
              </div>
            )}
          </div>

          {/* Bike Measurements Table */}
          {bikeGeometry && shadowBikeGeometry && (
            <BikeMeasurementsTable
              bikeGeometry={bikeGeometry}
              shadowBikeGeometry={shadowBikeGeometry}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function BikePage() {
  return (
    <Suspense fallback={<Loading />}>
      <BikePageContent />
    </Suspense>
  );
}
