"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import bikeRegistry from "../lib/bikeRegistry";
import type { BikeState } from "../lib/bikeSlice";
import { cn } from "@/lib/utils";

type BikeSelectProps = {
  onChange: (bike: BikeState) => void;
};

export default function BikeSelect({ onChange }: BikeSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedBikeId, setSelectedBikeId] = useState("");

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full"
        >
          {selectedBikeId
            ? bikeRegistry.find((bike) => bike.id === selectedBikeId)?.name
            : "Select bike..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput placeholder="Search bikes..." className="h-9" />
          <CommandList>
            <CommandEmpty>No bike found.</CommandEmpty>
            <CommandGroup>
              {bikeRegistry.map((bike) => (
                <CommandItem
                  key={`select-${bike.id}`}
                  value={bike.id}
                  onSelect={(bikeId) => {
                    onChange(
                      bikeRegistry.find((b) => b.id === bikeId)!.geometry,
                    );
                    setSelectedBikeId(bikeId === selectedBikeId ? "" : bikeId);
                    setOpen(false);
                  }}
                >
                  {bike.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedBikeId === bike.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
