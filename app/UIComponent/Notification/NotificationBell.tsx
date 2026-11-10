"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { NotificationsNone, Close } from "@mui/icons-material";
import {
  getMyNotifications,
  markNotificationsRead,
} from "@/app/frontend/actions/notification";
import { useAuthContext } from "../context-provider/auth-provider";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const timeAgo = (date: string) => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function NotificationBell() {
  const { userData, isSignIn } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const markAllTimer = useRef<any>(null);

  const loadNotifications = useCallback(async () => {
    if (!isSignIn) return;
    setLoading(true);
    try {
      const res: any = await getMyNotifications();
      if (res?.status) {
        setNotifications(res?.data?.notifications || []);
        setUnreadCount(res?.data?.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [isSignIn]);

  useEffect(() => {
    if (isSignIn) loadNotifications();
  }, [isSignIn, loadNotifications]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    loadNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
    markAllTimer.current = setTimeout(() => {
      markAllNotificationsRead();
    }, 500);
  };

  const markAllNotificationsRead = async () => {
    try {
      const res: any = await markNotificationsRead();
      if (res?.status) {
        setUnreadCount(res?.data?.unreadCount || 0);
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleItemClick = async (notification: NotificationItem) => {
    if (notification.isRead) return;
    try {
      const res: any = await markNotificationsRead(notification._id);
      if (res?.status) {
        setUnreadCount(res?.data?.unreadCount || 0);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const open = !!anchorEl && !loading;

  return (
    <>
      <Tooltip title="Notifications" arrow>
        <IconButton
          onClick={handleOpen}
          sx={{
            color: "white",
            ml: 1,
            "&:hover": { transform: "scale(1.05)", transition: "transform 0.2s" },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            invisible={unreadCount === 0}
          >
            <NotificationsNone />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 1, zIndex: 99999999999 }}
      >
        <Box sx={{ width: 360, maxWidth: "90vw" }}>
          <Box
            sx={{
              p: 2,
              minHeight: 48,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              flexWrap: "nowrap",
              bgcolor: "#101130",
              color: "white",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              noWrap
              sx={{ flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden" }}
            >
              Notifications
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  <CircularProgress size={14} color="inherit" />
                  <Typography variant="caption" color="inherit" noWrap>
                    Loading...
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="caption"
                  color="inherit"
                  noWrap
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {unreadCount > 0 ? `${unreadCount} unread` : ""}
                </Typography>
              )}
              <IconButton
                onClick={handleClose}
                size="small"
                aria-label="Close notifications"
                sx={{
                  color: "white",
                  p: 0.25,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {userData?.name}, no notifications yet.
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notification) => (
                  <ListItem key={notification._id} disablePadding>
                    <ListItemButton
                      onClick={() => handleItemClick(notification)}
                      sx={{
                        bgcolor: notification.isRead ? "transparent" : "#eef2ff",
                        alignItems: "flex-start",
                        px: 2,
                        py: 1.5,
                      }}
                    >
                      <Box sx={{ width: "100%", minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                            sx={{ minWidth: 0 }}
                          >
                            {notification.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ flexShrink: 0 }}
                          >
                            {timeAgo(notification.createdAt)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ wordBreak: "break-word", mt: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Popover>
    </>
  );
}