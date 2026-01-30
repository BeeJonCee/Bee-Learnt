"use client";

import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useApi } from "@/hooks/useApi";

type Announcement = {
  id: number;
  title: string;
  body: string;
  audience: "ALL" | "STUDENT" | "PARENT" | "ADMIN";
  pinned: boolean;
  publishedAt: string;
};

const audienceLabel: Record<Announcement["audience"], string> = {
  ALL: "All",
  STUDENT: "Students",
  PARENT: "Parents",
  ADMIN: "Admin",
};

const audienceColor: Record<Announcement["audience"], "default" | "primary" | "secondary" | "success"> = {
  ALL: "default",
  STUDENT: "primary",
  PARENT: "secondary",
  ADMIN: "success",
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AnnouncementsPanel() {
  const { data, loading, error } = useApi<Announcement[]>("/api/announcements?limit=4");
  const announcements = data ?? [];

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Announcements</Typography>
            <Chip label={`${announcements.length} total`} size="small" />
          </Stack>

          {loading ? (
            <Typography color="text.secondary">Loading announcements...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : announcements.length === 0 ? (
            <Typography color="text.secondary">No announcements yet.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {announcements.map((announcement) => (
                <Stack
                  key={announcement.id}
                  spacing={0.75}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    p: 1.5,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1" fontWeight={600} flex={1}>
                      {announcement.title}
                    </Typography>
                    {announcement.pinned && <Chip label="Pinned" size="small" color="warning" />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {announcement.body}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={audienceLabel[announcement.audience]}
                      size="small"
                      color={audienceColor[announcement.audience]}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(announcement.publishedAt)}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
