import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePost, getPost, togglePostStatus } from "~/models/post.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId, userId });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  if (request.method === "PATCH") {
    const formData = await request.formData();
    return togglePostStatus({
      id: params.postId,
      publish: formData.get("publish") === "true",
    });
  }

  if (request.method === "POST") {
    await deletePost({ id: params.postId, userId });

    return redirect("/posts");
  }
};

export default function PostDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">{data.post.title}</h3>
        <fetcher.Form method="patch">
          <button
            aria-label={
              data.post.published ? "Remove from Published" : "Add to Published"
            }
            className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
            name="publish"
            value={data.post.published ? "false" : "true"}
          >
            {data.post.published ? "UnPublish" : "Publish"}
          </button>
        </fetcher.Form>
      </div>
      <p className="py-6">{data.post.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Post not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
