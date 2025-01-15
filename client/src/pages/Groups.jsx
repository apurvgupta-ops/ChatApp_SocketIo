import React, { memo, useState } from "react";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats } from "../components/constants/sampleData";

const Groups = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState();
  const chatId = useSearchParams()[0].get("group");

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => setIsMobileOpen((prev) => !prev);
  const handleClose = () => setIsMobileOpen(false);
  const IconBtns = (
    <>
      <Box
        border={"red"}
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title={"back"}>
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: "rgba(0,0,0,0.8)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = <Stack>Aasd</Stack>;

  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sm={4}
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        bgcolor={"bisque"}
      >
        <GroupList groups={sampleChats} chatId={chatId} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}
        {GroupName}
      </Grid>

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
            bgcolor: "bisque",
          },
        }}
        open={isMobileOpen}
        onClose={handleClose}
      >
        <GroupList w="50vw" groups={sampleChats} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

const GroupList = ({ w = "100%", groups = [], chatId }) => (
  <Stack width={w} direction={"column"}>
    {groups.length > 0 ? (
      groups.map((group, index) => (
        <GroupListItems group={group} chatId={chatId} key={index} />
      ))
    ) : (
      <Typography>No Groups Found</Typography>
    )}
  </Stack>
);

const GroupListItems = ({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack w direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
};

export default memo(Groups);
