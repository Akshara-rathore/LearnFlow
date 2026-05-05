import React from "react";

const VideoCard = ({ video }) => {
  if (!video) return null;

  return (
    <div
      className="bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition duration-300"
    >
      <img
        src={video.thumbnail || "https://via.placeholder.com/480x270?text=No+Thumbnail"}
        alt={video.title || "Video thumbnail"}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-white text-lg font-semibold line-clamp-2">
          {video.title || "Untitled Video"}
        </h3>

        <p className="text-gray-300 text-sm mt-2">
          {video.channelTitle || "Unknown Channel"}
        </p>

        <p className="text-gray-400 text-sm mt-1">
          {video.duration || "Duration not available"}
        </p>

        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 px-4 py-2 rounded-full bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition"
        >
          Watch Video
        </a>
      </div>
    </div>
  );
};

export default VideoCard;