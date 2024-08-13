import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { z } from "zod";
import { NameById } from "@/components/name-by-id";
import { PlotById } from "@/components/plot-by-id";

const Validator = z.object({
  data: z.object({
    createdAt: z.string(),
    id: z.string(),
    message: z.string().nullable(),
    recipient: z.string(),
    status: z.string(),
    description: z.string(),
    sender: z.string(),
    plotId: z.string().nullable(),
  }),
  success: z.boolean(),
});

const Page: React.FC = () => {
  const { requestId } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["requests", requestId],
    queryFn: async () => {
      try {
        const response = await network().get(`/requests?id=${requestId}`);
        const parsed = Validator.safeParse(response.data);
        if (parsed.success) {
          return parsed.data.data;
        } else {
          throw new Error("error in parsing the data");
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
  if (data) {
    const local = new Date(
      new Date(data.createdAt).toLocaleString("en-GB", { timeZone: "Europe/London" })
    );
    return (
      <div>
        <div className="border-b border-gray-200 shadow-sm">
          <p className="text-2xl font-semibold p-3">Information of your request</p>
        </div>
        <div className="p-3 space-y-2 capitalize">
          <p>Request Status: {data.status}</p>
          <div className="flex">
            Sent By: <NameById id={data.sender} />
          </div>
          <div className="flex">
            Receiver: <NameById id={data.recipient} />
          </div>
          {data.plotId && (
            <div className="flex">
              Property in Question: <PlotById id={data.plotId} />
            </div>
          )}
          <p>Description: {data.description}</p>
          <p>Sent on: {local.toDateString()}</p>
          {data.message && <p>Response: {data.message}</p>}
        </div>
      </div>
    );
  }
  return <p className="p-3">Loading...</p>;
};

export const Route = createLazyFileRoute("/requests/$requestId")({
  component: Page,
});
