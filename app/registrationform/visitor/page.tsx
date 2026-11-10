import React from "react";
import visitorDb from "./Utility/db.json";
import Form from "../Form/Form";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import styles from "../Form/form.module.css";
import { REGISTRATION_PATH } from "@/app/Utility/_shared/Constant";
import AllRegistrationTypeServices from "@/app/backend/lib/services/all-registration-type-service";

import UnavailableServiceMessage from "@/app/UIComponent/common-ui/unavailable-service/unavailable-service-msg";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
export const revalidate = 14400; // cached for four hour
export default async function page() {
  const allServices = new AllRegistrationTypeServices();
  const isActive = await allServices.checkIsServiceActiveByName(
    RegistrationServiceType.VISITOR_REGISTRATIONS,
  );
  if (!isActive) return <UnavailableServiceMessage />;
  return (
<Box
        sx={{
          minHeight: "100vh",
          bg: "#E7EDF3",
          py: { xs: 5, md: 8 },
          px: 2,
        }}
      >
      <Container maxWidth="sm" disableGutters>
        <div className={styles.container}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={{ xs: 1.5, sm: 2 }}
            mb={3}
          >
            <Button
              component="a"
              href="/registrationform/e-badges/download-badge"
              variant="outlined"
              startIcon={<BadgeOutlinedIcon />}
              sx={{
                order: { xs: 0, sm: 1 },
                textTransform: "none",
                fontWeight: 600,
                color: "#334155",
                borderColor: "#CBD5E1",
                borderRadius: "10px",
                px: 2,
                whiteSpace: "nowrap",
                "&:hover": { borderColor: "#2563EB", color: "#2563EB" },
              }}
            >
              Download Badge
            </Button>
            <Box sx={{ order: { xs: 1, sm: 0 } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#0B1220",
                  letterSpacing: "-0.02em",
                }}
              >
                Visitor Registration
              </Typography>
              <Typography sx={{ color: "#64748B", fontSize: 14, mt: 0.5 }}>
                Register to receive your official event badge.
              </Typography>
            </Box>
          </Stack>
          <Form
            db={visitorDb}
            apiLink={"/backend/api/registration/visitor_registration"}
            request={"POST"}
            currentPath={REGISTRATION_PATH.visitor}
          />
        </div>
      </Container>
    </Box>
  );
}