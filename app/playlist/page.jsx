import YoutubePlaylist from '@/components/YoutubePlaylist';

export default function PlaylistPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Official YouTube Playlist</h1>
      <YoutubePlaylist />
    </div>
  );
}
