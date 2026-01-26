"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { apiFetch } from "@/lib/utils/api";

type Message = { role: "user" | "assistant"; content: string };

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Share a topic and I will break it down into steps, practice, and summaries.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const nextMessage = input.trim();
    const nextMessages = [...messages, { role: "user", content: nextMessage }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await apiFetch<{ message: string }>("/api/ai/tutor", {
        method: "POST",
        body: JSON.stringify({
          messages: nextMessages.slice(-8),
        }),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: response.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into an issue. Try again or ask in a different way.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 900 }}>
      <Stack spacing={1}>
        <Typography variant="h3">AI Tutor</Typography>
        <Typography color="text.secondary">
          Chat with BeeLearnt to explore concepts or generate practice questions.
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={2} sx={{ minHeight: 360 }}>
            {messages.map((message, index) => (
              <Box
                key={`${message.role}-${index}`}
                sx={{
                  alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  maxWidth: "80%",
                  bgcolor:
                    message.role === "user"
                      ? "primary.main"
                      : "rgba(255,255,255,0.08)",
                  color: message.role === "user" ? "#101010" : "text.primary",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  {message.role === "assistant" && (
                    <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                  )}
                  <Typography variant="body2">{message.content}</Typography>
                  </Stack>
                </Box>
            ))}
            {loading && (
              <Box
                sx={{
                  alignSelf: "flex-start",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  maxWidth: "80%",
                  bgcolor: "rgba(255,255,255,0.08)",
                }}
              >
                <Typography variant="body2">Thinking...</Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about algebra, motion, genetics..."
          fullWidth
          multiline
          minRows={2}
        />
        <Button
          variant="contained"
          size="large"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!input.trim() || loading}
        >
          Send
        </Button>
      </Stack>
    </Stack>
  );
}
