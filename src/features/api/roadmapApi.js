import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";

export const roadmapApi = createApi({
    reducerPath: "roadmapApi",
    baseQuery: baseApi,
    tagTypes: ["Roadmap"],
    endpoints: (builder) => ({
        getRoadmap: builder.query({
            query: () => "/roadmap",
            providesTags: ["Roadmap"],
        }),
        suggestIdea: builder.mutation({
    // Isse dhyan se dekho, yahan "/roadmap/suggest" hona chahiye
    query: (data) => ({ 
        url: "/roadmap/suggest", 
        method: "POST", 
        body: data 
    }),
    invalidatesTags: ["Roadmap"],
}),
toggleUpvote: builder.mutation({
    // Yahan bhi "/roadmap/upvote/..." hona chahiye
    query: (ideaId) => ({ 
        url: `/roadmap/upvote/${ideaId}`, 
        method: "PUT" 
    }),
    invalidatesTags: ["Roadmap"],
}),

deleteIdea: builder.mutation({
    query: (id) => ({ 
        url: `/roadmap/delete/${id}`, // matches backend route
        method: "DELETE" 
    }),
    invalidatesTags: ["Roadmap"],
}),
editIdea: builder.mutation({
    query: ({ id, title, tag }) => ({ 
        url: `/roadmap/edit/${id}`, // matches backend route
        method: "PUT", 
        body: { title, tag } 
    }),
    invalidatesTags: ["Roadmap"],
}),
    }),
});

export const { useGetRoadmapQuery, useSuggestIdeaMutation, useToggleUpvoteMutation,useDeleteIdeaMutation,useEditIdeaMutation } = roadmapApi;