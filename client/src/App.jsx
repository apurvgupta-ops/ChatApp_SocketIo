import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { server } from "./components/constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducers/auth";
import axios from "axios";
import { SocketProvider } from "./socket";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoaderLayout = lazy(() => import("./components/Layout/LoaderLayout"));

// const user = false;

const App = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // console.log(user);
  const config = {
    withCredentials: true,
  };
  useEffect(() => {
    // console.log({ server });
    axios
      .get(`${server}/user/me`, config)
      .then((res) => dispatch(userExist(res.data.user)))
      .catch((err) => dispatch(userNotExist()));
  }, []);

  return loading ? (
    <LoaderLayout />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LoaderLayout />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectedRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
          <Route
            path="/login"
            element={
              <ProtectedRoute user={!user} redirect="/">
                <Login />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
