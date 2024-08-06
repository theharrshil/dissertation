import * as React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/use-store";
import { AuthForm } from "../forms/auth-form";
import { updateToken } from "@/slices/auth-slice";

interface Props {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(updateToken(token));
    }
  }, [dispatch]);
  if (!isAuthenticated) {
    return <AuthForm />;
  }
  return <>{children}</>;
};
