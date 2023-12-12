import { json, type LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getPublishedPosts } from "~/models/post.server";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Posts" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const postListItems = await getPublishedPosts();
  return json({ postListItems });
};

export default function Index() {
  const user = useOptionalUser();
  const { postListItems } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to="/">Posts</Link>
        </h1>

        <div className="flex justify-center gap-2 items-center">
          {user ? (
            <>
              <Link
                to="/posts"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-2 py-2 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-2"
              >
                View Posts for {user.email}
              </Link>
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                >
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Link
                to="/join"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="relative flex h-full bg-white sm:flex flex-col sm:items-center sm:justify-center">
        <div className="w-full sm:w-3/6 flex flex-col gap-4">
          {postListItems.map((post) => (
            <div
              key={post.id}
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="flex justify-between items-center">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {post.title}
                </h5>
                {/* <h6>{post}</h6> */}
              </div>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {post.body}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
