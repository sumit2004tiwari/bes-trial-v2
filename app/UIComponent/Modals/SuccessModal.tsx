import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { redirect, useRouter } from "next/navigation";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function SuccessModal({ isOpen }: { isOpen: boolean }) {
  const [open, _] = React.useState(isOpen);
  const [count, setCount] = React.useState(10);
  const router = useRouter();
  React.useEffect(() => {
    let id = setInterval(() => {
      setCount((prev) => {
        prev--;
        if (prev < 1) clearInterval(id);
        return prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  if (count < 1) redirect("/");

  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Alert severity="success">
            You have successfully Registered. A confirmation details has been
            sent to your registered Email
          </Alert>
          <Typography>Redireting to homepage... </Typography>
          <Typography className="text-center">{count} </Typography>
        </Box>
      </Modal>
    </div>
  );
}
