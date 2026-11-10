import mongoConnection from "../../db/db-config";
import { frontendDemoEnabled } from "@/config/frontend-demo.cjs";
import AllRegistrationServiceTypeModel, {
  RegistrationServiceType,
} from "../../db/models/all_registration_services.model";

export default class AllRegistrationTypeServices {
  async getServiceByName(serviceName: RegistrationServiceType) {
    if (frontendDemoEnabled) return null;
    try {
      await mongoConnection.connect();
      const service = AllRegistrationServiceTypeModel.findOne({
        service_name: serviceName,
      });
      if (!service) console.log("invalid service or service not found...");

      return service;
    } catch (e) {
      console.log("error in getting services", e?.message);
    }
  }
  async checkIsServiceActiveByName(
    service: RegistrationServiceType
  ): Promise<boolean> {
    const result = await this.getServiceByName(service);

    return !!result?.isActive;
  }

  async getAllRunningServices() {
    if (frontendDemoEnabled) return [];
    try {
      await mongoConnection.connect();
      const result = await AllRegistrationServiceTypeModel.find(
        { isActive: true },
        { name: 1, service_name: 1, _id: 0, description: 1, isActive: 1 }
      ).lean();

      return result || [];
    } catch (e) {
      console.log("Error in running Services", e?.message);
      return [];
    }
  }
  async getAllServices() {
    if (frontendDemoEnabled) return [];
    try {
      await mongoConnection.connect();
      const result = await AllRegistrationServiceTypeModel.find(
        {},
        { name: 1, service_name: 1, _id: 0, description: 1, isActive: 1 }
      ).lean();

      return result || [];
    } catch (e) {
      console.log("error in getting all services", e?.message);
      return [];
    }
  }
  async activateOrDeactivateService(
    service_name: RegistrationServiceType,
    status: boolean
  ): Promise<boolean> {
    try {
      await mongoConnection.connect();
      const services = await AllRegistrationServiceTypeModel.findOneAndUpdate(
        { service_name },
        { isActive: status }
      );
      return !!services;
    } catch (e) {
      console.log("error in activating or deactivating service", e?.message);
    }
  }
}
