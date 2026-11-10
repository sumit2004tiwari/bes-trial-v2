import {
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Logout, Person } from "@mui/icons-material";
import { getMyMemberProfile } from "@/app/frontend/actions/member";
import MemberDetailsForm from "../MemberDetails/MemberDetailsForm";

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  onLogout: () => void;
}

const statusMeta: Record<string, { label: string; color: any }> = {
  in_progress: { label: "Under Review", color: "warning" },
  approved: { label: "Approved", color: "success" },
  rejected: { label: "Rejected", color: "error" },
};

export default function UserDrawer({
  open,
  onClose,
  userName,
  userEmail,
  onLogout,
}: UserDrawerProps) {
  const [profile, setProfile] = useState<any>(null);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const res: any = await getMyMemberProfile();
      if (res?.status && res?.data) {
        setProfile(res.data.profile);
        setProfileStatus(res.data.status || null);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (open) loadProfile();
  }, [open, loadProfile]);

  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  const chip = profileStatus ? statusMeta[profileStatus] : null;

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor={"right"}
        sx={{ zIndex: 99999999999, maxWidth: "100%" }}
      >
        <Box
          sx={{ width: { sm: 350, xs: "100%" }, maxWidth: "100%" }}
          role="presentation"
        >
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}>
              {userName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
              {userName?.toLowerCase()}
            </Typography>
            {userEmail && (
              <Typography variant="body2" color="text.secondary">
                {userEmail}
              </Typography>
            )}
            {chip && (
              <Box sx={{ mt: 1 }}>
                <Chip
                  size="small"
                  color={chip.color}
                  label={chip.label}
                />
              </Box>
            )}
          </Box>

          <Divider />

          <List sx={{ pt: 1 }}>
            <ListItemButton
              onClick={() => {
                setShowForm(true);
                onClose();
              }}
            >
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText
                primary="Member Details"
                secondary={
                  profileStatus === "in_progress"
                    ? "Your request is under review"
                    : profileStatus === "approved"
                    ? "Approved (read only)"
                    : profileStatus === "rejected"
                    ? "Rejected - please update & resubmit"
                    : "Fill your member details"
                }
              />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <MemberDetailsForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={loadProfile}
        title={
          profileStatus === "in_progress"
            ? "Member Details (Under Review)"
            : profileStatus === "approved"
            ? "Member Details (Approved)"
            : undefined
        }
        readOnly={
          profileStatus === "approved" || profileStatus === "in_progress"
        }
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