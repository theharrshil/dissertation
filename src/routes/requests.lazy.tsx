import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useRequest } from "@/hooks/queries/use-request";

const Requests: React.FC = () => {
  const { data, isError } = useRequest();
  if (isError) {
    return <p>There was some error!</p>;
  }
  if (data) {
    return <div>{JSON.stringify(data)}</div>;
  }
  return <p>...Loading</p>;
};

export const Route = createLazyFileRoute("/requests")({
  component: Requests,
});
