"use client";

import Link from "next/link";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import FunctionsIcon from "@mui/icons-material/Functions";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { getSubjects, type Subject } from "@/lib/demo-data";

const subjectIcons: Record<number, typeof MenuBookIcon> = {
  1: FunctionsIcon,
  2: ScienceIcon,
  3: BiotechIcon,
};

function SubjectIcon({ subject }: { subject: Subject }) {
  const Icon = subjectIcons[subject.id] ?? MenuBookIcon;
  return <Icon sx={{ fontSize: 48, color: "primary.main" }} />;
}

export default function SubjectsPage() {
  const subjects = getSubjects();

  return (
    <Stack spacing={4}>
      <Stack spacing={1} textAlign="center">
        <Typography variant="h3">Explore subjects</Typography>
        <Typography color="text.secondary">
          CAPS-aligned lessons designed to build confidence and mastery.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {subjects.map((subject) => (
          <Grid item xs={12} md={6} lg={4} key={subject.id}>
            <Card>
              <CardActionArea component={Link} href={`/subjects/${subject.id}`}>
                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, rgba(246, 201, 69, 0.16), rgba(255,255,255,0))",
                  }}
                >
                  <SubjectIcon subject={subject} />
                </Box>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Chip
                      label={`Grade ${subject.grade}`}
                      color="primary"
                      size="small"
                      sx={{ alignSelf: "flex-start" }}
                    />
                    <Typography variant="h5">{subject.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subject.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
