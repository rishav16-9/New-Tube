import StudioLayout from "@/modules/studio/ui/layout/studio-layout";

interface StudioLayout {
  children: React.ReactNode;
}
const layout = ({ children }: StudioLayout) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default layout;
