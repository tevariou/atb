"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";

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

type BikeSelectProps = {
  onChange: (bike: BikeState) => void;
}

export default function BikeSelect({
  onChange,
}: BikeSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full"
        >
          {"Select bike..."}
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
                    key={bike.id}
                    value={bike.id}
                    onSelect={(currentValue) => {
                      onChange(bikeRegistry.find((b) => b.id === currentValue)!.geometry);
                      console.log(currentValue, bikeRegistry.find((b) => b.id === currentValue)!.geometry);
                      setOpen(false);
                    }}
                  >
                    {bike.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
