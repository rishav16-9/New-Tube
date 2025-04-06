import { LikedVideosSection } from "../sections/liked-videos-section";

export const LikedView = () => {
  return (
    <div className="max-w-screen-md flex flex-col pb-2.5 px-4 mx-auto mb-10 gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Liked</h1>
        <p className="text-xs text-muted-foreground">Videos you have liked</p>
      </div>
      <LikedVideosSection />
    </div>
  );
};
