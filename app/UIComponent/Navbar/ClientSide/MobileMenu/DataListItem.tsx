import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
export default function DataItemLIst({
  data,
  parentPath
}: any) {
  const [open, setOpen] = useState("");

  return data?.map((item: any, levelId: any) => {
    let path = item?.isSeprateParentPath ? item?.parentPath : parentPath;
    if (!item.isActive) return null;
    return (
      <React.Fragment key={item.id}>
        {item?.haveChildren === "yes" ? (
          <ListItemButton
            onClick={() => setOpen(open === item?.id ? "" : item?.id)}
          >
            <ListItemText primary={item?.name} />
            {open === item?.id ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        ) : (
          <a href={path + item?.path}>
            <ListItemButton>
              <ListItemText primary={item?.name} />
            </ListItemButton>
          </a>
        )}

        {item?.haveChildren === "yes" && (
          <Collapse
            in={open === item?.id}
            timeout="auto"
            unmountOnExit
            sx={{ pl: 4 }}
          >
            <List component="div" disablePadding>
              <DataItemLIst
                data={item.subChildren}
                levelId={item.id}
                key={levelId}
                parentPath={parentPath + item?.path}
              />
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  });
}
