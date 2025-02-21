import { UseInetersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfinteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchingNextPage: () => void;
}

export const InfinteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchingNextPage,
}: InfinteScrollProps) => {
  const { isIntersecting, targetref } = UseInetersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchingNextPage();
    }
  }, [
    isIntersecting,
    hasNextPage,
    isFetchingNextPage,
    isManual,
    fetchingNextPage,
  ]);
  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <div ref={targetref} className="h-1" />
      {hasNextPage ? (
        <Button
          variant={"secondary"}
          onClick={() => {
            fetchingNextPage();
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
