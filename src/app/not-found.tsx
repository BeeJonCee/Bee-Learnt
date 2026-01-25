import Link from "next/link";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: "100%" }}>
        <CardContent>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main" }} />
            <Typography variant="h4">Page not found</Typography>
            <Typography color="text.secondary">
              The page you are looking for does not exist. Try heading back to the
              dashboard.
            </Typography>
            <Button component={Link} href="/" variant="contained">
              Go to home
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
