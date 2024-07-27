import * as React from "react";
import { useUser } from "@/hooks/queries/use-user";
import { AuthForm } from "../forms/auth-form";

interface Props {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { data } = useUser();
  if (data) {
    return <>{children}</>;
  }
  return <AuthForm />;
};
