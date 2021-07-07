import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Telegram as TelegramIcon,
} from "@material-ui/icons";

import { config } from "config";
import { ChatEvents } from "constant";
import { Badge, Box, Fab, Typography } from "components/material-ui";
import { ChatClient } from "utils/chat-client";
import { getAuthToken } from "utils/storage";
import { ChatItem } from "./components";
import { MessageField, useStyles } from "./styles";

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
  const [minimized, setMinimized] = useState(true);
  const minimizedRef = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    if (!config.chatSocketURL) {
      return;
    }

    const chatClient = new ChatClient(config.chatSocketURL);
    chatClient.connect(currentTournament.id, getAuthToken().token);

    chatClient.on(ChatEvents.OPEN, () => {
      setJoined(true);
    });

    chatClient.on(ChatEvents.MESSAGE, (message) => {
      setMessages((messages) => [...messages, message]);

      if (minimizedRef.current) {
        setUnreadMessages((unreadMessages) => unreadMessages + 1);
      }
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

  useEffect(() => {
    minimizedRef.current = minimized;
    if (!minimized) {
      setUnreadMessages(0);

      if (chatBoxEndRef.current) {
        chatBoxEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [minimized]);

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

  const toggleMinimized = () => {
    setMinimized((minimized) => !minimized);
  };

  return (
    <Box className={classes.wrapper}>
      <Box height="100%" display="flex" flexDirection="column">
        <Box
          px={6}
          py={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.titleBar}
          onClick={toggleMinimized}
        >
          <Box display="flex" alignItems="center">
            <Box mr={4}>
              <Typography variant="h5">Community Chat</Typography>
            </Box>
            <Badge
              badgeContent={unreadMessages}
              color="secondary"
              invisible={!minimized || !unreadMessages}
            />
          </Box>
          {minimized ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        {!minimized && (
          <React.Fragment>
            <Box p={4} flexGrow={1} className={classes.chatBox}>
              {messages.map((message, index) => (
                <ChatItem
                  key={`chat-${index}`}
                  participants={participants}
                  message={message}
                />
              ))}
              <Box float="left" clear="both" ref={chatBoxEndRef}></Box>
            </Box>
            <Box p={4} display="flex" alignItems="center">
              <Box flexGrow={1} mr={3}>
                <MessageField
                  variant="outlined"
                  value={message}
                  onChange={handleChangeMessage}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Message"
                />
              </Box>
              <Fab
                aria-label="Send"
                color="secondary"
                size="small"
                onClick={handleClickSend}
                disabled={!joined}
              >
                <TelegramIcon />
              </Fab>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};
