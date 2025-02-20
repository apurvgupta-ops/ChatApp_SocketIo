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

    getNotification: builder.query({
      query: () => ({
        url: `/user/all-request`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
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

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "/user/accept-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),


    getChatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";
        return {
          url,
          credentials: "include",
        }
      },
      providesTags: ["Chat"],
    }),
  }),
});

export default api;

export const {
  useMyChatsQuery,
  useLazySearchUsersQuery,
  useSendFriendRequestMutation,
  useGetNotificationQuery,
  useAcceptFriendRequestMutation,
  useGetChatDetailsQuery
} = api;
