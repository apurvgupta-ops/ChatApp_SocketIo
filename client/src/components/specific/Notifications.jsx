import { useInputValidation } from "6pp";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const Notifications = () => {
  const search = useInputValidation("");
  const dispatch = useDispatch();

  const { isNotification } = useSelector((state) => state.misc);

  const isLoadingSendFriendRequest = false;

  const { isLoading, data, isError, error } = useGetNotificationQuery();
  useErrors([{ isError, error }]);

  const addFriendHandler = () => {
    console.log("hello");
  };

  const handleClose = () => dispatch(setIsNotification(false));

  const [acceptRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async (_id, accept) => {
    console.log({ _id, accept });
    dispatch(setIsNotification(false));

    try {
      const res = await acceptRequest({ requestId: _id, accept: accept });

      if (res?.data) {
        console.log(res.data, "use Socket");
        toast.success(res.data.message);
      } else {
        toast.error(res?.data?.error);
      }
    } catch (error) {
      toast.error("Failed to accept request");
      console.error(object);
    }
  };

  return (
    <Dialog open={isNotification} onClose={handleClose}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequest?.length > 0 ? (
              data?.allRequest?.map(({ _id, sender }) => {
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
          </>
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
          <Button onClick={() => handler(_id, { accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});
export default Notifications;
