import { DEFAULT_LIMIT } from "@/constants";
import { UserView } from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface UserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export const dynamic = "force-dynamic";

const UserPage = async ({ params }: UserPageProps) => {
  const { userId } = await params;
  void trpc.users.getOne.prefetch({ id: userId });
  void trpc.videos.getMany.prefetchInfinite({userId: userId, limit: DEFAULT_LIMIT})
  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default UserPage;
