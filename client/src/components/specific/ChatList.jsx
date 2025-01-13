import { Stack } from "@mui/material";
import React from "react";
import ChatItems from "../shared/ChatItems";

const ChatList = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack direction={"column"} width={"100%"}>
      {chats?.map((data, index) => {
        const { avatar, name, _id, groupChat, members } = data;
        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );

        const newMessageAlerts = newMessageAlert.find(
          ({ chatId }) => chatId === _id
        );

        return (
          <ChatItems
            isOnline={isOnline}
            newMessageAlert={newMessageAlerts}
            index={index}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChatOpen={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
