import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthGuard } from "@/components/guards/auth-guard";
import { DashLayout } from "@/components/layouts/dash-layout";

const RouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

const Root: React.FC = () => {
  return (
    <>
      <AuthGuard>
        <DashLayout>
          <Outlet />
        </DashLayout>
      </AuthGuard>
      <React.Suspense>
        <RouterDevtools position="bottom-right" />
      </React.Suspense>
    </>
  );
};

export const Route = createRootRoute({
  component: Root,
});
