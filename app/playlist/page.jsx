import YoutubePlaylist from '@/components/YoutubePlaylist';

export default function PlaylistPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">🎧 Playlist oficial de MathsMine3</h1>
      <p className="text-center text-gray-600 mb-6">
        Música para concentrarte, minar ideas y resolver ecuaciones. Disfruta mientras juegas o exploras el portal.
      </p>
      <YoutubePlaylist />
    </div>
  );
}
