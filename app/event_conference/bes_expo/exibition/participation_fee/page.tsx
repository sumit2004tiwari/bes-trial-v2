import React from "react";

import FeeDetails from "./FeeDetails";
import BookYourSpace from "./BookYourSpace";
import { CountryDataApiReponse } from "./types";

import SpaceTypeScheme from "@/app/backend/models/space_type_scheme";
import mongoConnection from "@/app/backend/lib/db/db-config";
import db from "@/app/country/db.json";
import AllRegistrationTypeServices from "@/app/backend/lib/services/all-registration-type-service";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
export const revalidate = 14400; // 4 hours in seconds (4 * 60 * 60)
export default async function page() {
  let countryData: string[] = [];
  let spaceTypesData = [];
  const allServices = new AllRegistrationTypeServices();
  const isActive = await allServices.checkIsServiceActiveByName(
    RegistrationServiceType.MY_SPACE
  );
  try {
    await mongoConnection.connect();
    let data: any = db || [];

    const responseData: CountryDataApiReponse[] = data;
    responseData?.forEach((element: CountryDataApiReponse) => {
      if (element?.name?.common) countryData.push(element?.name?.common);
    });
    countryData.sort();
  } catch (e) {
    console.log("error");
  }
  try {
    spaceTypesData = await SpaceTypeScheme.find(
      { is_active: true },
      { type: 1, _id: 0, name: 1, description: 1, minimum_space_rquired: 1 }
    ).lean();
  } catch (e) {
    console.log("error while fetch space");
  }

  return (
    <div>
      {!!isActive && (
        <BookYourSpace
          countryData={countryData}
          spaceTypes={spaceTypesData}
          currentPath="bookMySpace"
        />
      )}
      <FeeDetails />
    </div>
  );
}
