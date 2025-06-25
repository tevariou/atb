"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { AlertCircle } from "lucide-react";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setBike, bikeSelectors } from "../lib/bikeSlice";
import { setShadowBike, shadowBikeSelectors } from "../lib/shadowBikeSlice";
import type { BikeState } from "../lib/bikeSlice";
import BikeSelect from "./BikeSelect";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type BikeFormProps = { isShadow?: boolean };

export default function BikeForm({ isShadow = false }: BikeFormProps) {
  const dispatch = useAppDispatch();
  const bike = useAppSelector(
    isShadow ? shadowBikeSelectors.selectShadowBike : bikeSelectors.selectBike,
  );

  const bikeAttributes: Record<
    keyof BikeState,
    { label: string; type: z.ZodTypeAny; warnings?: string[] }
  > = {
    stack: {
      label: "Stack (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    reach: {
      label: "Reach (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    headTube: {
      label: "Head tube length (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
      warnings: [
        "Include the external headset bottom cup stack height in the headtube length if applicable",
      ],
    },
    headTubeAngle: {
      label: "Head tube angle (degrees)",
      type: z
        .number()
        .min(0, "Angle must be at least 0 degrees")
        .max(89, "Angle must be less than 90 degrees")
        .refine((n) => !(n * 100).toString().includes("."), {
          message: "Max precision is 2 decimal places",
        }),
    },
    chainStay: {
      label: "Chainstay length (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    actualSeatTubeAngle: {
      label: "Actual seat tube angle (degrees)",
      type: z
        .number()
        .min(0, "Angle must be at least 0 degrees")
        .max(89, "Angle must be less than 90 degrees")
        .refine((n) => !(n * 100).toString().includes("."), {
          message: "Max precision is 2 decimal places",
        }),
    },
    effectiveSeatTubeAngle: {
      label: "Effective seat tube angle (degrees)",
      type: z
        .number()
        .min(0, "Angle must be at least 0 degrees")
        .max(89, "Angle must be less than 90 degrees")
        .refine((n) => !(n * 100).toString().includes("."), {
          message: "Max precision is 2 decimal places",
        }),
    },
    seatTube: {
      label: "Seat tube length (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    bottomBracketDrop: {
      label: "Bottom bracket drop (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    frontCenter: {
      label: "Front center (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    wheelBase: {
      label: "Wheelbase (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(2000, "Value must be at most 2000"),
    },
    forkAxleToCrown: {
      label: "Fork axle to crown (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    forkOffset: {
      label: "Fork offset (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(100, "Value must be at most 100"),
    },
    forkTravel: {
      label: "Fork travel (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(300, "Value must be at most 300"),
    },
    crankLength: {
      label: "Crank length (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(300, "Value must be at most 300"),
    },
    crankQFactor: {
      label: "Crank Q factor (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(300, "Value must be at most 300"),
    },
    spacers: {
      label: "Spacers height (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
      warnings: [
        "Include the external headset top cup stack height in the calculated length if applicable",
        "Include the stem steerer height in the calculated length if applicable",
      ],
    },
    stemLength: {
      label: "Stem length (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(200, "Value must be at most 200"),
    },
    stemAngle: {
      label: "Stem angle (degrees)",
      type: z
        .number()
        .int()
        .min(-89, "Angle must be at least -90 degrees")
        .max(89, "Angle must be less than 90 degrees"),
    },
    stemSteererHeight: {
      label: "Stem steerer height (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(100, "Value must be at most 100"),
    },
    seatOffset: {
      label: "Seat offset (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(100, "Value must be at most 100"),
    },
    handlebarWidth: {
      label: "Handlebar width (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    handlebarReach: {
      label: "Handlebar reach (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(300, "Value must be at most 300"),
    },
    handlebarRise: {
      label: "Handlebar rise (mm)",
      type: z
        .number()
        .int()
        .min(-100, "Handlebar rise must be at least -100mm")
        .max(100, "Handlebar rise must be at most 100mm"),
    },
    tireFrontWidth: {
      label: "Front tire width (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(200, "Value must be at most 200"),
    },
    tireRearWidth: {
      label: "Rear tire width (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(200, "Value must be at most 200"),
    },
    wheelFrontDiameter: {
      label: "Front wheel diameter (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
    wheelRearDiameter: {
      label: "Rear wheel diameter (mm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(1000, "Value must be at most 1000"),
    },
  };

  const formSchema = z.object(
    Object.entries(bikeAttributes).reduce<
      Record<keyof BikeState, z.ZodTypeAny>
    >(
      (acc, [key, value]) => ({ ...acc, [key]: value.type }),
      {} as Record<keyof BikeState, z.ZodTypeAny>,
    ),
  );
  const formFields = formSchema.keyof().options;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...bike,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updatedBike = { ...bike, ...values };
    dispatch(isShadow ? setShadowBike(updatedBike) : setBike(updatedBike));
  };

  const onBikeSelectChange = (bike: BikeState) => {
    form.reset(bike);
    dispatch(isShadow ? setShadowBike(bike) : setBike(bike));
  };

  return (
    <div>
      <div className="grid gap-4 p-4">
        <BikeSelect onChange={onBikeSelectChange} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-inherit">
          <div className="grid gap-4 p-4">
            {formFields.map((key) => (
              <FormField
                control={form.control}
                name={key}
                key={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {bikeAttributes[key].label}
                      {bikeAttributes[key].warnings && (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <AlertCircle className="h-4 w-4 text-yellow-500 cursor-help font-bold" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <ul className="list-inside list-disc text-sm">
                              {bikeAttributes[key].warnings.map(
                                (warning, idx) => (
                                  <li key={`${key}-warning-${idx}`}>
                                    {warning}
                                  </li>
                                ),
                              )}
                            </ul>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          const value =
                            event.target.value === ""
                              ? undefined
                              : Number(event.target.value);
                          field.onChange(value);
                          onSubmit(form.getValues());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full ">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
