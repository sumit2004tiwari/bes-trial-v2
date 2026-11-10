"use client";
import React, { Fragment, useState } from "react";
import {
  Box,
  Button as MuiButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  FormControl,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  approveMemberProfile,
  rejectMemberProfile,
} from "@/app/frontend/actions/member";
import { handleApiRequestWithToast } from "@/app/frontend/helper";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { formatPhoneWithCountry } from "../../lib/format-phone";

interface ProfileUser {
  first_name: string;
  last_name: string;
  email: string;
}

interface Profile {
  _id: string;
  userId: ProfileUser | null;
  membership_category: string;
  membership_no: string;
  mobile_no: string;
  designation: string;
  organization_address: string;
  address2: string;
  city: string;
  pin_code: string;
  state: string;
  status: "in_progress" | "approved" | "rejected";
  rejectionMsg: string;
  updatedAt: string;
}

const statusColor: Record<string, "warning" | "success" | "error"> = {
  in_progress: "warning",
  approved: "success",
  rejected: "error",
};

function StatusChip({ status }: { status: Profile["status"] }) {
  return (
    <Chip
      size="small"
      color={statusColor[status] || "default"}
      label={status}
    />
  );
}

function ActionButtons({
  status,
  busy,
  onView,
  onApprove,
  onReject,
}: {
  status: Profile["status"];
  busy: boolean;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
      <MuiButton size="small" variant="outlined" onClick={onView}>
        View Details
      </MuiButton>
      {status === "in_progress" && (
        <>
          <MuiButton
            size="small"
            variant="contained"
            disabled={busy}
            onClick={onApprove}
          >
            Approve
          </MuiButton>
          <MuiButton
            size="small"
            variant="outlined"
            color="error"
            disabled={busy}
            onClick={onReject}
          >
            Reject
          </MuiButton>
        </>
      )}
    </Box>
  );
}

function ProfileDetailsDialog({
  profile,
  busy,
  onClose,
  onApprove,
  onReject,
}: {
  profile: Profile | null;
  busy: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const user = profile?.userId || null;
  const rows: Array<{ label: string; value: string }> = profile
    ? [
        { label: "First Name", value: user?.first_name || "—" },
        { label: "Last Name", value: user?.last_name || "—" },
        { label: "Email", value: user?.email || "—" },
        { label: "Membership Category", value: profile.membership_category },
        { label: "Membership No", value: profile.membership_no },
        { label: "Mobile No", value: formatPhoneWithCountry(profile.mobile_no) },
        { label: "Designation", value: profile.designation || "—" },
        {
          label: "Organization Address",
          value: profile.organization_address || "—",
        },
        { label: "Address 2", value: profile.address2 || "—" },
        { label: "City", value: profile.city },
        { label: "Pin Code", value: profile.pin_code },
        { label: "State", value: profile.state },
        { label: "Status", value: profile.status || "—" },
        { label: "Rejection Reason", value: profile.rejectionMsg || "—" },
        {
          label: "Last Updated",
          value: profile.updatedAt
            ? new Date(profile.updatedAt).toLocaleString()
            : "—",
        },
      ]
    : [];

  return (
    <Dialog
      open={!!profile}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="profile-details-title"
    >
      <DialogTitle
        id="profile-details-title"
        sx={{ position: "relative", pr: 6 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <span>Profile Details</span>
          {profile && <StatusChip status={profile.status} />}
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
            gap: "10px 16px",
          }}
        >
          {rows.map((row) => (
            <Fragment key={row.label}>
              <Typography variant="body2" color="text.secondary">
                {row.label}:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-word",
                  color:
                    row.label === "Rejection Reason" && profile?.rejectionMsg
                      ? "error.main"
                      : "inherit",
                }}
              >
                {row.value}
              </Typography>
            </Fragment>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={onClose}>Close</MuiButton>
        {profile?.status === "in_progress" && (
          <>
            <MuiButton
              color="error"
              variant="outlined"
              disabled={busy}
              onClick={onReject}
            >
              Reject
            </MuiButton>
            <MuiButton
              variant="contained"
              disabled={busy}
              onClick={onApprove}
            >
              Approve
            </MuiButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

const FieldGrid = ({
  p,
  user,
}: {
  p: Profile;
  user: ProfileUser | null;
}) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 12px" }}>
    <Typography variant="body2" color="text.secondary">
      Name:
    </Typography>
    <Typography variant="body2">
      {user?.first_name} {user?.last_name}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Email:
    </Typography>
    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
      {user?.email}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Category:
    </Typography>
    <Typography variant="body2">{p.membership_category}</Typography>
    <Typography variant="body2" color="text.secondary">
      Membership No:
    </Typography>
    <Typography variant="body2">{p.membership_no}</Typography>
    <Typography variant="body2" color="text.secondary">
      Mobile:
    </Typography>
    <Typography variant="body2">{formatPhoneWithCountry(p.mobile_no)}</Typography>
    <Typography variant="body2" color="text.secondary">
      City:
    </Typography>
    <Typography variant="body2">{p.city}</Typography>
    <Typography variant="body2" color="text.secondary">
      Organization:
    </Typography>
    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
      {p.organization_address}
    </Typography>
  </Box>
);

const statusFilters = ["in_progress", "approved", "rejected", "all"] as const;

export default function MemberApprovalUI({ db }: { db: Profile[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [profiles, setProfiles] = useState(db);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [detailsProfile, setDetailsProfile] = useState<Profile | null>(null);
  const [rejectMsg, setRejectMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilter)[number]>(
    "in_progress"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfiles = (
    statusFilter === "all"
      ? profiles
      : profiles.filter((p) => p.status === statusFilter)
  ).filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const user = p?.userId;
    return (
      `${user?.first_name} ${user?.last_name}`.toLowerCase().includes(term) ||
      user?.email?.toLowerCase().includes(term) ||
      p.membership_no?.toLowerCase().includes(term) ||
      p.membership_category?.toLowerCase().includes(term) ||
      p.mobile_no?.toLowerCase().includes(term) ||
      p.organization_address?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term)
    );
  });

  const refreshRow = (updated: any) => {
    if (updated?._id) {
      setProfiles((prev) =>
        prev.map((p) =>
          p._id === updated._id
            ? { ...p, status: updated.status, rejectionMsg: updated.rejectionMsg }
            : p
        )
      );
    }
  };

  const handleApprove = async (profile: Profile) => {
    setBusy(true);
    try {
      const res = await handleApiRequestWithToast(
        approveMemberProfile(profile._id),
        "Profile Approved"
      );
      if (res?.ok === false) return;
      refreshRow(res?.data);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectMsg.trim()) return;
    setBusy(true);
    try {
      const res = await handleApiRequestWithToast(
        rejectMemberProfile(selected._id, rejectMsg.trim()),
        "Profile Rejected"
      );
      if (res?.ok === false) return;
      refreshRow(res?.data);
      setSelected(null);
      setRejectMsg("");
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ p: 2, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h5">
          Member Profile Approvals ({filteredProfiles.length})
        </Typography>
        {isMobile ? (
          <FormControl size="small" fullWidth sx={{ maxWidth: "100%", mt: 0.5 }}>
            <Select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as (typeof statusFilter)[number])
              }
              sx={{
                textTransform: "capitalize",
                minWidth: 200,
                minHeight: 40,
                fontSize: "0.9rem",
              }}
            >
              {statusFilters.map((filter) => (
                <MenuItem key={filter} value={filter} sx={{ textTransform: "capitalize" }}>
                  {filter === "all"
                    ? "All"
                    : `${filter} (${profiles.filter((p) => p.status === filter).length})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Box
            sx={{
              maxWidth: "100%",
              overflowX: "auto",
              minWidth: 0,
              pb: 0.5,
            }}
          >
            <ToggleButtonGroup
              size="small"
              exclusive
              value={statusFilter}
              onChange={(e, value) => value && setStatusFilter(value)}
              sx={{
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                minHeight: 40,
              }}
            >
              {statusFilters.map((filter) => (
                <ToggleButton key={filter} value={filter}>
                  {filter === "all" ? "All" : `${filter} (${profiles.filter((p) => p.status === filter).length})`}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name, email, membership no, mobile..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {filteredProfiles.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No member profiles found
              </Typography>
            </Paper>
          ) : (
            filteredProfiles.map((p) => {
              const user: ProfileUser | null = p?.userId || null;
              return (
                <Paper key={p._id} sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {user?.first_name} {user?.last_name}
                    </Typography>
                    <StatusChip status={p.status} />
                  </Box>
                  <FieldGrid p={p} user={user} />
                  {p.status === "rejected" && p.rejectionMsg && (
                    <Typography
                      variant="body2"
                      color="error.main"
                      sx={{ mt: 1.5, wordBreak: "break-word" }}
                    >
                      Reason: {p.rejectionMsg}
                    </Typography>
                  )}
                  <Divider sx={{ my: 1.5 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    <ActionButtons
                      status={p.status}
                      busy={busy}
                      onView={() => setDetailsProfile(p)}
                      onApprove={() => handleApprove(p)}
                      onReject={() => setSelected(p)}
                    />
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                {[
                  "Name",
                  "Email",
                  "Category",
                  "Membership No",
                  "Mobile",
                  "Organization",
                  "City",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <TableCell key={h} align="center">
                    <strong>{h}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProfiles.map((p) => {
                const user: ProfileUser | null = p?.userId || null;
                return (
                  <TableRow key={p._id} hover>
                    <TableCell align="center">
                      {user?.first_name} {user?.last_name}
                    </TableCell>
                    <TableCell align="center">{user?.email}</TableCell>
                    <TableCell align="center">{p.membership_category}</TableCell>
                    <TableCell align="center">{p.membership_no}</TableCell>
                    <TableCell align="center">
                      {formatPhoneWithCountry(p.mobile_no)}
                    </TableCell>
                    <TableCell align="center">{p.organization_address}</TableCell>
                    <TableCell align="center">{p.city}</TableCell>
                    <TableCell align="center">
                      <StatusChip status={p.status} />
                    </TableCell>
                    <TableCell align="center">
                      <ActionButtons
                        status={p.status}
                        busy={busy}
                        onView={() => setDetailsProfile(p)}
                        onApprove={() => handleApprove(p)}
                        onReject={() => setSelected(p)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredProfiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No member profiles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

<Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Reject Profile</span>
            <IconButton
              size="small"
              onClick={() => setSelected(null)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {selected?.userId?.first_name} {selected?.userId?.last_name} (
            {selected?.userId?.email})
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Message"
            fullWidth
            multiline
            rows={3}
            value={rejectMsg}
            onChange={(e) => setRejectMsg(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setSelected(null)}>Cancel</MuiButton>
          <MuiButton
            color="error"
            disabled={!rejectMsg.trim() || busy}
            onClick={handleReject}
          >
            Reject
          </MuiButton>
        </DialogActions>
      </Dialog>

      <ProfileDetailsDialog
        profile={detailsProfile}
        busy={busy}
        onClose={() => setDetailsProfile(null)}
        onApprove={() => detailsProfile && handleApprove(detailsProfile)}
        onReject={() => {
          if (detailsProfile) {
            setSelected(detailsProfile);
            setDetailsProfile(null);
          }
        }}
      />
    </Box>
  );
}