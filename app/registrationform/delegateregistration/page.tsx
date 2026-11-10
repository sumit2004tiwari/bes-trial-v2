import visitorDb from "./Utility/db.json";
import Form from "../Form/Form";
import styles from "../Form/form.module.css";
import { Box, Container, Stack, Typography } from "@mui/material";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import Image from "next/image";
import AllRegistrationTypeServices from "@/app/backend/lib/services/all-registration-type-service";
import UnavailableServiceMessage from "@/app/UIComponent/common-ui/unavailable-service/unavailable-service-msg";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
import ProgramBrief from "./program-brief";
export const revalidate = 14400; // cached for four hour
export default async function page() {
  const allServices = new AllRegistrationTypeServices();
  const isActive = await allServices.checkIsServiceActiveByName(
    RegistrationServiceType.DELEGATE_REGISTRATIONS,
  );
  if (!isActive) return <UnavailableServiceMessage />;
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F1F5F9 0%, #FFFFFF 100%)",
        py: { xs: 5, md: 8 },
        px: 2,
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div className={styles.container}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#0B1220",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Register as Delegate
                </Typography>
                <Typography sx={{ color: "#64748B", fontSize: 14, mt: 0.5 }}>
                  Online Request Form for Conference.
                </Typography>
              </Box>
              <Form
                db={visitorDb.filter((item) => !item.inactive)}
                apiLink={"/backend/api/registration/delegate_registration"}
                request={"POST"}
              />
            </div>
          </Box>

          <Box
            sx={{
              justifySelf: { xs: "center", lg: "end" },
              width: "100%",
            }}
          >
            <Stack spacing={4}>
              {/* <ProgramBrief /> */}
              <Box
                sx={{
                  bg: "#FFFFFF",
                  borderRadius: "20px",
                  border: "1px solid #EEF2F7",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 4,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <PaymentOutlinedIcon
                    sx={{ fontSize: 18, color: "#16A34A" }}
                  />
                  <Typography
                    sx={{ color: "#334155", fontWeight: 700, fontSize: 15 }}
                  >
                    You can Pay online as well
                  </Typography>
                </Stack>
                <Image
                  src={"/Images/common/payment-qr.jpg"}
                  width={220}
                  height={220}
                  alt="qr-code"
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
