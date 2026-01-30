"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useApi } from "@/hooks/useApi";

type EventItem = {
  id: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string | null;
  allDay: boolean;
  location: string | null;
  audience: "ALL" | "STUDENT" | "PARENT" | "ADMIN";
};

type CalendarValue = Date | [Date, Date] | null;

type Scope = "month" | "week";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value: Date) =>
  value.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function EventsCalendarPanel() {
  const [value, setValue] = useState<CalendarValue>(new Date());
  const [scope, setScope] = useState<Scope>("week");
  const selectedDate = Array.isArray(value) ? value[0] : value ?? new Date();

  const fromDate = useMemo(() => {
    const start = new Date(selectedDate);
    if (scope === "week") {
      start.setDate(start.getDate() - start.getDay());
    } else {
      start.setDate(1);
    }
    start.setHours(0, 0, 0, 0);
    return start;
  }, [selectedDate, scope]);

  const toDate = useMemo(() => {
    const end = new Date(fromDate);
    if (scope === "week") {
      end.setDate(end.getDate() + 6);
    } else {
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    end.setHours(23, 59, 59, 999);
    return end;
  }, [fromDate, scope]);

  const { data, loading, error } = useApi<EventItem[]>(
    `/api/events?from=${fromDate.toISOString()}&to=${toDate.toISOString()}&limit=8`
  );

  const events = data ?? [];

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EventIcon color="primary" />
              <Typography variant="h6">Events</Typography>
            </Stack>
            <ToggleButtonGroup
              value={scope}
              exclusive
              onChange={(_, next) => next && setScope(next)}
              size="small"
            >
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 1.5 }}>
            <Calendar value={value} onChange={setValue} />
          </Box>

          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Showing events for {formatDate(selectedDate)}
            </Typography>

            {loading ? (
              <Typography color="text.secondary">Loading events...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : events.length === 0 ? (
              <Typography color="text.secondary">No events scheduled yet.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {events.map((event) => (
                  <Stack
                    key={event.id}
                    spacing={1}
                    sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", p: 1.5 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600} flex={1}>
                        {event.title}
                      </Typography>
                      <Chip label={event.audience} size="small" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                    <Divider />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Start
                        </Typography>
                        <Typography variant="body2">
                          {formatDateTime(event.startAt)}
                        </Typography>
                      </Stack>
                      {event.endAt && (
                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            End
                          </Typography>
                          <Typography variant="body2">
                            {formatDateTime(event.endAt)}
                          </Typography>
                        </Stack>
                      )}
                      {event.location && (
                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="body2">
                            {event.location}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
