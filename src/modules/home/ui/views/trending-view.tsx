import { FlameIcon } from "lucide-react";
import { TrendingVideosSection } from "../sections/trending-videos-section";

export const TrendingView = () => {
  return (
    <div className="max-w-[2400px] px-4 mx-auto mb-10 pb-2.5 flex flex-col gap-y-6 ">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-x-2">
          Trending
          <FlameIcon fill="orange" className="size-6  animate-bounce" />
        </h1>
        <p className="text-xs text-muted-foreground ">
          Most popular videos at the moment
        </p>
      </div>
      <TrendingVideosSection />
    </div>
  );
};
