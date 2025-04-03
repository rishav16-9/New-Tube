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
export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: CommentReactionsRouter,
  suggestions: suggestionsRouter,
  search: searchRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
