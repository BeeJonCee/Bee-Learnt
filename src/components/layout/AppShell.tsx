"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useAuth } from "@/providers/AuthProvider";
import { getDashboardPath } from "@/lib/navigation";

const drawerWidth = 280;

type NavItem = {
  label: string;
  href: string;
  icon: typeof DashboardIcon;
  visible: boolean;
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname() ?? "";
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo<NavItem[]>(() => {
    const role = user?.role ?? "student";
    return [
      {
        label: "Dashboard",
        href: getDashboardPath(role),
        icon: DashboardIcon,
        visible: true,
      },
      {
        label: "Subjects",
        href: "/subjects",
        icon: MenuBookIcon,
        visible: role === "student",
      },
      {
        label: "AI Tutor",
        href: "/ai-tutor",
        icon: AutoAwesomeIcon,
        visible: role === "student",
      },
      {
        label: "Children",
        href: "/children",
        icon: GroupIcon,
        visible: role === "parent",
      },
    ];
  }, [user?.role]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "#101010",
              fontWeight: 700,
            }}
          >
            B
          </Avatar>
          <Box>
            <Typography variant="h6">BeeLearnt</Typography>
            <Typography variant="caption" color="text.secondary">
              CAPS-ready learning
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, pt: 2 }}>
        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const selected =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={selected}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: selected ? "#101010" : "text.secondary",
                  backgroundColor: selected
                    ? "rgba(246, 201, 69, 0.95)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: selected
                      ? "rgba(246, 201, 69, 0.95)"
                      : "rgba(255, 255, 255, 0.06)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: selected ? "#101010" : "inherit",
                  }}
                >
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            );
          })}
      </List>
      <Box sx={{ mt: "auto", px: 2, pb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={logout}
          fullWidth
          sx={{
            borderColor: "rgba(255,255,255,0.16)",
            color: "text.primary",
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 2 }}>
          {!isDesktop && (
            <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            {user?.role === "parent" ? "Parent View" : "Student Dashboard"}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box textAlign="right">
              <Typography variant="subtitle2">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role === "parent" ? "Parent" : "Student"}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: "secondary.main" }}>{user?.name?.[0]}</Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        {isDesktop ? (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                backgroundImage: "none",
                backgroundColor: "rgba(15, 17, 22, 0.9)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                backgroundImage: "none",
                backgroundColor: "rgba(15, 17, 22, 0.98)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 10, md: 12 },
          pb: 6,
          ml: isDesktop ? `${drawerWidth}px` : 0,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(500px circle at 20% 10%, rgba(246, 201, 69, 0.12), transparent 60%), radial-gradient(450px circle at 80% 15%, rgba(91, 192, 235, 0.12), transparent 55%)",
            opacity: 0.8,
          }}
        />
        <Box sx={{ position: "relative" }}>{children}</Box>
      </Box>
    </Box>
  );
}
