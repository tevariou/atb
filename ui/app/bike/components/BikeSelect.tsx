"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import bikeRegistry from "../lib/bikeRegistry";
import type { BikeState } from "../lib/bikeSlice";

type BikeSelectProps = {
  onChange: (bike: BikeState) => void;
};

export default function BikeSelect({ onChange }: BikeSelectProps) {
  const handleValueChange = (bikeId: string) => {    
    // Find the selected bike across all brands
    for (const brandBikes of Object.values(bikeRegistry)) {
      const bike = brandBikes.find((b) => b.id === bikeId);
      if (bike) {
        onChange(bike.geometry);
        break;
      }
    }
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select bike..." />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {Object.entries(bikeRegistry).map(([brand, bikes]) => (
          <SelectGroup key={`brand-${brand}`}>
            <SelectLabel>{brand}</SelectLabel>
            {bikes.map((bike) => (
              <SelectItem key={bike.id} value={bike.id}>
                {bike.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
