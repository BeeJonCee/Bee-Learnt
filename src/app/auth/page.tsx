"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/providers/AuthProvider";
import { getDashboardPath } from "@/lib/navigation";

export default function AuthPage() {
  const { user, loading, login, register } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [loading, user, router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await login(loginForm.username, loginForm.password);
    if (!result.ok) {
      setError(result.error ?? "Unable to sign in.");
    }
    setSubmitting(false);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await register({
      name: registerForm.name,
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      role: registerForm.role === "parent" ? "parent" : "student",
    });
    if (!result.ok) {
      setError(result.error ?? "Unable to create account.");
    }
    setSubmitting(false);
  };

  return (
    <Grid container minHeight="100vh">
      <Grid
        item
        lg={6}
        sx={{
          display: { xs: "none", lg: "flex" },
          background:
            "linear-gradient(135deg, rgba(246, 201, 69, 0.16), rgba(91, 192, 235, 0.08))",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          px: 6,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "rgba(246, 201, 69, 0.12)",
            filter: "blur(70px)",
            top: "-20%",
            left: "-10%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(91, 192, 235, 0.12)",
            filter: "blur(70px)",
            bottom: "-20%",
            right: "-10%",
          }}
        />
        <Fade in timeout={800}>
          <Stack spacing={3} sx={{ position: "relative", maxWidth: 420 }}>
            <Typography variant="h2" sx={{ color: "#f7f2e6" }}>
              Learn faster. Build focus. Move with confidence.
            </Typography>
            <Typography color="text.secondary" fontSize="1.1rem">
              BeeLearnt blends CAPS-ready structure with AI tutoring, so every
              study session moves you closer to mastery.
            </Typography>
          </Stack>
        </Fade>
      </Grid>

      <Grid
        item
        xs={12}
        lg={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4 },
          py: 6,
        }}
      >
        <Fade in timeout={600} key={tab}>
          <Paper
            sx={{
              width: "100%",
              maxWidth: 440,
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4">
                  {tab === 0 ? "Welcome back" : "Create your account"}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {tab === 0
                    ? "Sign in to continue your learning journey."
                    : "Start your BeeLearnt experience in minutes."}
                </Typography>
              </Box>

              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Sign in" />
                <Tab label="Register" />
              </Tabs>

              {error && <Alert severity="error">{error}</Alert>}

              {tab === 0 ? (
                <Box component="form" onSubmit={handleLogin}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Username"
                      value={loginForm.username}
                      onChange={(event) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          username: event.target.value,
                        }))
                      }
                      fullWidth
                      required
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                      fullWidth
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                    >
                      {submitting ? "Signing in" : "Sign in"}
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleRegister}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Full name"
                      value={registerForm.name}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      fullWidth
                      required
                    />
                    <TextField
                      label="Username"
                      value={registerForm.username}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          username: event.target.value,
                        }))
                      }
                      fullWidth
                      required
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      fullWidth
                      required
                    />
                    <TextField
                      label="Role"
                      select
                      value={registerForm.role}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          role: event.target.value,
                        }))
                      }
                      fullWidth
                      required
                    >
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="parent">Parent</MenuItem>
                    </TextField>
                    <TextField
                      label="Password"
                      type="password"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                      fullWidth
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                    >
                      {submitting ? "Creating" : "Create account"}
                    </Button>
                  </Stack>
                </Box>
              )}

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Demo accounts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Student: student / learn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Parent: parent / care
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Fade>
      </Grid>
    </Grid>
  );
}
