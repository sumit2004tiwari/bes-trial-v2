"use client";

import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ImageOption {
  name: string;
  value: string | number;
}

interface SelectBoxProps {
  allImagePath: ImageOption[];
  selectedValue?: ImageOption;
}

export default function SelectBox({
  allImagePath,
  selectedValue,
}: SelectBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentValue =
    searchParams.get("selectedValue") || selectedValue?.value || "";

  const [state, setState] = useState<string | number>(currentValue);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setState(value);

    // Update URL with query param
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedValue", value);

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Sync state with URL if user navigates back/forward
  useEffect(() => {
    setState(searchParams.get("selectedValue") || selectedValue?.value || "");
  }, [searchParams, selectedValue]);

  return (
    <div className="gallery-filter">
      <label id="gallery-year-label">Event year</label>
      <FormControl className="flex-1" fullWidth>
        <Select labelId="gallery-year-label" value={state} onChange={handleChange} name="selectedValue">
          {allImagePath.map((image, index) => (
            <MenuItem value={image.value} key={index}>
              {image.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
