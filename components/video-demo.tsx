import React from "react";

const VideoDemo = () => (
  <div className="flex justify-center px-6">
    <div className="relative w-full max-w-[800px] h-[400px] rounded-3xl border-8 border-gray-200 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/demo.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  </div>
);

export default VideoDemo;
