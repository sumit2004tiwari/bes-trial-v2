import { NextResponse } from "next/server";
import SpaceTypeScheme from "../../models/space_type_scheme";

interface BodyJson {
  selectedSpace: string;
  totalArea: string;
}
export async function POST(req: Request) {
  try {
    const json: BodyJson = await req.json();
    console.log({ json });
    const { selectedSpace, totalArea } = json;
    let space_sqm = Number(totalArea) || 0;
    const scheme = await SpaceTypeScheme.findOne({
      type: selectedSpace,
      is_active: true,
    }).lean();
    if (!scheme) {
      return NextResponse.json(
        { message: "Invalid space type selected", status: false },
        { status: 400 }
      );
    }

    if (
      !scheme.minimum_space_rquired &&
      scheme.minimum_space_rquired > space_sqm
    ) {
      return NextResponse.json(
        {
          message: `Minimum area required is ${scheme.minimum_space_rquired} sqm.`,
          status: false,
        },
        { status: 400 }
      );
    }
    const basePrice = scheme.price_per_sqm * space_sqm;
    return NextResponse.json(
      {
        status: true,
        basePrice: `₹${basePrice}`,
        calculatedPrice: basePrice,
        currency: "INR",
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Something went wrong", status: false },
      { status: 400 }
    );
  }
}
