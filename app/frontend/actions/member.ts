import { fetchApiHub } from "./index";

export const getMemberCategories = () => {
  return fetchApiHub("/backend/api/member/categories", "GET");
};

export const getMyMemberProfile = () => {
  return fetchApiHub("/backend/api/member/profile", "GET");
};

export const submitMemberProfile = (payload: any) => {
  return fetchApiHub("/backend/api/member/profile", "POST", payload);
};

export const getAllMemberProfiles = () => {
  return fetchApiHub("/backend/api/member/admin/all-profiles", "GET");
};

export const approveMemberProfile = (profileId: any) => {
  return fetchApiHub("/backend/api/member/admin/approve", "POST", {
    profileId,
  });
};

export const rejectMemberProfile = (profileId: any, message: string) => {
  return fetchApiHub("/backend/api/member/admin/reject", "POST", {
    profileId,
    message,
  });
};