"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

const ProfileSection = () => {
  const items = [
    { title: "Content", url: "/content", auth: true, icon: VideoIcon },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((items) => (
            <SidebarMenuItem key={items.title}>
              <SidebarMenuButton
                tooltip={items.title}
                asChild
                isActive={false}
                // onClick={() => {}}
              >
                <Link href={items.url} className="flex items-center gap-4">
                  <items.icon />
                  <span className="text-sm">{items.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default ProfileSection;
