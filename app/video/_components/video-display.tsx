'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Fullscreen, MoreVertical, Download, PictureInPicture } from 'lucide-react';

export const VideoDisplay = ({ videoUrl }: { videoUrl: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Format time (mm:ss)
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Toggle play/pause
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            if (!isMuted) {
                setVolume(0);
            } else {
                setVolume(0.7);
                videoRef.current.volume = 0.7;
            }
        }
    };

    // Handle seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seekTime = (parseFloat(e.target.value) / 100) * duration;
        if (videoRef.current) {
            videoRef.current.currentTime = seekTime;
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current?.parentElement?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Toggle Picture-in-Picture
    const togglePip = async () => {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else if (videoRef.current && document.pictureInPictureEnabled) {
            await videoRef.current.requestPictureInPicture();
        }
        setShowMenu(false);
    };

    // Change playback speed
    const changePlaybackRate = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
        }
        setShowMenu(false);
    };

    // Download video
    const downloadVideo = () => {
        const fileName = `video-${new Date().toISOString().slice(0, 10)}.mp4`;
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = fileName;
        a.rel = "noopener noreferrer";

        const event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true
        });
        a.dispatchEvent(event);

        setTimeout(() => {
            URL.revokeObjectURL(videoUrl);
        }, 10000);

        setShowMenu(false);
    };

    // Update progress and time
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setCurrentTime(currentTime);
            setProgress((currentTime / duration) * 100);
        }
    };

    // Initialize video and controls
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);

        // Auto-hide controls
        let timeoutId: NodeJS.Timeout;
        const container = video.parentElement;

        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setShowControls(false), 3000);
        };

        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            timeoutId = setTimeout(() => setShowControls(false), 3000);
        }

        // Close menu when clicking outside
        const handleClickOutside = (e: MouseEvent) => {
            if (showMenu && !(e.target as Element).closest('.video-menu')) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!videoRef.current) return;

            switch (e.key) {
                case ' ':
                    togglePlay();
                    break;
                case 'ArrowRight':
                    video.currentTime += 5;
                    break;
                case 'ArrowLeft':
                    video.currentTime -= 5;
                    break;
                case 'ArrowUp':
                    setVolume(Math.min(volume + 0.1, 1));
                    break;
                case 'ArrowDown':
                    setVolume(Math.max(volume - 0.1, 0));
                    break;
                case 'm':
                    toggleMute();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPlaying, volume, isMuted, showMenu]);

    return (
        <div className="relative h-full w-full rounded-3xl bg-gray-100 border border-gray-200 overflow-hidden">
            <video
                ref={videoRef}
                id="condense-video-player"
                className="h-full w-full object-contain"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Custom Controls */}
            {showControls && (
                <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Progress Bar */}
                    <div className="flex items-center mb-2 space-x-2 text-xs text-white">
                        <span>{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="flex-1 h-1.5 rounded-lg appearance-none bg-purple-700 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Play/Pause Button */}
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-gray-300 transition-colors"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? (
                                    <Pause className="h-6 w-6" />
                                ) : (
                                    <Play className="h-6 w-6" />
                                )}
                            </button>

                            {/* Volume Control */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:text-gray-300 transition-colors"
                                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX className="h-5 w-5" />
                                    ) : (
                                        <Volume2 className="h-5 w-5" />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="flex-1 h-1.5 rounded-lg appearance-none bg-purple-700 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Current Time */}
                            <span className="text-white text-sm">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>

                            {/* Additional Menu (Three Dots) */}
                            <div className="relative video-menu">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="text-white hover:text-gray-300 transition-colors"
                                    aria-label="More options"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>

                                {/* Dropdown Menu */}
                                {showMenu && (
                                    <div className="absolute bottom-10 right-0 w-48 bg-zinc-700 rounded-md shadow-lg z-10">
                                        <div className="py-1">
                                            <button
                                                onClick={downloadVideo}
                                                className="flex items-center px-4 py-2 text-sm text-white hover:bg-zinc-600 w-full text-left"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </button>
                                            <div className="px-4 py-2 border-t border-zinc-600">
                                                <div className="text-sm text-white mb-2">Playback Speed:</div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                                        <button
                                                            key={rate}
                                                            onClick={() => changePlaybackRate(rate)}
                                                            className={`px-2 py-1 text-xs rounded-md text-center ${playbackRate === rate
                                                                ? 'bg-black text-white'
                                                                : 'bg-zinc-600 hover:bg-zinc-500 text-white'
                                                                }`}
                                                        >
                                                            {rate}x
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={togglePip}
                                                className="flex items-center px-4 py-2 text-sm text-white hover:bg-zinc-600 w-full text-left"
                                                disabled={!document.pictureInPictureEnabled}
                                            >
                                                <PictureInPicture className="h-4 w-4 mr-2" />
                                                Picture-in-Picture
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fullscreen Button */}
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-gray-300 transition-colors"
                                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                            >
                                <Fullscreen className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
