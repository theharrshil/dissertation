import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useRequests } from "@/hooks/queries/use-requests";
import { Skeleton } from "@/components/ui/skeleton";

const Page: React.FC = () => {
  const { data, isError } = useRequests();
  if (isError) {
    return <p>There was some error!</p>;
  }
  if (data) {
    return <div>{JSON.stringify(data)}</div>;
  }
  return (
    <div className="flex items-center w-full">
      <Skeleton className="h-16 w-[calc(100vw_-_15.5rem)]" />
    </div>
  );
};

export const Route = createLazyFileRoute("/requests")({
  component: Page,
});
