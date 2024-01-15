import { getPlaylist, getUserTags } from '@/actions';
import { Sidebar as SIDEBAR } from './sidebar';
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export async function Sidebar({ className }: SidebarProps) {
  const [playlistsResult, userTagsResult] = await Promise.allSettled([
    getPlaylist(),
    getUserTags(),
  ]);

  const playlists =
    playlistsResult.status === 'fulfilled' ? playlistsResult.value : null;
  const userTags =
    userTagsResult.status === 'fulfilled' ? userTagsResult.value : null;

  return (
    <SIDEBAR
      className={className}
      playlists={playlists?.userPlaylists ?? []}
      userTags={userTags?.userTags ?? []}
    />
  );
}

export function SidebarFallback() {
  return null;
}
