import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: baseApi,
  tagTypes: ["Purchase"],

  endpoints: (builder) => ({
    /* ==============================
       CREATE ORDER
    ============================== */
    createCourseOrder: builder.mutation({
      query: (courseId) => ({
        url: "/course-purchase/create-order",
        method: "POST",
        body: { courseId },
      }),
    }),

    /* ==============================
       CHECK PURCHASE STATUS
    ============================== */
    checkCoursePurchase: builder.query({
      query: (courseId) =>
        `/course-purchase/check/${courseId}`,
      providesTags: ["Purchase"],
    }),
    getMyLearning: builder.query({
  query: () => "/course-purchase/my-learning",
}),

  }),
});

export const {
  useCreateCourseOrderMutation,
  useCheckCoursePurchaseQuery,
  useGetMyLearningQuery,
} = purchaseApi;
