import React from "react";
import AppLayout from "../components/Layout/AppLayout";
import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box bgcolor={"GrayText"} height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select Friend to Chat
      </Typography>
      ;
    </Box>
  );
};

export default AppLayout()(Home);
