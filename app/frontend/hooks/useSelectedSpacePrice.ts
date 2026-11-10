import { SpaceType } from "@/app/event_conference/bes_expo/exibition/participation_fee/types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
interface SelectedSpaceProps {
  totalArea: number;
  selectedSpace: SpaceType["type"];
  delay: number;
  isEnabled: boolean;
}
export default function useSelectedSpacePrice({
  totalArea,
  selectedSpace,
  delay = 100,
  isEnabled = false,
}: SelectedSpaceProps) {
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const delayRef = useRef(null);
  const fetchData = async (totalArea, selectedSpace) => {
    try {
      const res = await axios.post("/backend/api/get-price-by-area", {
        selectedSpace,
        totalArea,
      });
      setCalculatedPrice(res?.data?.basePrice || 0);
    } catch (e) {
      console.log("something went wrong");
      setCalculatedPrice(0);
    }
  };
  useEffect(() => {
    if (totalArea && selectedSpace && isEnabled) {
      clearTimeout(delayRef.current);
      delayRef.current = setTimeout(() => {
        fetchData(totalArea, selectedSpace);
      }, delay);
    }
    return () => {
      clearTimeout(delayRef.current);
    };
  }, [totalArea, selectedSpace, isEnabled]);
  return { calculatedBasePrice: calculatedPrice };
}
