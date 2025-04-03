import { UseInetersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) => {
  const { isIntersecting, targetref } = UseInetersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    isIntersecting,
    hasNextPage,
    isFetchingNextPage,
    isManual,
    fetchNextPage,
  ]);
  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <div ref={targetref} className="h-1" />
      {hasNextPage ? (
        <Button
          variant={"secondary"}
          onClick={() => {
            fetchNextPage();
          }}
          disabled={isFetchingNextPage || !hasNextPage}
        >
          {isFetchingNextPage ? "Loading.." : "Load More"}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">Reached Last </p>
      )}
    </div>
  );
};
