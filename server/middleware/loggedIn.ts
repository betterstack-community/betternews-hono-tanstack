import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Context } from "@/context";

export const loggedIn = createMiddleware<Context>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  await next();
});
