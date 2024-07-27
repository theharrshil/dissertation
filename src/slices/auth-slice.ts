import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { z } from "zod";

const JWTValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["buyer", "developer", "supplier", "admin"]).nullable(),
  id: z.string(),
});

type State = {
  isAuthenticated: boolean;
} & z.infer<typeof JWTValidator>;

const initialState: State = {
  isAuthenticated: false,
  email: "",
  id: "",
  name: "",
  role: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    updateAuth: (state, action: PayloadAction<State>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetAuth: (state) => {
      return {
        ...state,
        ...initialState,
      };
    },
  },
});

export const { updateAuthStatus, updateAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;
