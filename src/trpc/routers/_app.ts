import { studioRouter } from "@/modules/studio/server/procedure";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedure";
export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  category: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
