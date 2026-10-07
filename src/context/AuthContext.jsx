import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshUser as refreshUserThunk,
  setUser,
} from "../store/slices/authSlice";

/** @deprecated Prefer useAppSelector / useAppDispatch — kept for existing imports */
export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isLoading = useAppSelector((s) => s.auth.isLoading);

  const login = useCallback(
    async (payload) => {
      const result = await dispatch(loginUser(payload));
      if (loginUser.rejected.match(result)) {
        throw new Error(result.payload || "Invalid credentials.");
      }
      return result.payload;
    },
    [dispatch]
  );

  const register = useCallback(
    async (payload) => {
      const result = await dispatch(registerUser(payload));
      if (registerUser.rejected.match(result)) {
        throw new Error(result.payload || "Could not create account.");
      }
      return result.payload;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    const result = await dispatch(refreshUserThunk());
    if (refreshUserThunk.rejected.match(result)) return null;
    return result.payload;
  }, [dispatch]);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    setUser: (next) => dispatch(setUser(next)),
  };
}
