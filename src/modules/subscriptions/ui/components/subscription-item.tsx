import UserAvatar from "@/components/user-avatar";
import { SubscriptionButton } from "./subscription-button";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionItemProps {
  name: string;
  imageUrl: string;
  subscriberCount: number;
  disabled: boolean;
  onUnsubscribe: () => void;
}

export const SubscriptionItemSkeleton = () => {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="rounded-full size-10" />
      <div className="felx-1">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-24 mt-3" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
};

export const SubscriptionItem = ({
  name,
  imageUrl,
  subscriberCount,
  onUnsubscribe,
  disabled,
}: SubscriptionItemProps) => {
  return (
    <div className="flex items-start gap-4">
      <UserAvatar size="lg" name={name} imageUrl={imageUrl} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs">{name}</h3>
            <p className="text-xs text-muted-foreground">
              {subscriberCount.toLocaleString()} subscriber
            </p>
          </div>
          <div>
            <SubscriptionButton
              size={"sm"}
              onClick={(e) => {
                e.preventDefault();
                onUnsubscribe();
              }}
              disabled={disabled}
              isSubscribed
            />
          </div>
        </div>
      </div>
    </div>
  );
};
