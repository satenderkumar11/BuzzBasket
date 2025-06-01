import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HOST_URL } from "../store/constant";

// Helper function to handle fetch requests
const fetchWithBody = async (url, method, body = null) => {
  const options = {
    method,
    headers: { "content-type": "application/json" },
    credentials: "include", // Include credentials for requests needing authentication
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  console.log("response", response);
  // Check if the response is okay (2xx)
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch");
  }

  return response.json();
};

// Signup action
export const authSignup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await fetchWithBody(
        `${HOST_URL}/auth/signup`,
        "POST",
        userData
      );
      console.log("data", data);
      return data.user;
    } catch (err) {
      console.error("Signup Error:", err);
      return rejectWithValue(err.message); // Handle error gracefully in the app
    }
  }
);

// Login action
export const authLogin = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("userData", userData);
      const data = await fetchWithBody(
        `${HOST_URL}/auth/login`,
        "POST",
        userData
      );

      return data.user;
    } catch (err) {
      console.log("Login Error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// Get user by token action
export const getUserByToken = createAsyncThunk(
  "auth/getUserByToken",
  async (_, { rejectWithValue }) => {
    try {
      console.log("getuserbytoken ....");
      const response = await fetch(
        `${HOST_URL}/auth/getUserByToken`,
        {
          credentials: "include",
        }
      );

      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      // Only reject for actual errors, not for "no token" scenario
      if (error.response && error.response.status !== 204) {
        return rejectWithValue(error.response.data);
      }
      // For "no token" scenario, return null instead of rejecting
      return null;
    }
  }
);

// Logout action
export const authLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${HOST_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      return null; // No user after successful logout
    } catch (err) {
      console.error("Logout Error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// Update user profile action
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { loggedInUser } = getState().user;
      if (!loggedInUser || !loggedInUser.id) {
        throw new Error("User not authenticated");
      }

      const data = await fetchWithBody(
        `${HOST_URL}/users/${loggedInUser.id}`,
        "PATCH",
        userData
      );

      return data;
    } catch (err) {
      console.error("Update Profile Error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedInUser: null,
    loginError: null,
    signupError: null,
    getUserFromTokenError: null,
    logoutError: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authSignup.fulfilled, (state, action) => {
        console.log("authSignup.fulfill", action.payload);
        state.loggedInUser = action.payload;
        state.signupError = null;
      })
      .addCase(authSignup.rejected, (state, action) => {
        state.signupError = action.payload;
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        console.log("authLogin action.payload", action.payload);
        state.loggedInUser = action.payload;
        state.loginError = null;
      })
      .addCase(authLogin.rejected, (state, action) => {
        state.loginError = action.payload;
      })
      .addCase(getUserByToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.loggedInUser = action.payload;
        }
      })
      .addCase(getUserByToken.rejected, (state, action) => {
        state.getUserFromTokenError = action.payload;
      })
      .addCase(authLogout.fulfilled, (state) => {
        state.loggedInUser = null;
        state.logoutError = null;
      })
      .addCase(authLogout.rejected, (state, action) => {
        state.logoutError = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loggedInUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;