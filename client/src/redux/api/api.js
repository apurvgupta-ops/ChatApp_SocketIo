import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../components/constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: server }),
  tagTypes: ["Chat", "User"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "/chat/my-chats",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    searchUsers: builder.query({
      query: (name) => ({
        url: `/user/search/?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    sendFriendRequest: builder.mutation({
      query: (userId) => ({
        url: "/user/send-request",
        method: "PUT",
        credentials: "include",
        body: { userId },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export default api;

export const {
  useMyChatsQuery,
  useLazySearchUsersQuery,
  useSendFriendRequestMutation,
} = api;
