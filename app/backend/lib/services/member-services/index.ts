import mongoConnection from "../../db/db-config";
import UserModel from "../../db/models/user-schema";
import UserProfileModel, {
  MemberProfileStatus,
} from "../../db/models/user-profile";
import MemberCategoryModel from "../../db/models/member_category";
import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";
import UserAuthService from "../auth-service/user-auth-service";

export default class MemberService {
  private auth: UserAuthService;
  constructor(avoidSettingAndResettingCookie?: boolean) {
    this.auth = new UserAuthService(!!avoidSettingAndResettingCookie);
  }

  private async getUserByEmail(email: string) {
    await mongoConnection.connect();
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      throw ErrorWithStatusCode.error404("User not found");
    }
    return user;
  }

  async getMemberCategories() {
    await mongoConnection.connect();
    return MemberCategoryModel.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select("code name description")
      .lean();
  }

  async getMyProfile(userId: string) {
    await mongoConnection.connect();
    return UserProfileModel.findOne({ userId })
      .select("-history")
      .lean();
  }

  async getProfileByEmail(email: string) {
    const user = await this.getUserByEmail(email);
    return this.getMyProfile(String(user._id));
  }

  async getProfileById(profileId: string) {
    await mongoConnection.connect();
    return UserProfileModel.findById(profileId).populate(
      "userId",
      "first_name last_name email"
    );
  }

  async submitProfile(email: string, data: any) {
    await mongoConnection.connect();
    const user = await this.getUserByEmail(email);
    const userId = String(user._id);

    const existing = await UserProfileModel.findOne({ userId });

    if (existing && existing.status === MemberProfileStatus.InProgress) {
      throw ErrorWithStatusCode.error422(
        "Your profile is already under review. You cannot submit another request until it is reviewed.",
        false,
        "member profile already in progress"
      );
    }
    if (existing && existing.status === MemberProfileStatus.Approved) {
      throw ErrorWithStatusCode.error422(
        "Your profile has already been approved and is no longer editable.",
        false,
        "member profile already approved"
      );
    }

    // membership_no must be unique across all users (case-insensitive).
    const normalizedNo = String(data.membership_no).trim().toLowerCase();
    const noOwner = await UserProfileModel.findOne({
      membership_no: normalizedNo,
      userId: { $ne: userId },
    }).lean();
    if (noOwner) {
      throw ErrorWithStatusCode.error422(
        "This membership number is already registered to another user.",
        false,
        "duplicate membership_no: " + data.membership_no
      );
    }

    const payload = {
      userId,
      membership_category: data.membership_category,
      membership_no: normalizedNo,
      mobile_no: data.mobile_no,
      designation: data.designation || "",
      organization_address: data.organization_address,
      address2: data.address2 || "",
      city: data.city,
      pin_code: data.pin_code,
      state: data.state,
      status: MemberProfileStatus.InProgress,
      rejectionMsg: null,
    };

    const historyEntry = {
      status: MemberProfileStatus.InProgress,
      createdAt: new Date(),
    };

    // Only one request allowed -> use unique userId + status guard already above.
    // If a previous request was rejected, resubmission is allowed (new request).
    const result = await UserProfileModel.findOneAndUpdate(
      { userId },
      {
        $set: payload,
        $push: { history: historyEntry as any },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return {
      profile: result,
      status: result?.status,
    };
  }

  async approveProfile(profileId: string, adminEmail: string) {
    await mongoConnection.connect();
    const updated = await UserProfileModel.findByIdAndUpdate(
      profileId,
      {
        status: MemberProfileStatus.Approved,
        rejectionMsg: null,
        $push: {
          history: {
            status: MemberProfileStatus.Approved,
            reviewedBy: adminEmail,
            createdAt: new Date(),
          } as any,
        },
      },
      { new: true }
    ).lean();
    if (!updated) {
      throw ErrorWithStatusCode.error404("Profile not found");
    }
    return updated;
  }

  async rejectProfile(
    profileId: string,
    adminEmail: string,
    rejectionMsg: string
  ) {
    await mongoConnection.connect();
    const updated = await UserProfileModel.findByIdAndUpdate(
      profileId,
      {
        status: MemberProfileStatus.Rejected,
        rejectionMsg,
        $push: {
          history: {
            status: MemberProfileStatus.Rejected,
            message: rejectionMsg,
            reviewedBy: adminEmail,
            createdAt: new Date(),
          } as any,
        },
      },
      { new: true }
    ).lean();
    if (!updated) {
      throw ErrorWithStatusCode.error404("Profile not found");
    }
    return updated;
  }

  async getAllProfilesForAdmin(status?: string) {
    await mongoConnection.connect();
    const query = status ? { status } : {};
    return UserProfileModel.find(query, { history: 0 })
      .populate("userId", "first_name last_name email")
      .sort({ updatedAt: -1 })
      .lean();
  }

  async isAdmin(writable?: boolean) {
    return this.auth.isAdmin(writable);
  }
}