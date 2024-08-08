import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";

const Enum = z.enum(["buyer", "developer", "admin", ""]);

const JWTValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  role: Enum,
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
  role: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      const raw = jwtDecode(action.payload);
      const parsed = z
        .object({
          name: z.string(),
          id: z.string(),
          role: Enum,
          email: z.string().email(),
        })
        .safeParse(raw);
      if (parsed.success) {
        const { email, id, name, role } = parsed.data;
        (state.email = email),
          (state.id = id),
          (state.name = name),
          (state.role = role),
          (state.isAuthenticated = true);
      }
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

export const { updateAuthStatus, updateAuth, resetAuth, updateToken } = authSlice.actions;

export default authSlice.reducer;
