import type { User, Post } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPublishedPosts() {
  return prisma.post.findMany({
    select: { id: true, body: true, title: true, published: true },
    where: { published: true },
  });
}

export function getPost({
  id,
  userId,
}: Pick<Post, "id"> & {
  userId: User["id"];
}) {
  return prisma.post.findFirst({
    select: { id: true, body: true, title: true, published: true },
    where: { id, userId },
  });
}

export function getPostListItems({ userId }: { userId: User["id"] }) {
  return prisma.post.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPost({
  body,
  title,
  userId,
}: Pick<Post, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function togglePostStatus({
  id,
  publish,
}: Pick<Post, "id"> & { publish: Post["published"] }) {
  return prisma.post.update({
    where: { id },
    data: {
      published: publish,
    },
  });
}

export function deletePost({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return prisma.post.deleteMany({
    where: { id, userId },
  });
}
