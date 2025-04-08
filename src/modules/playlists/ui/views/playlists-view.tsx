"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaylistsSection } from "../sections/playlists-section";
import { PlaylistCreateModal } from "../components/playlists-create-modal";

export const PlaylistsView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div className="max-w-[2400px] px-4 mx-auto mb-10 pb-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-bold">Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Collection you have created
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistsSection />
    </div>
  );
};
