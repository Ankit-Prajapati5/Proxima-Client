import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";
import { userLoggedIn, userLoggedOut } from "../authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseApi,
  tagTypes: ["User"],

  endpoints: (builder) => ({
    /* ================= REGISTER ================= */
    register: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        body: data,
      }),
    }),

    /* ================= LOGIN ================= */
    login: builder.mutation({
      query: (userData) => ({
        url: "/user/login",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // ✅ Pehle login state update karo (data controller se mil raha hai)
          dispatch(userLoggedIn({ user: data.user }));
          
          // 🔥 Phir poora profile load karo (roles aur extra details ke liye)
          dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
        } catch (err) {
          console.error("Login Error:", err);
        }
      },
    }),

    /* ================= LOGOUT ================= */
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
          // 🧹 Purana saara data clear karo
          dispatch(authApi.util.resetApiState());
        } catch (err) {
          console.error("Logout Error:", err);
        }
      },
    }),
  
// 3. Send OTP (For both Signup and Forget Password)
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/user/send-otp",
        method: "POST",
        body: { email },
      }),
    }),

    // 4. Reset Password (OTP based)
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/user/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    /* ================= LOAD USER ================= */
    loadUser: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(userLoggedIn({ user: data.user }));
          }
        } catch (err) {
          // 401 handle silently - user not logged in
        }
      },
    }),

    /* ================= UPDATE PROFILE ================= */
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/user/profile",
        method: "PUT",
        body: formData,
        // Note: FormData use ho raha hai isliye headers baseApi handle karega
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // 🔥 VVIP FIX: Update Redux store with NEW user data (photo/name)
          if (data?.user) {
            dispatch(userLoggedIn({ user: data.user }));
          }
        } catch (err) {
          console.error("Profile Update Error:", err);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useLoadUserQuery,
  useUpdateProfileMutation,
  useSendOtpMutation,
  useResetPasswordMutation,
} = authApi;