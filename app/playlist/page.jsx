import YoutubePlaylist from '@/components/YoutubePlaylist';
import Head from 'next/head';

export default function PlaylistPage() {
  return (
    <>
      <Head>
        <title>Official YouTube Playlist – MathsMine3</title>
        <meta name="description" content="Official MathsMine3 playlist for mining focus, concentration, and math immersion." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "MathsMine3 YouTube Playlist",
              "description": "Playlist for MathsMine3",
              "thumbnailUrl": "https://mathsmine3.xyz/MM3_thumbnail.jpg",
              "uploadDate": "2025-04-18",
              "embedUrl": "https://www.youtube.com/embed/videoseries?list=PLVnPpTxW6VSe486FBj1R7mzA2XczNYqXc",
              "publisher": {
                "@type": "Organization",
                "name": "MathsMine3"
              }
            })
          }}
        />
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mt-8 mb-2">Official YouTube Playlist</h1>
        <YoutubePlaylist />
      </div>
    </>
  );
}
