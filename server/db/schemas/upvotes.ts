import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { userTable } from "./auth";
import { commentsTable } from "./comments";
import { postsTable } from "./posts";

export const postUpvotesTable = pgTable("post_upvotes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const postUpvoteRelations = relations(postUpvotesTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [postUpvotesTable.postId],
    references: [postsTable.id],
    relationName: "postUpvotes",
  }),
  user: one(userTable, {
    fields: [postUpvotesTable.userId],
    references: [userTable.id],
    relationName: "user",
  }),
}));

export const commentUpvotesTable = pgTable("comment_upvotes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const commentUpvoteRelations = relations(
  commentUpvotesTable,
  ({ one }) => ({
    post: one(commentsTable, {
      fields: [commentUpvotesTable.commentId],
      references: [commentsTable.id],
      relationName: "commentUpvotes",
    }),
    user: one(userTable, {
      fields: [commentUpvotesTable.userId],
      references: [userTable.id],
      relationName: "user",
    }),
  }),
);
