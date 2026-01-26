import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseApi,
  // 🔥 Tags: Cache synchronization ke liye backbone hain
  tagTypes: ["CreatorCourse", "Course", "Lecture", "PublishedCourse","Purchase"],

  endpoints: (builder) => ({
    /* ================= 👨‍🏫 CREATOR ENDPOINTS ================= */
    
    createCourse: builder.mutation({
      query: (body) => ({
        url: "/course",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CreatorCourse"],
    }),

    getCreatorCourse: builder.query({
      query: () => "/course/creator",
      // List refresh ke liye
      providesTags: ["CreatorCourse"],
    }),

    getCreatorCourseById: builder.query({
      query: (courseId) => `/course/creator/${courseId}`,
      providesTags: (result, error, courseId) => [{ type: "Course", id: courseId }],
    }),

    editCourse: builder.mutation({
      query: ({ courseId, formData }) => ({
        url: `/course/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      // 🔥 Sabhi relevant views update honge
      invalidatesTags: (result, error, { courseId }) => [
        "CreatorCourse",
        "PublishedCourse",
        { type: "Course", id: courseId },
      ],
    }),

    uploadCourseThumbnail: builder.mutation({
      query: ({ courseId, formData }) => ({
        url: `/course/${courseId}/thumbnail`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Course", id: courseId },
        "CreatorCourse"
      ],
    }),

    togglePublishCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/course/${courseId}/toggle-publish`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        "CreatorCourse",
        "PublishedCourse",
        { type: "Course", id: courseId },
      ],
    }),

    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CreatorCourse", "PublishedCourse"],
    }),

    /* ================= 🎓 PUBLIC & STUDENT ENDPOINTS ================= */
    
    getPublishedCourse: builder.query({
      query: () => "/course/published",
      providesTags: ["PublishedCourse"],
    }),

    getPublicCourseById: builder.query({
      query: (courseId) => `/course/public/${courseId}`,
      providesTags: (result, error, courseId) => [{ type: "Course", id: courseId }],
    }),

    /* ================= 📖 LECTURE ENDPOINTS ================= */
    
   createLecture: builder.mutation({
  query: ({ courseId, lectureTitle, videoId, isPreviewFree }) => ({
    url: `/course/${courseId}/lecture`,
    method: "POST",
    body: { lectureTitle, videoId, isPreviewFree },
  }),
  invalidatesTags: (result, error, { courseId }) => [
    { type: "Course", id: courseId },
  ],
}),


    getCourseLecture: builder.query({
      query: (courseId) => `/course/${courseId}/lecture`,
      providesTags: (result, error, courseId) => [{ type: "Course", id: courseId }],
    }),

   getLectureById: builder.query({
  query: ({ courseId, lectureId }) => `/course/${courseId}/lecture/${lectureId}`,
      providesTags: (result, error, lectureId) => [
        { type: "Lecture", id: lectureId },
      ],
    }),

  editLecture: builder.mutation({
  query: ({ courseId, lectureId, data }) => ({
    url: `/course/${courseId}/lecture/${lectureId}`,
    method: "PUT",
    body: data,
  }),
  invalidatesTags: (result, error, { courseId, lectureId }) => [
    { type: "Lecture", id: lectureId },
    { type: "Course", id: courseId },
  ],
}),


    removeLecture: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/course/${courseId}/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),
    /* ================= 📺 STREAM & PLAYER ================= */
//    streamLecture: builder.query({
//   query: ({ courseId, lectureId }) => ({
//     // Yahan URL check karein, kya ye backend ke route se match kar raha hai?
//     url: `/course/${courseId}/lecture/${lectureId}/stream`, 
//     method: "GET",
//   }),
// }),
    /* ================= 📺 SPECIAL QUERIES ================= */

    getCourseDetailWithLessons: builder.query({
      query: (courseId) => `/course/${courseId}`,
      providesTags: (result, error, courseId) => [{ type: "Course", id: courseId }],
    }),
    // features/api/courseApi.js
getDashboardStats: builder.query({
  query: () => ({
    url: "/course/purchase/stats",
    method: "GET",
  }),
  // Isse dashboard automatically refresh hoga jab bhi koi new purchase hogi
  providesTags: ["Purchase"], 
}),
  }),
});

export const {
  useCreateCourseMutation,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useTogglePublishCourseMutation,
  useDeleteCourseMutation,
  useUploadCourseThumbnailMutation,
  useGetPublishedCourseQuery,
  useGetPublicCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useGetLectureByIdQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetCreatorCourseByIdQuery,
  useGetCourseDetailWithLessonsQuery,
  // useLazyStreamLectureQuery,
  useGetDashboardStatsQuery,
} = courseApi;