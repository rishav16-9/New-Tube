import { studioRouter } from "@/modules/studio/server/procedure";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedure";
import { videoViewsRouter } from "@/modules/video-views/server/procedure";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedure";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedure";
import { commentsRouter } from "@/modules/comments/server/procedure";
import { CommentReactionsRouter } from "@/modules/comment-reactions/server/procedure";
import { suggestionsRouter } from "@/modules/suggestions/server/procedure";
import { searchRouter } from "@/modules/search/server/procedure";
import { playlistsRouter } from "@/modules/playlists/server/procedure";
import { usersRouter } from "@/modules/users/server/procedure";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  commentReactions: CommentReactionsRouter,
  comments: commentsRouter,
  playlists: playlistsRouter,
  search: searchRouter,
  studio: studioRouter,
  subscriptions: subscriptionsRouter,
  suggestions: suggestionsRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  videos: videosRouter,
  users: usersRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
