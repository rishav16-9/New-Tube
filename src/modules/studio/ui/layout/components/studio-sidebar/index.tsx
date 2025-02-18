import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import ProfileSection from "./profile-section";
import { Separator } from "@/components/ui/separator";
import ExitStudio from "./exit-studio";

const StudioSidebar = () => {
  return (
    <Sidebar className="border-none pt-16 z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <ProfileSection />
        <Separator />
        <ExitStudio />
      </SidebarContent>
    </Sidebar>
  );
};

export default StudioSidebar;
