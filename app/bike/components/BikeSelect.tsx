"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { BikeState } from "../lib/bikeSlice";
import { toast } from "sonner";
import { useState } from "react";
import {
  useBikeGeometryFromImageMutation,
  useBikeGeometryFromTextBikeGeometryTextPostMutation,
} from "@/store/bikeGeometryApi";
import type { BikeSize } from "@/store/api";
import { useRef } from "react";

type BikeSelectProps = {
  onChangeAction: (bike: BikeState) => void;
};

export default function BikeSelect({ onChangeAction }: BikeSelectProps) {
  const [bikeSizes, setBikeSizes] = useState<(BikeState & { size: string })[]>(
    []
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bikeGeometryFromText] =
    useBikeGeometryFromTextBikeGeometryTextPostMutation();
  const [bikeGeometryFromImage] = useBikeGeometryFromImageMutation();
  const dialogRef = useRef<HTMLButtonElement>(null);

  const FormSchema = z.object({
    text: z
      .string()
      .min(1, {
        message: "Text must be at least 1 character.",
      })
      .max(3000, {
        message: "Text must not be longer than 3000 characters.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const convertValue = (
    field: { value: number | null; unit: string | null } | null
  ) => {
    if (!field?.value) return 0;
    switch (field.unit) {
      case "cm":
        return field.value * 10;
      default:
        return field.value;
    }
  };

  const convertWheelSize = (
    field: { value: number | null; unit: string | null } | null
  ) => {
    if (!field?.value) return 0;
    switch (field.value) {
      case 20:
        return 406;
      case 26:
        return 559;
      case 27.5:
      case 650:
        return 584;
      case 28:
      case 29:
      case 700:
        return 622;
      default:
        return 0;
    }
  };

  const transformBikeResults = (result: BikeSize[]) => {
    return result.map((bike) => ({
      size: bike.size,
      reach: convertValue(bike.reach),
      stack: convertValue(bike.stack),
      headTube: convertValue(bike.head_tube),
      headTubeAngle: convertValue(bike.head_tube_angle),
      chainStay: convertValue(bike.chain_stay),
      actualSeatTubeAngle: convertValue(bike.actual_seat_tube_angle),
      effectiveSeatTubeAngle: convertValue(bike.effective_seat_tube_angle),
      seatTube: convertValue(bike.seat_tube),
      bottomBracketDrop: convertValue(bike.bottom_bracket_drop),
      frontCenter: convertValue(bike.front_center),
      wheelBase: convertValue(bike.wheel_base),
      forkAxleToCrown: convertValue(bike.fork_axle_to_crown),
      forkOffset: convertValue(bike.fork_offset),
      forkTravel: convertValue(bike.fork_travel),
      forkSag: convertValue(bike.fork_sag),
      crankLength: convertValue(bike.crank_length),
      crankQFactor: convertValue(bike.crank_q_factor),
      spacers: convertValue(bike.spacers),
      stemLength: convertValue(bike.stem_length),
      stemAngle: convertValue(bike.stem_angle),
      seatOffset: convertValue(bike.seat_offset),
      handlebarWidth: convertValue(bike.handlebar_width),
      handlebarReach: convertValue(bike.handlebar_reach),
      handlebarRise: convertValue(bike.handlebar_rise),
      tireFrontWidth: convertValue(bike.tire_front_width),
      tireRearWidth: convertValue(bike.tire_rear_width),
      wheelFrontDiameter: convertWheelSize(bike.wheel_front_diameter),
      wheelRearDiameter: convertWheelSize(bike.wheel_rear_diameter),
    }));
  };

  const onSubmitText = async (data: z.infer<typeof FormSchema>) => {
    try {
      toast.loading("Extracting bike geometry from text...");

      const result = await bikeGeometryFromText({
        bikeGeometryTextRequest: { text: data.text },
      }).unwrap();

      toast.dismiss();
      toast.success("Bike geometry extracted successfully!", {
        description: `Found ${result.length} bike(s)`,
      });

      const transformedBikes = transformBikeResults(result);
      setBikeSizes(transformedBikes);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to extract bike geometry", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      console.error("Error extracting bike geometry:", error);
    }
  };

  const onSubmitImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file");
      return;
    }

    try {
      toast.loading("Extracting bike geometry from image...");

      const result = await bikeGeometryFromImage({
        image: selectedFile,
      }).unwrap();

      toast.dismiss();
      toast.success("Bike geometry extracted successfully!", {
        description: `Found ${result.length} bike(s)`,
      });

      const transformedBikes = transformBikeResults(result);
      setBikeSizes(transformedBikes);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to extract bike geometry from image", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      console.error("Error extracting bike geometry from image:", error);
    }
  };

  const onSelectSize = (bike: BikeState) => {
    onChangeAction(bike);
    setBikeSizes([]);
    setSelectedFile(null);
    form.reset();
    dialogRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Fill the form with AI</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Extract bike geometry from an image or text
            </DialogTitle>
            <DialogDescription>
              Upload a screenshot of a bike geometry chart or copy and paste the
              text content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
              <TabsContent value="image" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="image-upload"
                      className="block text-sm font-medium mb-2"
                    >
                      Upload bike geometry chart image
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload a screenshot or image of a bike geometry chart to
                      extract measurements.
                    </p>
                  </div>
                  {selectedFile && (
                    <div className="text-sm text-green-600">
                      Selected: {selectedFile.name}
                    </div>
                  )}
                  <Button
                    onClick={onSubmitImage}
                    disabled={!selectedFile}
                    className="w-full"
                  >
                    Extract from Image
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="text" className="space-y-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitText)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bike geometry chart</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Copy and paste a bike geometry chart here"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Paste a bike geometry chart or specifications here
                            to extract measurements.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Extract from Text</Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <div className="flex flex-col gap-2">
              {bikeSizes.length > 0 && (
                <p>Which bike size do you want to use?</p>
              )}
              <div className="flex flex-row gap-2">
                {bikeSizes.map((bike) => (
                  <Button
                    type="submit"
                    key={`sizes-${bike.size}`}
                    onClick={() => onSelectSize(bike)}
                  >
                    {bike.size}
                  </Button>
                ))}
              </div>
              <DialogClose asChild>
                <Button variant="outline" ref={dialogRef}>
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
