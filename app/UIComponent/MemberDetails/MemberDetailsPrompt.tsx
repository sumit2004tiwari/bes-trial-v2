"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useAuthContext } from "../context-provider/auth-provider";
import { getMyMemberProfile } from "@/app/frontend/actions/member";
import MemberDetailsForm from "./MemberDetailsForm";

type ProfileStatus = "in_progress" | "approved" | "rejected" | null;

export default function MemberDetailsPrompt() {
  const { userData, isSignIn } = useAuthContext();
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>(null);
  const [rejectionMsg, setRejectionMsg] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const isRegular = isSignIn && userData?.role !== "admin";

  const loadProfile = useCallback(async () => {
    if (!isRegular) return;
    try {
      const res: any = await getMyMemberProfile();
      if (res?.status && res?.data) {
        setProfileStatus(res.data.status || null);
        setRejectionMsg(res.data.rejectionMsg || "");
        setProfile(res.data.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProfileLoaded(true);
    }
  }, [isRegular]);

  useEffect(() => {
    setProfileLoaded(false);
    loadProfile();
  }, [loadProfile]);

  // Show popup for regular users who have no profile or were rejected.
  useEffect(() => {
    if (!isRegular || !profileLoaded) {
      setShowPrompt(false);
      return;
    }
    if (profileStatus === null || profileStatus === "rejected") {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [profileStatus, isRegular, profileLoaded]);

  const onSubmitted = () => {
    loadProfile();
  };

  const readOnly = profileStatus === "approved";

  return (
    <>
      <Dialog open={showPrompt}>
        <DialogTitle>
          {profileStatus === "rejected"
            ? "Member Details Rejected"
            : "Member Details Required"}
        </DialogTitle>
        <DialogContent>
          {profileStatus === "rejected" && rejectionMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Rejection reason: {rejectionMsg}
            </Alert>
          )}
          <Typography variant="body1">
            Please fill in your member details. Your request will be reviewed
            by the administrator.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrompt(false)}>Later</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowPrompt(false);
              setShowForm(true);
            }}
          >
            Fill Member Details
          </Button>
        </DialogActions>
      </Dialog>

      <MemberDetailsForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={onSubmitted}
        readOnly={readOnly}
        initialValues={
          profile
            ? {
                membership_category: profile.membership_category,
                membership_no: profile.membership_no,
                mobile_no: profile.mobile_no,
                designation: profile.designation,
                organization_address: profile.organization_address,
                address2: profile.address2,
                city: profile.city,
                pin_code: profile.pin_code,
                state: profile.state,
              }
            : undefined
        }
      />
    </>
  );
}