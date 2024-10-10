import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ChevronUpIcon } from "lucide-react";

import { Post } from "@/shared/types";
import { userQueryOptions } from "@/lib/api";
import { cn, relativeTime } from "@/lib/utils";

import { badgeVariants } from "./ui/badge";
import { Card, CardContent, CardTitle } from "./ui/card";

export const PostCard = ({
  post,
  onUpvote,
}: {
  post: Post;
  onUpvote?: (id: number) => void;
}) => {
  const { data: user } = useQuery(userQueryOptions());
  return (
    <Card className="flex items-start justify-start pt-3">
      <button
        onClick={() => {
          onUpvote?.(post.id);
        }}
        className={cn(
          "ml-3 flex flex-col items-center justify-center text-muted-foreground hover:text-primary",
          post.isUpvoted ? "text-primary" : "",
        )}
        disabled={!user}
      >
        <ChevronUpIcon size={20} />
        <span className="text-xs font-medium">{post.points}</span>
      </button>
      <div className="flex grow flex-col justify-between">
        <div className="flex items-start p-3 py-0">
          <div className="flex grow flex-wrap items-center gap-x-2 pb-1">
            <CardTitle className="text-xl font-medium">
              {post.url ? (
                <a
                  href={post.url}
                  className="text-foreground hover:text-primary hover:underline"
                >
                  {post.title}
                </a>
              ) : (
                <Link
                  to={"/"}
                  className="text-foreground hover:text-primary hover:underline"
                >
                  {post.title}
                </Link>
              )}
            </CardTitle>
            {post.url ? (
              <Link
                className={cn(
                  badgeVariants({ variant: "secondary" }),
                  "cursor-pointer text-xs font-normal transition-colors hover:bg-primary/80 hover:underline",
                )}
                to="/"
                search={{ site: post.url }}
              >
                {new URL(post.url).hostname}
              </Link>
            ) : null}
          </div>
        </div>
        <CardContent className="p-3 pt-0">
          {post.content && (
            <p className="mb-2 text-sm text-foreground">{post.content}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground">
            <span>
              by{" "}
              <Link
                className="hover:underline"
                to={"/"}
                search={{ author: post.author.id }}
              >
                {post.author.username}
              </Link>
            </span>
            <span>·</span>
            <span>{relativeTime(post.createdAt)}</span>
            <span>·</span>
            <Link
              to={"/post"}
              search={{ id: post.id }}
              className="hover:underline"
            >
              {post.commentCount} comments
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
