import * as React from "react";
import { useUser } from "@/hooks/queries/use-user";
import { AuthForm } from "../forms/auth-form";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { data, isError } = useUser();
  if (isError) {
    return <AuthForm />;
  }
  if (data) {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-full items-center justify-center">
      <span>
        <Loader2 className="h-6 w-6 animate-spin" />
      </span>
    </div>
  );
};
