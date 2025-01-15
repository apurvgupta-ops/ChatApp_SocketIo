import { Menu } from "@mui/material";
import React from "react";

const FileMenu = ({ anchorE1 }) => {
  return (
    <Menu open={false} anchorEl={anchorE1}>
      <div
        style={{
          width: "10rem",
        }}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
        beatae, aliquid incidunt harum aperiam esse, cupiditate veritatis
        ducimus eius quia porro pariatur nostrum aspernatur deleniti suscipit!
        Suscipit labore doloribus odit?
      </div>
    </Menu>
  );
};

export default FileMenu;
