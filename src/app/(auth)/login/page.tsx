"use client";

import { type FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      window.location.href = "/dashboard/student";
    }

    setLoading(false);
  };

  return (
    <Grid container minHeight="100vh">
      <Grid
        item
        lg={6}
        sx={{
          display: { xs: "none", lg: "flex" },
          background:
            "linear-gradient(135deg, rgba(255, 214, 0, 0.15), rgba(15, 15, 15, 0.2))",
          alignItems: "center",
          justifyContent: "center",
          px: 6,
        }}
      >
        <Stack spacing={3} maxWidth={420}>
          <Typography variant="h2" sx={{ color: "text.primary" }}>
            Welcome back to BeeLearnt
          </Typography>
          <Typography color="text.secondary">
            Sign in to continue your CAPS-aligned learning journey and track your progress.
          </Typography>
        </Stack>
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
        }}
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 440 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4">Sign in</Typography>
              <Typography color="text.secondary">
                Use your BeeLearnt account or Google to continue.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </Stack>
            </Box>

            <Divider>or</Divider>

            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => signIn("google", { callbackUrl: "/dashboard/student" })}
            >
              Continue with Google
            </Button>

            <Typography variant="body2" color="text.secondary">
              Need an account? <a href="/register">Create one</a>
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
