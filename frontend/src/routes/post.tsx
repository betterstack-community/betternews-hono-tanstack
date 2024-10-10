import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  infiniteQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";

import { ChevronDownIcon } from "lucide-react";
import { z } from "zod";

import { orderSchema, sortBySchema } from "@/shared/types";
import { getComments, getPost, userQueryOptions } from "@/lib/api";
import { useUpvoteComment, useUpvotePost } from "@/lib/api-hooks";
import { Card, CardContent } from "@/components/ui/card";
import { CommentCard } from "@/components/comment-card";
import { CommentForm } from "@/components/comment-form";
import { PostCard } from "@/components/post-card";
import { SortBar } from "@/components/sort-bar";

const postSearchSchema = z.object({
  id: fallback(z.number(), 0).default(0),
  sortBy: fallback(sortBySchema, "points").default("points"),
  order: fallback(orderSchema, "desc").default("desc"),
});

const postQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    staleTime: Infinity,
    retry: false,
    throwOnError: true,
  });

const commentsInfiniteQueryOptions = ({
  id,
  sortBy,
  order,
}: z.infer<typeof postSearchSchema>) =>
  infiniteQueryOptions({
    queryKey: ["comments", "post", id, sortBy, order],
    queryFn: ({ pageParam }) =>
      getComments(id, pageParam, 10, {
        sortBy,
        order,
      }),
    initialPageParam: 1,
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

export const Route = createFileRoute("/post")({
  component: () => <Post />,
  validateSearch: zodSearchValidator(postSearchSchema),
  loaderDeps: ({ search: { id, sortBy, order } }) => ({ id, sortBy, order }),
  loader: async ({ context, deps: { id, sortBy, order } }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(postQueryOptions(id)),
      context.queryClient.ensureInfiniteQueryData(
        commentsInfiniteQueryOptions({ id, sortBy, order }),
      ),
    ]);
  },
});

function Post() {
  const { id, sortBy, order } = Route.useSearch();
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const { data } = useSuspenseQuery(postQueryOptions(id));
  const { data: user } = useQuery(userQueryOptions());
  const {
    data: comments,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    commentsInfiniteQueryOptions({ id, sortBy, order }),
  );

  const upvotePost = useUpvotePost();
  const upvoteComment = useUpvoteComment();

  return (
    <div className="mx-auto max-w-3xl">
      {data && (
        <PostCard
          post={data.data}
          onUpvote={() => upvotePost.mutate(id.toString())}
        />
      )}
      <div className="mb-4 mt-8">
        {comments && comments.pages[0].data.length > 0 && (
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Comments
          </h2>
        )}
        {user && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <CommentForm id={id} />
            </CardContent>
          </Card>
        )}
        {comments && comments.pages[0].data.length > 0 && (
          <SortBar sortBy={sortBy} order={order} />
        )}
      </div>
      {comments && comments.pages[0].data.length > 0 && (
        <Card>
          <CardContent className="p-4">
            {comments.pages.map((page) =>
              page.data.map((comment, index) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  depth={0}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  isLast={index === page.data.length - 1}
                  toggleUpvote={upvoteComment.mutate}
                />
              )),
            )}
            {hasNextPage && (
              <div className="mt-2">
                <button
                  className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    fetchNextPage();
                  }}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <ChevronDownIcon size={12} />
                      <span>More replies</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
