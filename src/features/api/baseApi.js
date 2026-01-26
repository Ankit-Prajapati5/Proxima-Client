import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  credentials: "include", // 🔥 VERY IMPORTANT (cookie auth)
});
