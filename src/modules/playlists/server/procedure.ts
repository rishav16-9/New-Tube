import { db } from "@/db";
import {
  playlists,
  playlistVideos,
  users,
  videoReactions,
  videos,
  videoViews,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or, sql } from "drizzle-orm";
import { z } from "zod";
export const playlistsRouter = createTRPCRouter({
  removePlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { playlistId } = input;
      const { id: userId } = ctx.user;

      const [deletedPlaylist] = await db
        .delete(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)))
        .returning();

      if (!deletedPlaylist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deletedPlaylist;
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { playlistId } = input;
      const { id: userId } = ctx.user;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return existingPlaylist;
    }),

  getVideos: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { playlistId, cursor, limit } = input;
      const { id: userId } = ctx.user;

      const [existingPlaylists] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylists) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const videosFromPlaylist = db
        .$with("playlist_videos")
        .as(
          db
            .select({ videoId: playlistVideos.videoId })
            .from(playlistVideos)
            .where(eq(playlistVideos.playlistId, playlistId))
        );

      const data = await db
        .with(videosFromPlaylist)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(
          videosFromPlaylist,
          eq(videos.id, videosFromPlaylist.videoId)
        )
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : undefined;
      return {
        items,
        nextCursor,
      };
    }),
  removeVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { playlistId, videoId } = input;
      const { id: userId } = ctx.user;

      const [existingPlaylists] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylists) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      // check if authorized user if remove from where clause
      // if (existingPlaylists.userId !== userId) {
      //   throw new TRPCError({ code: "FORBIDDEN" });
      // }

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoId));

      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        );
      if (!existingPlaylistVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const [removePlaylistVideo] = await db
        .delete(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        )
        .returning();

      return removePlaylistVideo;
    }),
  addVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { playlistId, videoId } = input;
      const { id: userId } = ctx.user;

      const [existingPlaylists] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylists) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      // check if authorized user if remove from where clause
      // if (existingPlaylists.userId !== userId) {
      //   throw new TRPCError({ code: "FORBIDDEN" });
      // }

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoId));

      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        );
      if (existingPlaylistVideo) {
        throw new TRPCError({ code: "CONFLICT" });
      }
      const [createPlaylistVideo] = await db
        .insert(playlistVideos)
        .values({ playlistId, videoId })
        .returning();

      return createPlaylistVideo;
    }),
  getManyForVideos: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit, videoId } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select({
          ...getTableColumns(playlists),
          videoCount: db.$count(
            playlistVideos,
            eq(playlistVideos.playlistId, playlists.id)
          ),
          user: users,
          constainsVideo: videoId
            ? sql<boolean>`(
          SELECT EXISTS (
            SELECT 1
            FROM ${playlistVideos} pv
            WHERE pv.playlist_id = ${playlists.id} AND pv.video_id = ${videoId}
            )
          )
          `
            : sql<boolean>`false`,
        })
        .from(playlists)
        .innerJoin(users, eq(users.id, userId))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : undefined;
      return {
        items,
        nextCursor,
      };
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select({
          ...getTableColumns(playlists),
          videoCount: db.$count(
            playlistVideos,
            eq(playlistVideos.playlistId, playlists.id)
          ),
          user: users,
          thumbnailUrl: sql<string | null>`(
            SELECT v.thumbnail_url
            from ${playlistVideos} pv
            JOIN ${videos} v ON v.id = pv.video_id
            WHERE pv.playlist_id = ${playlists.id}
            ORDER BY pv.updated_at DESC
            LIMIT 1
          )`,
        })
        .from(playlists)
        .innerJoin(users, eq(users.id, userId))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : undefined;
      return {
        items,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      const { id: userId } = ctx.user;

      const [createPlaylists] = await db
        .insert(playlists)
        .values({
          name,
          userId,
        })
        .returning();

      if (!createPlaylists) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return createPlaylists;
    }),
  getLiked: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            likedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const viewerVideoReactions = db.$with("viewer_video_reactions").as(
        db
          .select({
            videoId: videoReactions.videoId,
            likedAt: videoReactions.updateAt,
          })
          .from(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "like")
            )
          )
      );

      const data = await db
        .with(viewerVideoReactions)
        .select({
          ...getTableColumns(videos),
          user: users,
          likedAt: viewerVideoReactions.likedAt,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(
          viewerVideoReactions,
          eq(videos.id, viewerVideoReactions.videoId)
        )
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewerVideoReactions.likedAt, cursor?.likedAt),
                  and(
                    eq(viewerVideoReactions.likedAt, cursor?.likedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewerVideoReactions.likedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            likedAt: lastItem.likedAt,
          }
        : undefined;
      return {
        items,
        nextCursor,
      };
    }),

  getHistory: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            viewedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;
      const viewerVideoViews = db.$with("viewer_video_views").as(
        db
          .select({
            videoId: videoViews.videoId,
            viewedAt: videoViews.updatedAt,
          })
          .from(videoViews)
          .where(eq(videoViews.userId, userId))
      );

      const data = await db
        .with(viewerVideoViews)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewedAt: viewerVideoViews.viewedAt,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(viewerVideoViews, eq(videos.id, viewerVideoViews.videoId))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewerVideoViews.viewedAt, cursor.viewedAt),
                  and(
                    eq(viewerVideoViews.viewedAt, cursor.viewedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewerVideoViews.viewedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            viewedAt: lastItem.viewedAt,
          }
        : undefined;
      return {
        items,
        nextCursor,
      };
    }),
});
