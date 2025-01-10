import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { CameraAlt } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";

import { useInputValidation, useFileHandler } from "6pp";

const Login = () => {
  const [isLogin, setLogin] = useState(true);

  const toggleLogin = () => setLogin((prev) => !prev);

  const name = useInputValidation("");
  const username = useInputValidation("");
  const password = useInputValidation("");
  const bio = useInputValidation("");
  const avatar = useFileHandler("single");

  return (
    <div>
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button
                  fullWidth
                  sx={{
                    marginTop: "1rem",
                  }}
                  color="primary"
                  type="submit"
                  variant="contained"
                >
                  Login
                </Button>

                <Typography textAlign={"center"}>OR</Typography>

                <Button
                  variant="text"
                  color="primary"
                  onClick={toggleLogin}
                  fullWidth
                >
                  SignUp
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }}>
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAlt />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="UserName"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button
                  fullWidth
                  sx={{
                    marginTop: "1rem",
                  }}
                  color="primary"
                  type="submit"
                  variant="contained"
                >
                  SignUp
                </Button>

                <Typography textAlign={"center"}>OR</Typography>

                <Button
                  variant="text"
                  color="primary"
                  onClick={toggleLogin}
                  fullWidth
                >
                  Login
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
