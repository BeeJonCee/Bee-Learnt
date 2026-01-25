"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { getModulesBySubjectId, getSubjectById } from "@/lib/demo-data";

export default function SubjectDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const subject = getSubjectById(id);
  const modules = getModulesBySubjectId(id);

  if (!subject) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Subject not found</Typography>
          <Typography color="text.secondary">
            Try returning to the subjects list.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={4}>
      <Breadcrumbs sx={{ color: "text.secondary" }}>
        <Typography component={Link} href="/subjects" color="inherit">
          Subjects
        </Typography>
        <Typography color="text.primary">{subject.name}</Typography>
      </Breadcrumbs>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Chip label={`Grade ${subject.grade}`} color="primary" size="small" />
            <Typography variant="h3">{subject.name}</Typography>
            <Typography color="text.secondary">{subject.description}</Typography>
          </Stack>
          <Box
            sx={{
              mt: 3,
              height: 4,
              width: 120,
              borderRadius: 999,
              bgcolor: "primary.main",
            }}
          />
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <MenuBookIcon color="primary" />
          <Typography variant="h5">Learning modules</Typography>
        </Stack>
        <Stack spacing={2}>
          {modules.map((module) => (
            <Card key={module.id}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent="space-between"
                >
                  <Stack spacing={1}>
                    <Typography variant="h6">{module.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.description}</Typography>
                  </Stack>
                  <Button
                    component={Link}
                    href={`/modules/${module.id}`}
                    variant="outlined"
                    endIcon={<PlayArrowIcon />}
                  >
                    Start module
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
