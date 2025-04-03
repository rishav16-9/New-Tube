"use client";

import { Suspense } from "react";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { ErrorBoundary } from "react-error-boundary";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "../component/video-row-card";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "../component/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface SuggestionSectionProps {
  videoId: string;
  isManual?: boolean;
}

export const SuggestionSection = ({
  videoId,
  isManual,
}: SuggestionSectionProps) => {
  return (
    <Suspense fallback={<SuggestionSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SuggestionSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const SuggestionSectionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
      </div>
      <div className="block md:hidden space-y-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

export const SuggestionSectionSuspense = ({
  videoId,
  isManual,
}: SuggestionSectionProps) => {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId: videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
          ))
        )}
      </div>
      <div className="block md:hidden space-y-10">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))
        )}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};
