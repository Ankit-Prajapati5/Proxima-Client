import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  // 🔄 Loading state add karne se flickering ruk jayegi
  isLoading: true, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false; // Auth success
    },

    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false; // Auth cleared
    },
    
    // 🛡️ Jab loadUser query fail ho jaye (not logged in)
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const { userLoggedIn, userLoggedOut, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;