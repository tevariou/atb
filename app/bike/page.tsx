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
import {
  Share2,
  Settings,
  Eye,
  EyeOff,
  Bike as BikeIcon,
  Disc as NonSpinIcon,
  Disc3 as SpinIcon,
  User,
  AlertCircle, 
} from "lucide-react";
import { MAIN_BIKE_COLOR, SHADOW_BIKE_COLOR } from "./lib/constants";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  const [activeTab, setActiveTab] = useState("bike");

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
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 justify-center">
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
                  <DrawerContent className="w-screen h-[100dvh] max-w-full overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch">
                    <DrawerHeader>
                      <DrawerTitle>Configure your bikes here</DrawerTitle>
                      <DrawerDescription>
                        Select one below or fill in the fields
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 flex flex-col min-h-0">
                      <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="flex flex-col flex-1 min-h-0"
                      >
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger
                            value="bike"
                            className="flex items-center gap-2"
                          >
                            <BikeIcon
                              className="w-4 h-4"
                              style={{ color: MAIN_BIKE_COLOR }}
                            />
                          </TabsTrigger>
                          <TabsTrigger
                            value="shadow"
                            className="flex items-center gap-2"
                          >
                            <BikeIcon
                              className="w-4 h-4"
                              style={{ color: SHADOW_BIKE_COLOR }}
                            />
                          </TabsTrigger>
                          <TabsTrigger
                            value="rider"
                            className="flex items-center gap-2"
                          >
                            <User className="w-4 h-4" />
                          </TabsTrigger>
                        </TabsList>
                        <div
                          key={activeTab}
                          className="flex-1 min-h-0 max-h-screen overflow-y-auto"
                        >
                          <TabsContent value="bike">
                            <BikeForm />
                          </TabsContent>
                          <TabsContent value="shadow">
                            <BikeForm isShadow />
                          </TabsContent>
                          <TabsContent value="rider">
                            <RiderForm />
                          </TabsContent>
                        </div>
                      </Tabs>
                    </div>
                  </DrawerContent>
                </DrawerPortal>
              </Drawer> 
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    aria-label="Help"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="text-sm">
                    Need help? Here you can configure your bikes, compare
                    geometries, and see measurements. Start by clicking on the
                    settings button to configure your bikes.
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="flex flex-row gap-4">
              <Button
                onClick={() => setShowBike(!showBike)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {showBike ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <BikeIcon
                  className="inline w-4 h-4 mr-1"
                  style={{ color: MAIN_BIKE_COLOR }}
                />
              </Button>
              <Button
                onClick={() => setShowShadowBike(!showShadowBike)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {showShadowBike ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <BikeIcon
                  className="inline w-4 h-4 mr-1"
                  style={{ color: SHADOW_BIKE_COLOR }}
                />
              </Button>
              <Button onClick={handleSpin} variant="outline">
                {spinState ? (
                  <NonSpinIcon className="w-4 h-4" />
                ) : (
                  <SpinIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
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
