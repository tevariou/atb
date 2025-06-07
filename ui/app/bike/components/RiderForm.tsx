"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { setRider, riderSelectors } from "../lib/riderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RiderState } from "../lib/riderSlice";
import { Button } from "@/components/ui/button";

export default function RiderForm() {
  const dispatch = useAppDispatch();
  const rider = useAppSelector(riderSelectors.selectRider);

  const riderAttributes = {
    inseamLength: {
      label: "Inseam (in cm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000),
    },
    upperLegLength: {
      label: "Upper leg length (in cm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000),
    },
    footLength: {
      label: "Foot length (in cm)",
      type: z.number().min(0, "Value must be at least 0").max(1000)
        .refine(
          n => !(n * 10).toString().includes("."),
          { message: "Max precision is 1 decimal place" }
        ),
    },
    armLength: {
      label: "Arm length (in cm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000),
    },
    spineLength: {
      label: "Spine length (in cm)",
      type: z.number().int().min(0, "Value must be at least 0").max(1000),
    },
  };

  const formSchema = z.object(Object.entries(riderAttributes).reduce<Record<keyof RiderState, z.ZodTypeAny>>((acc, [key, value]) => ({ ...acc, [key]: value.type }), {} as Record<keyof RiderState, z.ZodTypeAny>));
  const formFields = formSchema.keyof().options;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...rider,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    dispatch(setRider({...rider, ...values}));
  };

  return (
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
                  <FormLabel>{riderAttributes[key].label}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value && Number(event.target.value),
                        )
                      }
                      type="number"
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
  );
}
