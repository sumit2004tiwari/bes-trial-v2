import { Box, Drawer, List } from "@mui/material";
import React from "react";
import DataItemLIst from "./DataListItem";

export default function DrawerMenu({
  onClose,
  data,
  accountMenu
}: any) {
  return (
    <div>
      <Drawer
        open={true}
        onClose={onClose}
        anchor={"right"}
        sx={{ zIndex: 99999999999 }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <DataItemLIst data={data} parentPath="" />
            {accountMenu}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}