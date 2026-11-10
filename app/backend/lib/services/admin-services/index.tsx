import VisitorServices from "../visitor-serives";
import UserAuthService from "../auth-service/user-auth-service";
import DelegateServices from "../delegate-services";
import MySpaceServices from "../my-space-srvices";
import AllRegistrationTypeServices from "../all-registration-type-service";
import MemberService from "../member-services";
import ErrorWithStatusCode from "../../../../_shared/custom-error/error-with-status-code";
import { RegistrationServiceType } from "../../db/models/all_registration_services.model";

export default class AdminServices {
  private visitor: VisitorServices;
  private auth: UserAuthService;
  private delegate: DelegateServices;
  private mySpaces: MySpaceServices;
  private registrationServices: AllRegistrationTypeServices;
  private member: MemberService;
  private avoidSettingAndResettingCookie: boolean;
  constructor(avoidSettingAndResettingCookie?: boolean) {
    this.visitor = new VisitorServices();
    this.auth = new UserAuthService(!!avoidSettingAndResettingCookie);
    this.delegate = new DelegateServices();
    this.mySpaces = new MySpaceServices();
    this.registrationServices = new AllRegistrationTypeServices();
    this.member = new MemberService(!!avoidSettingAndResettingCookie);
    this.avoidSettingAndResettingCookie = !!avoidSettingAndResettingCookie;
  }

  async getAllVisitorDetails() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.visitor.allVisitors();
  }

  async getMySpaceRegistrations() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.mySpaces.getAllRegistrations();
  }
  async getAllDelegateUsers() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.delegate.allRegistrations();
  }
  async getAllRegistrationServices() {
    const isAmin = await this.auth.isAdmin();

    if (!isAmin) return [];

    return await this.registrationServices.getAllServices();
  }
  async activateOrDeactivateRegistrationService(
    serviceName: string,
    status: boolean
  ) {
    const isAmin = await this.auth.isAdmin(true);
    if (!isAmin) {
      throw ErrorWithStatusCode.error401(
        "You are not authorized",
        false,
        "not ad amin"
      );
    }
    return await this.registrationServices.activateOrDeactivateService(
      serviceName as RegistrationServiceType,
      status
    );
  }

  async getAllMemberProfilesForReview() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) return null;
    return await this.member.getAllProfilesForAdmin();
  }
}
