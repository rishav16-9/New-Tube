import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "../../constants";
import { Skeleton } from "@/components/ui/skeleton";
interface VideoThumbnailProps {
  imageUrl: string | null;
  previewUrl: string | null;
  title: string;
  duration: number;
}

export const VideoThumbnailSkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      <Skeleton className="size-full" />
    </div>
  );
};

const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      {/* thumnail wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        {/* video duration box */}
        <Image
          src={imageUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="h-full w-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      <div className="absolute bottom-2 right-2 text-xs font-medium px-1 py-0.5 bg-black/80 text-white rounded">
        {formatDuration(duration)}
      </div>
    </div>
  );
};

export default VideoThumbnail;
