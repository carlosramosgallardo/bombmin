const YoutubePlaylist = () => {
  return (
    <div className="w-full aspect-video max-w-4xl mx-auto my-8">
      <iframe
        className="w-full h-full rounded-2xl shadow-lg"
        src="https://www.youtube.com/embed/videoseries?si=Vhbjg5EImNTJjRCW&amp;list=PLVnPpTxW6VSe486FBj1R7mzA2XczNYqXc"
        title="YouTube Playlist"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};

export default YoutubePlaylist;
