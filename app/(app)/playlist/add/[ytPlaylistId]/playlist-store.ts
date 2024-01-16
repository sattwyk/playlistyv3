import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { PlaylistInfo, VideoInfo } from '@/lib/youtube'

type Tag = {
    tagId?: number,
    title: string,
    color: string,
}

type State = {
    playlist: PlaylistInfo;
    videos: VideoInfo[];
    userTags: Tag[];
    selectedTags: Tag[];
}

type Actions = {
    changeYoutubeVideoPosition: (videos: VideoInfo[]) => void
    addYoutubeVideo: (video: VideoInfo) => void
    changePlaylistTitle: (title: string) => void
    changePlaylistDescription: (desc: string) => void
    addSelectedTag: (tag: Tag) => void
    removeSelectedTag: (tag: Tag) => void
}


export const createPlaylistStore = (initialState: State) => {
    return create<State & Actions>()(immer((set) => ({
        ...initialState,
        changeYoutubeVideoPosition(videos: VideoInfo[]) {
            set((state) => {
                state.videos = videos;
            });
        },
        addYoutubeVideo(video: VideoInfo) {
            set((state) => {
                state.videos.push(video);
            });
        },
        changePlaylistTitle(title: string) {
            set((state) => {
                state.playlist.title = title;
            });
        },
        changePlaylistDescription(desc: string) {
            set((state) => {
                state.playlist.description = desc;
            });
        },
        addSelectedTag(tag: Tag) {
            set((state) => {
                state.selectedTags.push(tag);
            });
        },
        removeSelectedTag(tag: Tag) {
            set((state) => {
                state.selectedTags = state.selectedTags.filter(_tag => _tag.title !== tag.title);
            });
        },
    })))
}

export type PlaylistStore = ReturnType<typeof createPlaylistStore>