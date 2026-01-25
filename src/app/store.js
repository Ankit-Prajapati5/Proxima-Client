import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { progressApi } from "@/features/api/progressApi";
import { contactApi } from "@/features/api/contactApi";
import { roadmapApi } from "@/features/api/roadmapApi";

export const appStore = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      progressApi.middleware,
      contactApi.middleware,
      roadmapApi.middleware
    ),
});
