import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../type";
import { toast } from "sonner";

interface VideoReactionosProps {
  videoId: string;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
  likes: number;
  dislikes: number;
}
export const VideoReactions = ({
  videoId,
  viewerReaction,
  likes,
  dislikes,
}: VideoReactionosProps) => {
  const clerk = useClerk();
  // const viewerReaction: "like" | "dislike" = "like";
  const utils = trpc.useUtils();
  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const onLikeClick = () => {
    like.mutate({ videoId: videoId });
  };

  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const onDislikeClick = () => {
    dislike.mutate({ videoId: videoId });
  };

  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        onClick={onLikeClick}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes.toString()}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
        onClick={onDislikeClick}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes.toString()}
      </Button>
    </div>
  );
};
