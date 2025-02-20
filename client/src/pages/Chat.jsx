import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/Layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, orange } from "../components/constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/Dialog/FileMenu";
import Message from "../components/shared/Message";
import { sampleMessage } from "../components/constants/sampleData";
import { getSocket } from "../socket";
import { useGetChatDetailsQuery } from "../redux/api/api";
import { NEW_MESSAGE } from "../components/constants/event";

const Chat = ({ chatId, user }) => {
  console.log({ chatId });
  const containerRef = useRef(null);
  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const chatDetails = useGetChatDetailsQuery({ chatId, skip: !chatId });
  console.log(chatDetails.data);

  const members = chatDetails?.data?.chat?.members;
  const submitHandler = (e) => {
    console.log("submit");
    e.preventDefault();

    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
  };

  const newEventHandler = useCallback((data) => {
    console.log("recieving", data);
    setMessages((prev) => [...prev, data.message]);
  }, []);

  console.log(messages);

  const eventArray = { [NEW_MESSAGE]: newEventHandler };

  useEffect(() => {
    Object.entries(eventArray).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(eventArray).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, []);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {messages.map((i) => (
          <Message key={i._id} message={i} user={user} />
        ))}
      </Stack>

      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          position={"relative"}
          alignItems={"center"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type Message Here "
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />

          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu />
    </>
  );
};

export default AppLayout()(Chat);
