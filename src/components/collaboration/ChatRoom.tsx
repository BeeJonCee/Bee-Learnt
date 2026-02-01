"use client";

import { useEffect, useRef } from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import MemberList from "./MemberList";
import { useChatRoom, type ChatMessage } from "@/hooks/useSocket";
import { useApi } from "@/hooks/useApi";

interface Room {
  id: number;
  title: string;
  type: string;
  description: string | null;
}

interface ChatRoomProps {
  roomId: number;
  showMembers?: boolean;
}

export default function ChatRoom({ roomId, showMembers = true }: ChatRoomProps) {
  const { data: room } = useApi<Room>(`/api/collaboration/rooms/${roomId}`);
  const { data: initialMessages } = useApi<ChatMessage[]>(
    `/api/collaboration/rooms/${roomId}/messages`
  );

  const {
    messages: realtimeMessages,
    typingUsers,
    isJoined,
    send,
    typing,
    stopTyping,
    clearMessages,
  } = useChatRoom(roomId);

  // Combine initial messages with real-time messages
  const allMessages = [
    ...(initialMessages ?? []),
    ...realtimeMessages.filter(
      (rm) => !initialMessages?.some((im) => im.id === rm.id)
    ),
  ];

  // Clear real-time messages when room changes
  useEffect(() => {
    clearMessages();
  }, [roomId, clearMessages]);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={600}>
          {room?.title ?? "Chat Room"}
        </Typography>
        {room?.description && (
          <Typography variant="body2" color="text.secondary">
            {room.description}
          </Typography>
        )}
      </Box>

      {/* Main content area */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Messages area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Message list */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <MessageList messages={allMessages} />
          </Box>

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <Box sx={{ px: 2, py: 0.5 }}>
              <TypingIndicator users={typingUsers} />
            </Box>
          )}

          {/* Message input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <MessageInput
              onSend={send}
              onTyping={typing}
              onStopTyping={stopTyping}
              disabled={!isJoined}
            />
          </Box>
        </Box>

        {/* Member list sidebar */}
        {showMembers && (
          <>
            <Divider orientation="vertical" flexItem />
            <Box
              sx={{
                width: 200,
                display: { xs: "none", md: "block" },
                overflow: "auto",
              }}
            >
              <MemberList roomId={roomId} />
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}
