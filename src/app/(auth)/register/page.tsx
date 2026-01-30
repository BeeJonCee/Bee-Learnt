"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { getDashboardPath } from "@/lib/navigation";
import { useAuth } from "@/providers/AuthProvider";

const roleOptions = [
  { value: "STUDENT", label: "Student" },
  { value: "PARENT", label: "Parent" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, sendEmailOtp, magicLinkLogin, socialLogin } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<null | "google" | "facebook" | "apple">(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role as "STUDENT" | "PARENT",
      });

      await sendEmailOtp(form.email);
      setSuccess("Verification code sent. Check your email to finish setup.");

      const nextPath = form.role === "STUDENT" ? "/onboarding" : getDashboardPath(form.role);
      router.replace(
        `/verify?email=${encodeURIComponent(form.email)}&next=${encodeURIComponent(nextPath)}&sent=1`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!form.email) {
      setError("Enter your email to receive a magic link.");
      return;
    }

    setError(null);
    setSuccess(null);
    setMagicLoading(true);

    try {
      const callbackPath = `/verify?next=${encodeURIComponent("/onboarding")}`;
      const callbackUrl =
        typeof window === "undefined" ? callbackPath : `${window.location.origin}${callbackPath}`;
      await magicLinkLogin(form.email, callbackUrl);
      setSuccess("Magic link sent. Check your inbox to continue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send magic link.");
    } finally {
      setMagicLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "facebook" | "apple") => {
    setError(null);
    setSuccess(null);
    setSocialLoading(provider);
    try {
      const callbackPath = `/verify?next=${encodeURIComponent("/onboarding")}`;
      const callbackUrl =
        typeof window === "undefined" ? callbackPath : `${window.location.origin}${callbackPath}`;
      await socialLogin(provider, callbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Social sign-up failed.");
      setSocialLoading(null);
    }
  };

  return (
    <Grid container minHeight="100vh" alignItems="center" justifyContent="center">
      <Grid item xs={12} md={8} lg={5} xl={4} px={{ xs: 2, sm: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4">Create your account</Typography>
              <Typography color="text.secondary">
                Join BeeLearnt to access CAPS-aligned tutoring.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Stack spacing={1.5}>
              <Button
                variant="outlined"
                onClick={() => handleSocial("google")}
                disabled={socialLoading !== null}
                startIcon={
                  <SvgIcon viewBox="0 0 256 262">
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    />
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    />
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                    />
                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    />
                  </SvgIcon>
                }
              >
                Continue with Google
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleSocial("facebook")}
                disabled={socialLoading !== null}
                startIcon={
                  <SvgIcon viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"
                    />
                  </SvgIcon>
                }
              >
                Continue with Facebook
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleSocial("apple")}
                disabled={socialLoading !== null}
                startIcon={
                  <SvgIcon viewBox="0 0 512 512">
                    <path
                      fill="currentColor"
                      d="M462.595 399.003c-7.743 17.888-16.908 34.353-27.527 49.492c-14.474 20.637-26.326 34.923-35.459 42.855c-14.159 13.021-29.329 19.69-45.573 20.068c-11.662 0-25.726-3.318-42.096-10.05c-16.425-6.7-31.519-10.019-45.32-10.019c-14.475 0-29.999 3.318-46.603 10.019c-16.63 6.731-30.027 10.24-40.27 10.587c-15.578.664-31.105-6.195-46.603-20.606c-9.892-8.628-22.265-23.418-37.088-44.372c-15.903-22.375-28.977-48.322-39.221-77.904c-10.969-31.952-16.469-62.892-16.469-92.846c0-34.313 7.414-63.906 22.265-88.706c11.672-19.92 27.199-35.633 46.631-47.169s40.431-17.414 63.043-17.79c12.373 0 28.599 3.827 48.762 11.349c20.107 7.547 33.017 11.375 38.677 11.375c4.232 0 18.574-4.475 42.887-13.397c22.992-8.274 42.397-11.7 58.293-10.35c43.076 3.477 75.438 20.457 96.961 51.05c-38.525 23.343-57.582 56.037-57.203 97.979c.348 32.669 12.199 59.855 35.491 81.44c10.555 10.019 22.344 17.762 35.459 23.26c-2.844 8.248-5.846 16.149-9.038 23.735zM363.801 10.242c0 25.606-9.355 49.514-28.001 71.643c-22.502 26.307-49.719 41.508-79.234 39.11a80 80 0 0 1-.594-9.703c0-24.582 10.701-50.889 29.704-72.398c9.488-10.89 21.554-19.946 36.187-27.17C336.464 4.608 350.275.672 363.264-.001c.379 3.423.538 6.846.538 10.242z"
                    />
                  </SvgIcon>
                }
              >
                Continue with Apple
              </Button>
            </Stack>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Full name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
                <TextField
                  select
                  label="Role"
                  value={form.role}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, role: event.target.value }))
                  }
                  required
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Creating..." : "Create account"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  disabled={magicLoading}
                  onClick={handleMagicLink}
                >
                  {magicLoading ? "Sending magic link..." : "Continue with Magic Link"}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Already have an account? <a href="/login">Sign in</a>
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
