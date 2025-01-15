import { useInputValidation } from "6pp";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo, useState } from "react";
import { sampleNotidications, sampleUsers } from "../constants/sampleData";

const Notifications = () => {
  const search = useInputValidation("");
  const [users, setUsers] = useState(sampleUsers);
  const isLoadingSendFriendRequest = false;
  const addFriendHandler = () => {
    console.log("hello");
  };
  const friendRequestHandler = (_id, accept) => {
    console.log("friendRequestHandler");
  };
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {sampleNotidications.length > 0 ? (
          sampleNotidications.map(({ _id, sender }) => {
            return (
              <NotificationsItem
                sender={sender}
                _id={_id}
                handler={friendRequestHandler}
                key={_id}
              />
            );
          })
        ) : (
          <Typography textAlign={"center"}>No Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationsItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});
export default Notifications;
