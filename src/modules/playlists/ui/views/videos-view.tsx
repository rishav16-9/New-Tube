interface VideosViewProps{
  playlistId: string
}
import { PlaylistHeaderSection } from "../sections/playlist-header-section";
import { VideosSection } from "../sections/videos-section";

export const VideosView = ({playlistId}: VideosViewProps) => {
  return (
    <div className="max-w-screen-md flex flex-col px-4 mb-10 mx-auto gap-y-6 pb-2.5">
      <PlaylistHeaderSection playlistId={playlistId} />
      <VideosSection playlistId={playlistId}/>
    </div>
  );
};
