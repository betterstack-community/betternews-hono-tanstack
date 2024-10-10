import { hc, InferResponseType } from "hono/client";
import type {
  ApiRoutes,
  ErrorResponse,
  Order,
  SortBy,
  SuccessResponse,
} from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";
const client = hc<ApiRoutes>("/", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;

export const postSignup = async (username: string, password: string) => {
  try {
    const res = await client.auth.signup.$post({
      form: {
        username,
        password,
      },
    });
    if (res.ok) {
      const data = (await res.json()) as SuccessResponse;
      return data;
    }
    const data = (await res.json()) as unknown as ErrorResponse;
    return data;
  } catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
};

export const postLogin = async (username: string, password: string) => {
  try {
    const res = await client.auth.login.$post({
      form: {
        username,
        password,
      },
    });
    if (res.ok) {
      const data = (await res.json()) as SuccessResponse;
      return data;
    }
    const data = (await res.json()) as unknown as ErrorResponse;
    return data;
  } catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
};

export type GetPostsSuccess = InferResponseType<typeof client.posts.$get>;
export const getPosts = async ({
  pageParam = 1,
  pagination,
}: {
  pageParam: number;
  pagination: {
    sortBy?: SortBy;
    order?: Order;
    author?: string;
    site?: string;
  };
}) => {
  const res = await client.posts.$get({
    query: {
      page: pageParam.toString(),
      sortBy: pagination.sortBy,
      order: pagination.order,
      author: pagination.author,
      site: pagination.site,
    },
  });
  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = await res.json();
  return data;
};

export const getUser = async () => {
  const res = await client.auth.user.$get();
  if (res.ok) {
    const data = await res.json();
    return data.data.username;
  }
  return null;
};
export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
  });

export async function upvotePost(id: string) {
  const res = await client.posts[":id"].upvote.$post({
    param: {
      id,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  const data = (await res.json()) as unknown as ErrorResponse;
  throw new Error(data.error);
}

export const postSubmit = async (
  title: string,
  url: string,
  content: string,
) => {
  try {
    const res = await client.posts.$post({
      form: {
        title,
        url,
        content,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    const data = (await res.json()) as unknown as ErrorResponse;
    return data;
  } catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
};
