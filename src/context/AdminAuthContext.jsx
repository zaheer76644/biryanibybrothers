import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginAdmin, logoutAdmin } from "../store/slices/adminAuthSlice";

export function AdminAuthProvider({ children }) {
  return children;
}

export function useAdminAuth() {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((s) => s.adminAuth.admin);
  const isLoading = useAppSelector((s) => s.adminAuth.isLoading);

  const login = useCallback(
    async (payload) => {
      const result = await dispatch(loginAdmin(payload));
      if (loginAdmin.rejected.match(result)) {
        throw new Error(result.payload || "Invalid credentials.");
      }
      return result.payload;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutAdmin());
  }, [dispatch]);

  return {
    admin,
    isAuthenticated: Boolean(admin),
    isLoading,
    login,
    logout,
  };
}
