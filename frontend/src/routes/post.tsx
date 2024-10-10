import { PostCard } from "@/components/post-card";
import { getPost } from "@/lib/api";
import { useUpvotePost } from "@/lib/api-hooks";
import { orderSchema, sortBySchema } from "@/shared/types";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

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

export const Route = createFileRoute("/post")({
  component: () => <Post />,
  validateSearch: zodSearchValidator(postSearchSchema),
});

function Post() {
  const { id, sortBy, order } = Route.useSearch();
  const { data } = useSuspenseQuery(postQueryOptions(id));

  const upvotePost = useUpvotePost();

  return (
    <div className="mx-auto max-w-3xl">
      {data && (
        <PostCard
          post={data.data}
          onUpvote={() => upvotePost.mutate(id.toString())}
        />
      )}
    </div>
  );
}
