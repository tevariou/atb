"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setBike, bikeSelectors } from "../lib/bikeSlice";
import { setShadowBike, shadowBikeSelectors } from "../lib/shadowBikeSlice";
import type { BikeState } from "../lib/bikeSlice";
import BikeSelect from "./BikeSelect";
import { Button } from "@/components/ui/button";


type BikeFormProps = {  isShadow?: boolean; };

export default function BikeForm({ isShadow = false }: BikeFormProps) {
  const dispatch = useAppDispatch();
  const bike = useAppSelector(isShadow ? shadowBikeSelectors.selectShadowBike : bikeSelectors.selectBike);

  const bikeAttributes: Record<keyof BikeState, { label: string; type: z.ZodTypeAny }> = {
    reach: {
      label: "Reach (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    stack: {
      label: "Stack (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    headTube: {
      label: "Headtube length (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    headTubeAngle: {
      label: "Headtube angle (degrees)",
      type: z.number().min(0, "Angle must be at least 0 degrees").max(89, "Angle must be less than 90 degrees")
        .refine(n => !(n * 100).toString().includes("."), { message: "Max precision is 2 decimal places" }),
    },
    chainStay: {
      label: "Chainstay length (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    actualSeatTubeAngle: {
      label: "Actual seat tube angle (degrees)",
      type: z.number().min(0, "Angle must be at least 0 degrees").max(89, "Angle must be less than 90 degrees")
        .refine(n => !(n * 100).toString().includes("."), { message: "Max precision is 2 decimal places" }),
    },
    effectiveSeatTubeAngle: {
      label: "Effective seat tube angle (degrees)",
      type: z.number().min(0, "Angle must be at least 0 degrees").max(89, "Angle must be less than 90 degrees")
        .refine(n => !(n * 100).toString().includes("."), { message: "Max precision is 2 decimal places" }),
    },
    seatTube: {
      label: "Seat tube length (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    bottomBracketDrop: {
      label: "Bottom bracket drop (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    frontCenter: {
      label: "Front center (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    wheelBase: {
      label: "Wheelbase (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    forkAxleToCrown: {
      label: "Fork axle to crown (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    forkOffset: {
      label: "Fork offset (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    forkTravel: {
      label: "Fork travel (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    crankLength: {
      label: "Crank length (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    crankQFactor: {
      label: "Crank Q factor (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    spacers: {
      label: "Spacers height (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    externalHeadsetUpperCupStackHeight: {
      label: "External headset upper cup stack height (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    externalHeadsetLowerCupStackHeight: {
      label: "External headset lower cup stack height (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    stemLength: {
      label: "Stem length (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    stemAngle: {
      label: "Stem angle (degrees)",
      type: z.number().int().min(-89, "Angle must be at least -90 degrees").max(89, "Angle must be less than 90 degrees"),
    },
    stemSteererHeight: {
      label: "Stem steerer height (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    seatOffset: {
      label: "Seat offset (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    handlebarWidth: {
      label: "Handlebar width (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    handlebarReach: {
      label: "Handlebar reach (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    handlebarRise: {
      label: "Handlebar rise (mm)",
      type: z.number().int().min(-100, "Handlebar rise must be at least -100mm").max(100, "Handlebar rise must be at most 100mm")
    },
    tireFrontWidth: {
      label: "Front tire width (mm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    tireRearWidth: {
      label: "Rear tire width",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    wheelFrontDiameter: {
      label: "Front wheel diameter",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
    wheelRearDiameter: {
      label: "Rear wheel diameter",
      type: z.number().int().min(0, "Value must be at least 0").max(1000, "Value must be at most 1000")
    },
  };

  const formSchema = z.object(Object.entries(bikeAttributes).reduce<Record<keyof BikeState, z.ZodTypeAny>>((acc, [key, value]) => ({ ...acc, [key]: value.type }), {} as Record<keyof BikeState, z.ZodTypeAny>));
  const formFields = formSchema.keyof().options;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...bike
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updatedBike = { ...bike, ...values };
    dispatch(isShadow ? setShadowBike(updatedBike) : setBike(updatedBike));
  };

  const debouncedSave = useDebouncedCallback(onSubmit, 1000);

  const onChange = (bike: BikeState) => {
    form.reset(bike);
  };

  return (
    <div>
      <div className="grid gap-4 p-4">
        <BikeSelect onChange={onChange} />
      </div>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          onBlur={() => debouncedSave(form.getValues())}
          className="bg-inherit"
        >
          <div className="grid gap-4 p-4">
          {formFields.map((key) => (
              <FormField
                control={form.control}
                name={key}
                key={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{bikeAttributes[key].label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(event) =>
                          field.onChange(
                            event.target.value && Number(event.target.value),
                          )
                        }
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
