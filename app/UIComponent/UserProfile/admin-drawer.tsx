import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Collapse,
} from "@mui/material";
import React, { useState } from "react";
import {
  Dashboard,
  Person,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  Help,
  ExpandLess,
  ExpandMore,
  Group,
  PersonAdd,
  Assignment,
  Analytics,
  Security,
} from "@mui/icons-material";
import Link from "next/link";

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  onLogout: () => void;
}
interface MenuItem {
  id: number;
  name: string;
  icon: any;
  path?: string;
  children?: { id: number; name: string; path: string }[];
}
const menuItems: MenuItem[] = [
  //   { id: 1, name: "Dashboard", icon: Dashboard, path: "/admin/dashboard" },
  {
    id: 2,
    name: "User Management",
    icon: Group,
    children: [
      //   { id: 21, name: "All Users", path: "/admin/users" },
      {
        id: 22,
        name: "All Registrations",
        path: "/admin/all-registrations",
      },
      {
        id: 23,
        name: "Member Approvals",
        path: "/admin/all-registrations/members",
      },
      //   { id: 24, name: "User Roles", path: "/admin/users/roles" },
    ],
  },
  {
    id: 3,
    name: "All Services",
    icon: Settings,
    children: [
      {
        id: 31,
        name: "All Registration Service",
        path: "/admin/services/all-registration-service",
      },
      {
        id: 32,
        name: "BES Event Config",
        path: "/admin/services/bes-event-config",
      },
    ],
  },
  //   {
  //     id: 3,
  //     name: "Content Management",
  //     icon: Assignment,
  //     children: [
  //       { id: 31, name: "Posts", path: "/admin/content/posts" },
  //       { id: 32, name: "Pages", path: "/admin/content/pages" },
  //       { id: 33, name: "Media", path: "/admin/content/media" },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     name: "Analytics",
  //     icon: Analytics,
  //     children: [
  //       { id: 41, name: "Reports", path: "/admin/analytics/reports" },
  //       { id: 42, name: "Statistics", path: "/admin/analytics/stats" },
  //     ],
  //   },
  //   { id: 5, name: "Settings", icon: Settings, path: "/admin/settings" },
  //   { id: 6, name: "Security", icon: Security, path: "/admin/security" },
];

export default function AdminDrawer({
  open,
  onClose,
  userName,
  userEmail,
  onLogout,
}: AdminDrawerProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const handleToggleExpand = (itemId: number) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  return (
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
        {/* Admin Header */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              mx: "auto",
              mb: 1,
              bgcolor: "secondary.main",
            }}
          >
            {userName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
            Admin: {userName?.toLowerCase()}
          </Typography>
          {userEmail && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {userEmail}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Menu Items */}
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isExpanded = expandedItems.includes(item.id);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <React.Fragment key={item.id}>
                {hasChildren ? (
                  <ListItemButton onClick={() => handleToggleExpand(item.id)}>
                    <ListItemIcon>
                      <IconComponent />
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                ) : (
                  <Link
                    href={item?.path}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemButton onClick={onClose}>
                      <ListItemIcon>
                        <IconComponent />
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </Link>
                )}

                {hasChildren && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <ListItemButton sx={{ pl: 4 }} onClick={onClose}>
                            <ListItemText primary={child.name} />
                          </ListItemButton>
                        </Link>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}

          <Divider sx={{ my: 1 }} />

          {/* Logout */}
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
