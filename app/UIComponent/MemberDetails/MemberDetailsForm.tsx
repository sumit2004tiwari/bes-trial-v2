"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  memberProfileSchema,
  MemberProfileInput,
} from "@/app/_shared/validation-schema/member-profile";
import {
  getMemberCategories,
  submitMemberProfile,
} from "@/app/frontend/actions/member";
import { showSuccessToast } from "@/app/frontend/helper";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import dynamic from "next/dynamic";
import { formatPhoneWithCountry } from "@/app/admin/all-registrations/lib/format-phone";
import FormHelperText from "@mui/material/FormHelperText";

const AutoScrollPhoneInput = dynamic(
  () => import("@/app/registrationform/Form/AutoScrollPhoneInput"),
  { ssr: false }
);

interface MemberCategory {
  code: string;
  name: string;
  description?: string;
}

export default function MemberDetailsForm({
  open,
  onClose,
  onSuccess,
  initialValues,
  readOnly = false,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialValues?: Partial<MemberProfileInput>;
  readOnly?: boolean;
  title?: string;
}) {
  const [categories, setCategories] = useState<MemberCategory[]>([]);
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<MemberProfileInput | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MemberProfileInput>({
    resolver: zodResolver(memberProfileSchema),
    mode: "onChange",
    defaultValues: {
      membership_category: "",
      membership_no: "",
      mobile_no: "",
      designation: "",
      organization_address: "",
      address2: "",
      city: "",
      pin_code: "",
      state: "",
    },
  });

  useEffect(() => {
    if (open) {
      setServerError("");
      getMemberCategories()
        .then((res: any) => {
          setCategories(res?.data || []);
        })
        .catch(() => setCategories([]));
    }
  }, [open]);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: MemberProfileInput) => {
    setPending(true);
    setServerError("");
    try {
      const res: any = await submitMemberProfile(data);
      if (res?.ok === false) {
        setServerError(
          res?.errorMessage || res?.message || "Something went wrong"
        );
        return;
      }
      if (res?.status) {
        showSuccessToast(
          "Your request has been submitted successfully. Our team will get back to you shortly."
        );
        reset();
        setConfirmOpen(false);
        setPendingData(null);
        onSuccess?.();
        onClose();
      } else {
        setServerError(res?.message || "Something went wrong");
      }
    } catch (e: any) {
      setServerError(e?.message || "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {title ||
          (readOnly ? "Member Details (Approved)" : "Member Details")}
      </DialogTitle>
      <DialogContent dividers>
        {!readOnly && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please fill in your member details. Once submitted, they will be
            reviewed by the administrator.
          </Typography>
        )}
        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box
          gap={2}
          display="flex"
          flexDirection="column"
          mt={1}
        >
          <TextField
            select
            label="Membership Category"
            disabled={readOnly}
            fullWidth
            {...register("membership_category")}
            error={!!errors.membership_category}
            helperText={errors.membership_category?.message}
            defaultValue=""
          >
            <MenuItem value="" disabled>
              Select category
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.code} value={cat.code}>
                {cat.name} ({cat.code})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Membership Number"
            disabled={readOnly}
            fullWidth
            {...register("membership_no")}
            error={!!errors.membership_no}
            helperText={errors.membership_no?.message}
          />

          <Box>
            <AutoScrollPhoneInput
              value={(watch("mobile_no") || "")
                .replace(/\D/g, "")}
              onChange={(value: string) =>
                setValue("mobile_no", `+${value}`, { shouldValidate: true })
              }
              disabled={readOnly}
              enableSearch
              searchPlaceholder="Search country by name or code"
              containerClass={errors.mobile_no ? "phone-input-error" : ""}
              inputProps={{
                name: "mobile_no",
                placeholder: "Mobile Number",
              }}
            />
            {errors.mobile_no && (
              <FormHelperText error>{errors.mobile_no?.message}</FormHelperText>
            )}
          </Box>

          <TextField
            label="Designation (optional)"
            disabled={readOnly}
            fullWidth
            {...register("designation")}
          />

          <TextField
            label="Organization Address"
            disabled={readOnly}
            fullWidth
            multiline
            rows={2}
            {...register("organization_address")}
            error={!!errors.organization_address}
            helperText={errors.organization_address?.message}
          />

          <TextField
            label="Address 2 (optional)"
            disabled={readOnly}
            fullWidth
            {...register("address2")}
          />

          <Box display="flex" gap={2}>
            <TextField
              label="City"
              disabled={readOnly}
              fullWidth
              {...register("city")}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
            <TextField
              label="State"
              disabled={readOnly}
              fullWidth
              {...register("state")}
              error={!!errors.state}
              helperText={errors.state?.message}
            />
          </Box>

          <TextField
            label="Pin Code"
            disabled={readOnly}
            fullWidth
            {...register("pin_code")}
            error={!!errors.pin_code}
            helperText={errors.pin_code?.message}
          />
        </Box>
      </DialogContent>
      {readOnly ? (
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={pending}
            onClick={handleSubmit((data) => {
              setPendingData(data);
              setConfirmOpen(true);
            })}
          >
            {pending ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              "Submit for Approval"
            )}
          </Button>
        </DialogActions>
      )}

      <Dialog
        open={confirmOpen && !readOnly}
        onClose={() => !pending && setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 1.5,
            }}
          >
            <FactCheckOutlinedIcon fontSize="large" />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Confirm Submission
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Please double-check your details before submitting. Once submitted,
            you won&apos;t be able to modify them.
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1}>
            <SummaryRow label="Category" value={pendingData?.membership_category} />
            <SummaryRow label="Membership No" value={pendingData?.membership_no} />
            <SummaryRow label="Mobile No" value={formatPhoneWithCountry(pendingData?.mobile_no)} />
            <SummaryRow label="Designation" value={pendingData?.designation || "—"} />
            <SummaryRow
              label="Organization Address"
              value={pendingData?.organization_address}
            />
            <SummaryRow label="Address 2" value={pendingData?.address2 || "—"} />
            <SummaryRow label="City" value={pendingData?.city} />
            <SummaryRow label="State" value={pendingData?.state} />
            <SummaryRow label="Pin Code" value={pendingData?.pin_code} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={pending}
            fullWidth
            variant="outlined"
          >
            Edit Details
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={pending}
            onClick={() => onSubmit(pendingData as MemberProfileInput)}
          >
            {pending ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              "Confirm & Submit"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <>
    <Stack direction="row" justifyContent="space-between" gap={2}>
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{ textAlign: "right", wordBreak: "break-word" }}
      >
        {value || "—"}
      </Typography>
    </Stack>
    <Divider sx={{ borderColor: "divider" }} />
  </>
);