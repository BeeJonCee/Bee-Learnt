"use client";

import { Avatar, Box, Chip, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useApi } from "@/hooks/useApi";

interface Member {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  role: string;
  joinedAt: string;
}

interface MemberListProps {
  roomId: number;
}

export default function MemberList({ roomId }: MemberListProps) {
  const { data: members, loading } = useApi<Member[]>(
    `/api/collaboration/rooms/${roomId}/members`
  );

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Loading members...
        </Typography>
      </Box>
    );
  }

  if (!members || members.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          No members
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 1, display: "block", mb: 1 }}
      >
        Members ({members.length})
      </Typography>
      <List dense disablePadding>
        {members.map((member) => (
          <ListItem key={member.userId} sx={{ px: 1, py: 0.5 }}>
            <ListItemAvatar sx={{ minWidth: 36 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem" }}>
                {member.userName?.[0]?.toUpperCase() ?? <PersonIcon fontSize="small" />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 100 }}>
                    {member.userName ?? "Unknown"}
                  </Typography>
                  {member.role === "owner" && (
                    <Chip
                      label="Owner"
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: "0.6rem",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                      }}
                    />
                  )}
                </Box>
              }
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
