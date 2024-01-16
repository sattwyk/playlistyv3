import { getPlaylistData } from '@/lib/youtube';
import { AddPlaylistForm } from './add-playlist-form';
import { getUserTags } from '@/actions';

export default async function PlaylistAddPage({
  params,
}: {
  params: {
    ytPlaylistId: string;
  };
}) {
  if (params.ytPlaylistId === 'new') {
    return <main className='min-h-full'>new boi</main>;
  }

  const [dataResult, userTagsResult] = await Promise.allSettled([
    getPlaylistData(params.ytPlaylistId),
    getUserTags(),
  ]);

  const data = dataResult.status === 'fulfilled' ? dataResult.value : null;
  const userTags =
    userTagsResult.status === 'fulfilled' ? userTagsResult.value : null;

  if (!data || !data.playlist || !data.videos) {
    return (
      <main className='min-h-full'>
        <p>Not Found</p>
      </main>
    );
  }

  return (
    <main className='min-h-full'>
      <AddPlaylistForm
        videos={data.videos}
        playlist={data.playlist}
        userTags={userTags?.userTags ?? []}
      />
    </main>
  );
}
