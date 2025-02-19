import React from "react";
import Title from "../shared/Title";
import Header from "../shared/Header";
import { Drawer, Grid, Skeleton } from "@mui/material";

import ChatList from "../specific/ChatList";
import { sampleChats } from "../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";
import { useErrors } from "../../hooks/hook";
import { getSocket } from "../../socket";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);

    const { isLoading, data, isError, error } = useMyChatsQuery();

    useErrors([{ isError, error }]);
    const socket = getSocket();
    console.log(socket.id);
    const handleClose = () => dispatch(setIsMobile(false));

    const handleDeleteChat = (e, _id, groupChat) =>
      console.log(`delete chats ${_id}`);

    return (
      <div>
        <Title />
        <Header />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              // newMessageAlert={[
              //   {
              //     chatId,
              //     count: 4,
              //   },
              // ]}
              // onlineUsers={["1", "2"]}
              handleDeleteChat={handleDeleteChat}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                // newMessageAlert={[
                //   {
                //     chatId,
                //     count: 4,
                //   },
                // ]}
                // onlineUsers={["1", "2"]}
                handleDeleteChat={handleDeleteChat}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            height={"100%"}
            // bgcolor={"primary.main"}
          >
            <WrappedComponent {...props} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              // padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </div>
    );
  };
};

export default AppLayout;
