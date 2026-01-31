"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type CalendarView = "week" | "day" | "month";

interface TutoringSession {
  id: number;
  title: string;
  description?: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
  studentName?: string;
  tutorName?: string;
  subjectName?: string;
  meetingLink?: string;
  location?: string;
}

interface TutoringCalendarProps {
  sessions?: TutoringSession[];
  onSessionClick?: (session: TutoringSession) => void;
  onCreateSession?: (date: Date) => void;
  view?: CalendarView;
  userRole?: "TUTOR" | "STUDENT" | "ADMIN" | "PARENT";
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "#5BC0EB",
  in_progress: "#FFD600",
  completed: "#22C55E",
  cancelled: "#EF4444",
  no_show: "#F97316",
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

export default function TutoringCalendar({
  sessions = [],
  onSessionClick,
  onCreateSession,
  view: initialView = "week",
  userRole = "STUDENT",
}: TutoringCalendarProps) {
  const [view, setView] = useState<CalendarView>(initialView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Get the start of the current week
  const weekStart = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(date.setDate(diff));
  }, [currentDate]);

  // Get week days
  const weekDays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [weekStart]);

  // Filter sessions for current view
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.scheduledStart);
      if (view === "day") {
        return sessionDate.toDateString() === currentDate.toDateString();
      }
      if (view === "week") {
        return weekDays.some((d) => sessionDate.toDateString() === d.toDateString());
      }
      // Month view
      return (
        sessionDate.getMonth() === currentDate.getMonth() &&
        sessionDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [sessions, view, currentDate, weekDays]);

  const navigate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }

    const newDate = new Date(currentDate);
    const delta = direction === "prev" ? -1 : 1;

    if (view === "day") {
      newDate.setDate(newDate.getDate() + delta);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + delta * 7);
    } else {
      newDate.setMonth(newDate.getMonth() + delta);
    }

    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    if (view === "day") {
      return currentDate.toLocaleDateString("en-ZA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    if (view === "week") {
      const end = new Date(weekStart);
      end.setDate(end.getDate() + 4);
      return `${weekStart.toLocaleDateString("en-ZA", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-ZA", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return currentDate.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
  };

  const getSessionsForDateAndHour = (date: Date, hour: number) => {
    return filteredSessions.filter((session) => {
      const start = new Date(session.scheduledStart);
      return (
        start.toDateString() === date.toDateString() &&
        start.getHours() === hour
      );
    });
  };

  const renderSession = (session: TutoringSession) => {
    const start = new Date(session.scheduledStart);
    const end = new Date(session.scheduledEnd);
    const durationMinutes = (end.getTime() - start.getTime()) / 60000;
    const height = Math.max((durationMinutes / 60) * 60, 30); // min 30px

    return (
      <Box
        key={session.id}
        onClick={() => onSessionClick?.(session)}
        sx={{
          position: "absolute",
          left: 2,
          right: 2,
          height: `${height}px`,
          bgcolor: alpha(STATUS_COLORS[session.status], 0.2),
          borderLeft: `3px solid ${STATUS_COLORS[session.status]}`,
          borderRadius: 1,
          p: 0.5,
          cursor: "pointer",
          overflow: "hidden",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: alpha(STATUS_COLORS[session.status], 0.35),
            transform: "scale(1.02)",
          },
        }}
      >
        <Typography variant="caption" fontWeight={600} noWrap display="block">
          {session.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap display="block">
          {start.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })} -{" "}
          {end.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
        </Typography>
        {session.studentName && userRole === "TUTOR" && (
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {session.studentName}
          </Typography>
        )}
        {session.tutorName && userRole === "STUDENT" && (
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {session.tutorName}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton size="small" onClick={() => navigate("prev")}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton size="small" onClick={() => navigate("next")}>
              <ChevronRightIcon />
            </IconButton>
            <Button
              size="small"
              startIcon={<TodayIcon />}
              onClick={() => navigate("today")}
            >
              Today
            </Button>
            <Typography variant="h6" fontWeight={600} sx={{ ml: 2 }}>
              {formatDateRange()}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, newView) => newView && setView(newView)}
              size="small"
            >
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Calendar Grid */}
        {view === "month" ? (
          <Box sx={{ p: 2 }}>
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                  setCurrentDate(value);
                }
              }}
              value={currentDate}
              tileContent={({ date }) => {
                const daySessions = sessions.filter(
                  (s) => new Date(s.scheduledStart).toDateString() === date.toDateString()
                );
                if (daySessions.length === 0) return null;
                return (
                  <Stack direction="row" spacing={0.25} justifyContent="center" mt={0.5}>
                    {daySessions.slice(0, 3).map((s) => (
                      <Box
                        key={s.id}
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: STATUS_COLORS[s.status],
                        }}
                      />
                    ))}
                  </Stack>
                );
              }}
              className="bee-calendar"
            />

            {/* Sessions for selected date */}
            {selectedDate && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Sessions on {selectedDate.toLocaleDateString("en-ZA", { weekday: "long", month: "long", day: "numeric" })}
                </Typography>
                <Stack spacing={1}>
                  {sessions
                    .filter(
                      (s) =>
                        new Date(s.scheduledStart).toDateString() ===
                        selectedDate.toDateString()
                    )
                    .map((session) => (
                      <Box
                        key={session.id}
                        onClick={() => onSessionClick?.(session)}
                        sx={{
                          p: 1.5,
                          bgcolor: alpha(STATUS_COLORS[session.status], 0.1),
                          borderLeft: `3px solid ${STATUS_COLORS[session.status]}`,
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: alpha(STATUS_COLORS[session.status], 0.2),
                          },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            {session.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={session.status}
                            sx={{
                              bgcolor: alpha(STATUS_COLORS[session.status], 0.2),
                              color: STATUS_COLORS[session.status],
                              fontSize: 10,
                            }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(session.scheduledStart).toLocaleTimeString("en-ZA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(session.scheduledEnd).toLocaleTimeString("en-ZA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                    ))}
                </Stack>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ overflow: "auto", maxHeight: 600 }}>
            {/* Day/Week Grid Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `60px repeat(${view === "day" ? 1 : 5}, 1fr)`,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <Box sx={{ p: 1, borderRight: 1, borderColor: "divider" }} />
              {(view === "day" ? [currentDate] : weekDays).map((date, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1,
                    textAlign: "center",
                    borderRight: idx < (view === "day" ? 0 : 4) ? 1 : 0,
                    borderColor: "divider",
                    bgcolor:
                      date.toDateString() === new Date().toDateString()
                        ? alpha("#FFD600", 0.1)
                        : "transparent",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {date.toLocaleDateString("en-ZA", { weekday: "short" })}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        date.toDateString() === new Date().toDateString()
                          ? "primary.main"
                          : "transparent",
                      color:
                        date.toDateString() === new Date().toDateString()
                          ? "primary.contrastText"
                          : "text.primary",
                    }}
                  >
                    {date.getDate()}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Time Grid */}
            {HOURS.map((hour) => (
              <Box
                key={hour}
                sx={{
                  display: "grid",
                  gridTemplateColumns: `60px repeat(${view === "day" ? 1 : 5}, 1fr)`,
                  minHeight: 60,
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRight: 1,
                    borderColor: "divider",
                    textAlign: "right",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {hour.toString().padStart(2, "0")}:00
                  </Typography>
                </Box>
                {(view === "day" ? [currentDate] : weekDays).map((date, idx) => {
                  const hourSessions = getSessionsForDateAndHour(date, hour);
                  return (
                    <Box
                      key={idx}
                      sx={{
                        position: "relative",
                        borderRight: idx < (view === "day" ? 0 : 4) ? 1 : 0,
                        borderColor: "divider",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: alpha("#FFD600", 0.05),
                        },
                      }}
                      onClick={() => {
                        const newDate = new Date(date);
                        newDate.setHours(hour, 0, 0, 0);
                        onCreateSession?.(newDate);
                      }}
                    >
                      {hourSessions.map(renderSession)}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        )}

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>Export Schedule</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Print</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
        </Menu>
      </CardContent>

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        .bee-calendar {
          width: 100%;
          background: transparent;
          border: none;
          font-family: inherit;
        }
        .bee-calendar .react-calendar__tile {
          background: transparent;
          color: inherit;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .bee-calendar .react-calendar__tile:hover {
          background: rgba(255, 214, 0, 0.1);
        }
        .bee-calendar .react-calendar__tile--active {
          background: rgba(255, 214, 0, 0.2) !important;
          color: inherit;
        }
        .bee-calendar .react-calendar__tile--now {
          background: rgba(255, 214, 0, 0.15);
        }
        .bee-calendar .react-calendar__navigation button {
          color: inherit;
          min-width: 44px;
          background: none;
          font-size: 16px;
        }
        .bee-calendar .react-calendar__navigation button:hover {
          background: rgba(255, 214, 0, 0.1);
        }
        .bee-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: 600;
          font-size: 11px;
          color: #888;
        }
      `}</style>
    </Card>
  );
}
