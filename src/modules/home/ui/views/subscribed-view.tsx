import { SubscribedVideosSection } from "../sections/subscribed-videos-section";

export const SubscribedView = () => {
  return (
    <div className="max-w-[2400px] px-4 mx-auto mb-10 pb-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-xs text-muted-foreground ">
          Video from your favoirate creator
        </p>
      </div>
      <SubscribedVideosSection />
    </div>
  );
};
