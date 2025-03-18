import { AlertTriangleIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../type";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}
export const VideoBanner = ({ status }: VideoBannerProps) => {
  if (status === "ready") return null;

  return (
    <div className="bg-yellow-500  px-4 py-3 rounded-b-xl flex items-center gap-2">
      <AlertTriangleIcon className="size-4 text-black shrink-0" />
      <p className="text-xs md:text-sm font-medium text-black line-clamp-1">
        This Video is still processing
      </p>
    </div>
  );
};
