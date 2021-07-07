import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { config } from "config";
import { ChatEvents } from "constant";
import { ChatClient } from "utils/chat-client";
import { getAuthToken } from "utils/storage";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "components/material-ui";
import { useStyles } from "./styles";

export const Chat = (props) => {
  const chatClientRef = useRef(null);
  const chatBoxEndRef = useRef(null);
  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [joined, setJoined] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const chatClient = new ChatClient(config.chatSocketURL);
    chatClient.connect(currentTournament.id, getAuthToken().token);

    chatClient.on(ChatEvents.OPEN, () => {
      setJoined(true);
    });

    chatClient.on(ChatEvents.MESSAGE, (message) => {
      setMessages((messages) => [...messages, message]);
    });

    chatClient.on(ChatEvents.STATUS, (status) => {
      setParticipants(status.participants);
      setMessages(status.messages);
    });

    chatClient.on(ChatEvents.JOINED, (participant) => {
      setParticipants((participants) => [...participants, participant]);
    });

    chatClientRef.current = chatClient;

    return () => {
      chatClientRef.current.disconnect();
    };
  }, [currentTournament.id]);

  useEffect(() => {
    if (chatBoxEndRef.current) {
      chatBoxEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleClickSend();
    }
  };

  const handleClickSend = () => {
    if (chatClientRef.current) {
      chatClientRef.current.sendData({
        action: "message",
        message,
      });
      setMessage("");
    }
  };

  return (
    <React.Fragment>
      <Box className={classes.backDrop} onClick={props.onClose} />
      <Paper round="true" className={classes.wrapper}>
        <Box p={6} height="100%" display="flex" flexDirection="column">
          <Box mv={3}>
            <Typography variant="h4">Lobby Chat</Typography>
          </Box>
          <Box my={3} flexGrow={1} className={classes.chatBox}>
            {messages.map((message, index) => {
              const participant = participants.find(
                (p) => p.id === message.sender
              );
              return (
                <Box
                  key={`chat-${index}`}
                  display="flex"
                  alignItems="flex-start"
                >
                  <Box minWidth={120} mr={2}>
                    <Typography variant="body1" className={classes.sender}>
                      {participant ? participant.name : message.sender}:
                    </Typography>
                  </Box>
                  <Typography variant="body1">{message.message}</Typography>
                </Box>
              );
            })}
            <Box float="left" clear="both" ref={chatBoxEndRef}></Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1} mr={3}>
              <TextField
                value={message}
                onChange={handleChangeMessage}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                className={classes.textField}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickSend}
              disabled={!joined}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </React.Fragment>
  );
};
