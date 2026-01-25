import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import { authApi } from "../features/api/authApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { progressApi } from "@/features/api/progressApi.js";
import { contactApi } from "@/features/api/contactApi.js";
import { roadmapApi } from "@/features/api/roadmapApi.js";

const rootReducer = combineReducers({
  auth: authReducer,

  // RTK Query reducers
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [purchaseApi.reducerPath]:purchaseApi.reducer,
  [progressApi.reducerPath]:progressApi.reducer,
   [contactApi.reducerPath]:contactApi.reducer,
   [roadmapApi.reducerPath]:roadmapApi.reducer,

});

export default rootReducer;
