import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React from "react";
import { transformImage } from "../../lib/features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        <Box width={"5rem"} height={"3rem"}>
          {avatar?.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={transformImage(i)}
              alt={`Avatar ${index}`}
              style={{
                width: "2rem",
                height: "2rem",
                // border: "2px solid white",
                position: "absolute",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
