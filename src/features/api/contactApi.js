import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: baseApi,
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (formData) => ({
        url: "/contact",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = contactApi;