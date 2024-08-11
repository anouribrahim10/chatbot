"use client";
import React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Link,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Assalamualaikum! I'm the Quranic Insights support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const teamMembers = [
    {
      name: "Anour Ibrahim",
      //image: "/public/image/anour.jpg",
      linkedin: "https://www.linkedin.com/in/anour-ibrahim-b11573234/",
    },
    {
      name: "Shafin Rehman",
      image:
        "https://media.licdn.com/dms/image/D4E03AQHcfNzn17-X9Q/profile-displayphoto-shrink_400_400/0/1722036861629?e=1729123200&v=beta&t=OdpZh57VZRhdFSHv2nX6HzR9OoQpLAfmXSwcOS7-BUk",
      linkedin: "https://www.linkedin.com/in/shafin-rehman/",
    },
    {
      name: "Rabigh Ahmed",
      //image: "/public/image/rabigh.jpg",
      linkedin: "https://www.linkedin.com/in/rabigh-ahmed-24a413263/",
    },
    {
      name: "Mohammad Kabir",
      image:
        "https://media.licdn.com/dms/image/D4E03AQFtBmouEbWgNA/profile-displayphoto-shrink_400_400/0/1722358628789?e=1729123200&v=beta&t=IWfcNk3V3WcqhqTpgutH3zr-Y2Ngm_1dbdO_B6bGS7E",
      linkedin: "https://www.linkedin.com/in/mohammad-kabir-196a5020a//",
    },
  ];

  const sendMessage = async () => {
    setMessage(""); // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message }, // Add the user's message to the chat
      { role: "assistant", content: "" }, // Add a placeholder for the assistant's response
    ]);

    // Send the message to the server
    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader(); // Get a reader to read the response body
      const decoder = new TextDecoder(); // Create a decoder to decode the response text

      let result = "";
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        }); // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]; // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1); // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text }, // Append the decoded text to the assistant's message
          ];
        });
        return reader.read().then(processText); // Continue reading the next chunk of the response
      });
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      bgcolor="black"
    >
      {/* Left side content */}
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        p={4}
      >
        <Typography
          variant="h1"
          gutterBottom
          sx={{ fontFamily: "Playfair Display, serif" }}
          color="#bdbdbd"
        >
          ISLAMfromAI
        </Typography>
        <Typography variant="h6" gutterBottom>
          Making learning about Islam much easier with the chatbot that is
          dedicated to tell you about the religion and the way of life.
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Ask questions about the verses from the Quran and understand the meaning" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Ask about authentic Hadith, its narration, and the context" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Get answers to all your questions about the Quran, Hadith, and Islamic teachings with ease." />
          </ListItem>
        </List>

        {/* Team Members - Profile Photos */}
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          p={4}
          border="1px solid white"
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: "Playfair Display, serif" }}
            gutterBottom
          >
            The Developers
          </Typography>
          <Stack direction="row" spacing={4} mt={4}>
            {teamMembers.map((member, index) => (
              <Link
                href={member.linkedin}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <Avatar
                  alt={member.name}
                  src={member.image}
                  sx={{ width: 80, height: 80, border: "2px solid #fff" }}
                />
              </Link>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right side content */}
      <Stack
        direction={"column"}
        width="500px"
        height="auto"
        border="1px solid black"
        p={4}
        spacing={3}
        bgcolor="#e0e0e0"
        flexShrink={0}
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          py={2}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ backgroundColor: "white" }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
/*return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="lightgray"
    >
      <Stack
        direction={"column"}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
        bgcolor="white"
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ backgroundColor: "white" }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}*/
