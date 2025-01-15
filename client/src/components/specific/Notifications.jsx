import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { sampleNotidications, sampleUsers } from "../constants/sampleData";

const Notifications = () => {
  const search = useInputValidation("");
  const [users, setUsers] = useState(sampleUsers);
  const isLoadingSendFriendRequest = false;
  const addFriendHandler = () => {
    console.log("hello");
  };
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {sampleNotidications.length > 0 ? (
          <></>
        ) : (
          <Typography textAlign={"center"}>No Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationsItem =({sender, _id, handler}) =>{
 
}
export default Notifications;
