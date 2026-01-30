"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Box, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "@/providers/AuthProvider";
import { authClient } from "@/lib/neon-auth/client";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, sendEmailOtp, verifyEmailOtp } = useAuth();
  const nextPath = useMemo(
    () => searchParams.get("next") ?? "/dashboard",
    [searchParams]
  );
  const skipAutoSend = useMemo(() => searchParams.get("sent") === "1", [searchParams]);
  const initialEmail = searchParams.get("email") ?? user?.email ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const autoSendRef = useRef(false);

  useEffect(() => {
    if (initialEmail && email !== initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail, email]);

  const handleSend = useCallback(async () => {
    if (!email) {
      setError("Enter your email to receive a verification code.");
      return;
    }

    setError(null);
    setNotice(null);
    setSending(true);
    try {
      await sendEmailOtp(email);
      setNotice("Verification code sent. Check your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send verification code.");
    } finally {
      setSending(false);
    }
  }, [email, sendEmailOtp]);

  useEffect(() => {
    if (!autoSendRef.current && email && !skipAutoSend) {
      autoSendRef.current = true;
      void handleSend();
    }
  }, [email, handleSend, skipAutoSend]);

  const handleVerify = async () => {
    if (!email || !code) {
      setError("Enter the verification code sent to your email.");
      return;
    }

    setError(null);
    setNotice(null);
    setVerifying(true);
    try {
      await verifyEmailOtp(email, code);
      let hasSession = false;
      if (typeof authClient.getSession === "function") {
        const session = await authClient.getSession();
        hasSession = Boolean(session?.data?.session);
      }
      if (hasSession) {
        router.replace(nextPath);
      } else {
        router.replace(
          `/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Grid container minHeight="100vh" alignItems="center" justifyContent="center">
      <Grid item xs={12} md={7} lg={5} xl={4} px={{ xs: 2, sm: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4">Verify your access</Typography>
              <Typography color="text.secondary">
                Enter the code we sent to your email to continue.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {notice && <Alert severity="success">{notice}</Alert>}

            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <TextField
                label="Verification code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputProps={{ inputMode: "numeric" }}
                required
              />
              <Button variant="outlined" onClick={handleSend} disabled={sending}>
                {sending ? "Sending..." : "Send code"}
              </Button>
              <Button variant="contained" onClick={handleVerify} disabled={verifying}>
                {verifying ? "Verifying..." : "Verify and continue"}
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Need a different account? <a href="/login">Back to sign in</a>
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
