import * as React from "react";
import { Sidebar } from "./sidebar";

interface Props {
  children: React.ReactNode;
}

export const DashLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-full max-h-screen min-w-full flex">
      <Sidebar />
      <div className="p-3">{children}</div>
    </div>
  );
};
