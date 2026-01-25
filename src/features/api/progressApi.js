import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";

export const progressApi = createApi({
  reducerPath: "progressApi",
  baseQuery: baseApi,
  tagTypes: ["Progress"],

  endpoints: (builder) => ({
    /* ================= GET PROGRESS ================= */
    getCourseProgress: builder.query({
      query: (courseId) => `/progress/${courseId}`,
      // 🎯 Specific ID based tagging taaki ek course ka update dusre ko distrub na kare
      providesTags: (result, error, courseId) => [{ type: "Progress", id: courseId }],
    }),

    /* ================= MARK COMPLETED ================= */
    markLectureCompleted: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/progress/${courseId}/lecture/${lectureId}`,
        method: "POST",
      }),
      // 🔥 Invalidate only the specific course progress
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Progress", id: courseId },
      ],
    }),

    /* ================= RESET PROGRESS ================= */
    resetCourseProgress: builder.mutation({
      query: (courseId) => ({
        url: `/progress/${courseId}/reset`,
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [
        { type: "Progress", id: courseId },
      ],
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useMarkLectureCompletedMutation,
  useResetCourseProgressMutation
} = progressApi;