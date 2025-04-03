import { Toaster } from "@/components/ui/sonner";
import StudioLayout from "@/modules/studio/ui/layout/studio-layout";
export const dynamic = "force-dynamic";
interface StudioLayout {
  children: React.ReactNode;
}
const layout = ({ children }: StudioLayout) => {
  return (
    <StudioLayout>
      <Toaster />
      {children}
    </StudioLayout>
  );
};

export default layout;
