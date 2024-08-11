import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const client = new QueryClient();
const router = createRouter({ routeTree, defaultPreload: "intent" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    <ReactQueryDevtools buttonPosition="top-right" />
  </QueryClientProvider>
);
