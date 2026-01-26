import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: baseApi,
  tagTypes: ["Purchase", "Course"], // 🔥 Course tag bhi add kiya

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
      // 🔥 Purchase ke baad cache refresh hoga
      invalidatesTags: ["Purchase", "Course"],
    }),

    /* ==============================
       CHECK PURCHASE STATUS
    ============================== */
    checkCoursePurchase: builder.query({
      query: (courseId) =>
        `/course-purchase/check/${courseId}`,
      providesTags: ["Purchase"],
    }),

    /* ==============================
       MY LEARNING COURSES
    ============================== */
    getMyLearning: builder.query({
      query: () => "/course-purchase/my-learning",
      providesTags: ["Purchase"],
    }),

  }),
});

export const {
  useCreateCourseOrderMutation,
  useCheckCoursePurchaseQuery,
  useGetMyLearningQuery,
} = purchaseApi;
