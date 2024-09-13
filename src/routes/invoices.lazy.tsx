import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/use-store";
import { network } from "@/lib/utils";
import { PlotByProjectId } from "@/components/plot-by-project-id";

const formatDate = (ts: string) => {
  const date = new Date(ts);
  const formattedDate = date.toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Europe/London",
    timeZoneName: "short",
  });
  return formattedDate;
};

const Page: React.FC = () => {
  const role = useAppSelector((state) => state.auth.role);
  const { data } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await network().get(
        role === "buyer" ? "/buyer/invoices" : "/developer/invoices"
      );
      return response.data.data;
    },
  });
  console.log(data);
  if (data)
    return (
      <div className="max-h-screen overflow-y-scroll">
        <div className="border-b border-gray-200 shadow-sm">
          <p className="text-2xl font-semibold p-4">Invoices</p>
        </div>
        <div className="p-3">
          {data.length === 0 ? (
            <div>
              <p>You have not made any payments.</p>
            </div>
          ) : (
            <div className="max-w-2xl bg-gray-100 border border-gray-200 rounded-md shadow-sm">
              <div className="grid grid-cols-4 my-2 px-3 pb-5 border-b border-gray-600">
                <div>Project For</div>
                <p className="font-semibold">Amount</p>
                <p className="col-span-2">Time</p>
              </div>
              {data.map(
                (invoice: {
                  id: string;
                  projectId: string;
                  amount: string | number | boolean;
                  createdAt: string;
                }) => (
                  <div key={invoice.id} className="grid grid-cols-4 my-2 px-3 py-2">
                    <PlotByProjectId id={invoice.projectId} />
                    <p className="font-semibold">£{invoice.amount}</p>
                    <p className="col-span-2">{formatDate(invoice.createdAt)}</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  return <p>Loading...</p>;
};

export const Route = createLazyFileRoute("/invoices")({
  component: Page,
});
