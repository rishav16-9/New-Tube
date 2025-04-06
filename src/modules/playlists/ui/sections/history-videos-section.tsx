"use client";
import { Suspense } from "react";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/component/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/component/video-row-card";

export const HistoryVideosSection = () => {
  return (
    <Suspense fallback={<HistoryVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <HistoryVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const HistoryVideosSectionSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden md:flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size={"compact"} />
        ))}
      </div>
    </div>
  );
};

const HistoryVideosSectionSuspense = () => {
  const [videos, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <div className="hidedn md:flex flex-col gap-4">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};
