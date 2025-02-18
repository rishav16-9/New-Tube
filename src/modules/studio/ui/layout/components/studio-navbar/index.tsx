import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 flex items-center bg-white px-2 pr-5 z-50">
      <div className="flex justify-between items-center w-full gap-4">
        {/* sidebar and logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/studio">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" alt={"logo"} height={32} width={32} />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>
        {/* button and profile */}
        <div className="p-4 flex items-center gap-4">
          <Button variant={"secondary"}>
            <PlusIcon /> Create
          </Button>
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default StudioNavbar;
