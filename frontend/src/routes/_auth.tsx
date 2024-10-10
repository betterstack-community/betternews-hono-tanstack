import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/api";

export const Route = createFileRoute("/_auth")({
  component: () => <Outlet />,
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});
