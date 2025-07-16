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
import { AlertCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function RiderForm() {
  const dispatch = useAppDispatch();
  const rider = useAppSelector(riderSelectors.selectRider);

  const riderAttributes: Record<
    keyof RiderState,
    { label: string; type: z.ZodTypeAny; warnings?: string[] }
  > = {
    inseamLength: {
      label: "Inseam (in cm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(200, {
          message: "Value must be less than 200",
        })
        .nullable(),
      warnings: ["This is your inseam length wearing shoes"],
    },
    upperLegLength: {
      label: "Upper leg length (in cm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(100, {
          message: "Value must be less than 100",
        })
        .nullable(),
    },
    footLength: {
      label: "Shoe length (in cm)",
      type: z
        .number()
        .min(0, "Value must be at least 0")
        .max(100, {
          message: "Value must be less than 100",
        })
        .refine((n) => !(n * 10).toString().includes("."), {
          message: "Max precision is 1 decimal place",
        })
        .nullable(),
    },
    armLength: {
      label: "Arm length (in cm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(200, {
          message: "Value must be less than 200",
        })
        .nullable(),
    },
    spineLength: {
      label: "Spine length (in cm)",
      type: z
        .number()
        .int()
        .min(0, "Value must be at least 0")
        .max(200, {
          message: "Value must be less than 200",
        })
        .nullable(),
    },
  };

  const formSchema = z.object(
    Object.entries(riderAttributes).reduce<
      Record<keyof RiderState, z.ZodTypeAny>
    >(
      (acc, [key, value]) => ({ ...acc, [key]: value.type }),
      {} as Record<keyof RiderState, z.ZodTypeAny>,
    ),
  );
  const formFields = formSchema.keyof().options;

  const defaultValues = {
    ...Object.fromEntries(
      Object.entries(rider).map(([key, value]) => [
        key,
        value === 0 ? null : value,
      ]),
    ),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedRider = {
      ...rider,
      ...Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === null ? 0 : value,
        ]),
      ),
    };
    dispatch(setRider(updatedRider));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-inherit">
        <div className="grid gap-6 p-4">
          {formFields.map((key) => (
            <FormField
              control={form.control}
              name={key}
              key={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {riderAttributes[key].label}
                    {riderAttributes[key].warnings && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <AlertCircle className="h-4 w-4 text-yellow-500 cursor-help font-bold" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <ul className="list-inside list-disc text-sm">
                            {riderAttributes[key].warnings.map(
                              (warning, idx) => (
                                <li key={`${key}-warning-${idx}`}>{warning}</li>
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
                      onChange={(event) => {
                        const value =
                          event.target.value === ""
                            ? null
                            : Number(event.target.value);
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                      type="number"
                      placeholder="0"
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
