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
import {
  useGetChatDetailsQuery,
  useGetOldMessagesQuery,
} from "../redux/api/api";
import { NEW_MESSAGE } from "../components/constants/event";
import { useErrors } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";

const Chat = ({ chatId, user }) => {
  console.log({ chatId });
  const containerRef = useRef(null);
  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPages] = useState(1);

  const chatDetails = useGetChatDetailsQuery({ chatId, skip: !chatId });
  console.log(chatDetails.data);

  const oldMessagesChunk = useGetOldMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPages,
    oldMessagesChunk.data?.messages
  );

  const members = chatDetails?.data?.chat?.members;
  const submitHandler = (e) => {
    console.log("submit");
    e.preventDefault();

    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
  };

  const error = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessages.isError, error: oldMessages.error },
  ];
  useErrors(error);

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

  const allMessages = [...oldMessages, ...messages];

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
        {allMessages.map((i) => (
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
