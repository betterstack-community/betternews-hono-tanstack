import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ReactDOM from "react-dom/client";

import { routeTree } from "./routeTree.gen";

import "./globals.css";

import { Loader2Icon } from "lucide-react";

import { ErrorComponent } from "./components/error-component";
import { NotFound } from "./components/not-found";

const queryClient = new QueryClient();
// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient },
  defaultPendingComponent: () => (
    <div className="mx-auto mt-8 flex flex-col items-center justify-center">
      <Loader2Icon className="animate-spin" />
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  ),
  defaultNotFoundComponent: NotFound,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
