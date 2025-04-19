import YoutubePlaylist from '@/components/YoutubePlaylist';

export default function PlaylistPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mt-8 mb-2">Official YouTube Playlist</h1>
      <YoutubePlaylist />
    </div>
  );
}
