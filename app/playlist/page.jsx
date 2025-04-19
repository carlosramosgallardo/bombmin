import YoutubePlaylist from '@/components/YoutubePlaylist';

export default function PlaylistPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="text-center text-gray-600 mb-6">
        Official YouTube Playlist
      </p>
      <YoutubePlaylist />
    </div>
  );
}
