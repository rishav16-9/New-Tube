import { Toaster } from "@/components/ui/sonner";
import HomeLayout from "@/modules/home/ui/layouts/home-layout";
interface layoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: layoutProps) => {
  return (
    <HomeLayout>
      <Toaster />
      {children}
    </HomeLayout>
  );
};

export default Layout;
