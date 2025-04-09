import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CheckSquareIcon, Loader2Icon, SquareIcon } from "lucide-react";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export const PlaylistAddModal = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModalProps) => {
  const utils = trpc.useUtils();
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.playlists.getManyForVideos.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      videoId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open,
    }
  );

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video added to playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideos.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ playlistId: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideos.invalidate({ videoId });
      utils.playlists.getOne.invalidate({ playlistId: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 text-muted-foreground animate-spin" />
          </div>
        )}
        {playlists?.pages
          .flatMap((page) => page.items)
          .map((playlist) => (
            <Button
              key={playlist.id}
              variant="ghost"
              size="lg"
              className="w-full justify-start px-2 [&_svg]:size-5"
              onClick={() => {
                if (playlist.constainsVideo) {
                  removeVideo.mutate({
                    playlistId: playlist.id,
                    videoId,
                  });
                } else {
                  addVideo.mutate({
                    playlistId: playlist.id,
                    videoId,
                  });
                }
              }}
              disabled={addVideo.isPending || removeVideo.isPending}
            >
              {playlist?.constainsVideo ? (
                <CheckSquareIcon className="mr-2" />
              ) : (
                <SquareIcon className="mr-2" />
              )}
              {playlist.name}
            </Button>
          ))}
        {!isLoading && (
          <InfiniteScroll
            isManual
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
    </ResponsiveModal>
  );
};
