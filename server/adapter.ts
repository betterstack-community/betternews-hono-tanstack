import { drizzle } from "drizzle-orm/postgres-js";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import postgres from "postgres";
import { z } from "zod";

import { sessionTable, userRelations, userTable } from "./db/schemas/auth";
import { commentRelations, commentsTable } from "./db/schemas/comments";
import { postsRelations, postsTable } from "./db/schemas/posts";
import {
  commentUpvoteRelations,
  commentUpvotesTable,
  postUpvoteRelations,
  postUpvotesTable,
} from "./db/schemas/upvotes";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const processEnv = EnvSchema.parse(process.env);

const queryClient = postgres(processEnv.DATABASE_URL);
export const db = drizzle(queryClient, {
  schema: {
    user: userTable,
    session: sessionTable,
    posts: postsTable,
    comments: commentsTable,
    postUpvotes: postUpvotesTable,
    commentUpvoted: commentUpvotesTable,
    postsRelations,
    commentUpvoteRelations,
    postUpvoteRelations,
    userRelations,
    commentRelations,
  },
});

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable,
);
