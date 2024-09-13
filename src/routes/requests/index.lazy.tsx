import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useRequests } from "@/hooks/queries/use-requests";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { RefreshCw, Plus, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/hooks/use-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { network } from "@/lib/utils";

const Page: React.FC = () => {
  const { data, isError, refetch } = useRequests();
  const uid = useAppSelector((state) => state.auth.id);
  const onStatusChange = async (status: string, id: string) => {
    try {
      await network().post(`/requests/status?id=${id}`, { status });
    } catch (e) {
      console.log(e);
    }
  };
  if (isError) {
    return <p>There was some error!</p>;
  }
  if (data) {
    const inbox = data.filter((request) => request.recipient === uid);
    const sent = data.filter((request) => request.sender === uid);
    return (
      <div>
        <div className="border-b border-gray-200 shadow-sm">
          <p className="text-2xl font-semibold p-3">Requests</p>
        </div>
        <div className="px-3">
          <div className="flex items-center space-x-5">
            <div className="my-3 flex items-center">
              <Link to="/requests/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Request
                </Button>
              </Link>
              <Button className="ml-3" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refetch
              </Button>
            </div>
            <p className="font-semibold">Total Requests: {data.length}</p>
          </div>
          <div>
            <p className="text-xl font-semibold">
              Inbox
              <span className="ml-1.5 text-base">({inbox.length})</span>
            </p>
            {inbox.map((request) => (
              <div key={request.id} className="flex items-center space-x-3">
                <div className="p-2 border border-gray-200 rounded-md my-2 flex justify-between w-full">
                  <p>{request.description}</p>
                  <div>
                    <Select
                      defaultValue={request.status}
                      onValueChange={(v) => onStatusChange(v, request.id)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="finished">Finished</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Link to={`/requests/${request.id}`}>
                  <Button variant={"outline"} size={"icon"}>
                    <Info className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xl font-semibold">
              Sent
              <span className="ml-1.5 text-base">({sent.length})</span>
            </p>
            {sent.map((request) => (
              <div key={request.id} className="flex items-center space-x-3">
                <div className="p-2 border border-gray-200 rounded-md my-2 flex justify-between w-full">
                  <p>{request.description}</p>
                  <div>
                    <Badge variant={"outline"} className="capitalize">
                      {request.status}
                    </Badge>
                  </div>
                </div>
                <Link to={`/requests/${request.id}`}>
                  <Button variant={"outline"} size={"icon"}>
                    <Info className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center w-full p-3">
      <Skeleton className="h-16 w-[calc(100vw_-_15.5rem)]" />
    </div>
  );
};

export const Route = createLazyFileRoute("/requests/")({
  component: Page,
});
