import { Stack } from "@mui/material";
import React from "react";
import ChatItems from "../shared/ChatItems";

const ChatList = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [],
}) => {
  return (
    <Stack direction={"column"} width={"100%"}>
      {chats?.map((data) => {
        return <ChatItems />;
      })}
    </Stack>
  );
};

export default ChatList;
