import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/site-header";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-[#f5f5ed] text-foreground">
        <Header />
        <main className="container mx-auto grow p-4">
          <Outlet />
        </main>
        <footer className="p-4 text-center">
          <p className="text-sm text-muted-foreground">BetterNews &copy;</p>
        </footer>
      </div>
      <Toaster />
      <ReactQueryDevtools />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
