import { getFileExtension } from "./convert";
import { VideoFormats, VideoInputSettings, QualityType } from "./types";

export const whatsappStatusCompressionCommand = (
    input: string,
    output: string,
    removeAudio: boolean = false
) => {
    const baseCommand = [
        "-i",
        input,
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "28",
        "-maxrate",
        "2000k",
        "-bufsize",
        "2000k",
        "-fs",
        "9M",
        "-movflags",
        "faststart"
    ];

    if (!removeAudio) {
        baseCommand.push("-c:a", "aac", "-b:a", "128k");
    } else {
        baseCommand.push("-an");
    }

    baseCommand.push(output);
    return baseCommand;
};

export const twitterCompressionCommand = (
    input: string, 
    output: string,
    removeAudio: boolean = false
) => {
    const baseCommand = [
        "-i",
        input,
        "-c:v",
        "libx264",
        "-profile:v",
        "high",
        "-level:v",
        "4.2",
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        "-movflags",
        "faststart",
        "-maxrate",
        "8000k",
        "-bufsize",
        "8000k",
        "-tune",
        "film",
        "-crf",
        "18"
    ];

    if (!removeAudio) {
        baseCommand.push("-c:a", "aac", "-b:a", "256k");
    } else {
        baseCommand.push("-an");
    }

    baseCommand.push(output);
    return baseCommand;
};

export const customVideoCompressionCommand = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
): string[] => {
    const inputType = getFileExtension(input);
    const format = videoSettings.videoType.toLowerCase();
    const finalOutput = input === output
        ? `${input.replace(/\.[^/.]+$/, '')}_compressed.${format}`
        : output;

    if (videoSettings.twitterCompressionCommand) {
        return twitterCompressionCommand(input, finalOutput, videoSettings.removeAudio);
    }
    if (videoSettings.whatsappStatusCompressionCommand) {
        return whatsappStatusCompressionCommand(input, finalOutput, videoSettings.removeAudio);
    }

    switch (videoSettings.videoType) {
        case VideoFormats.MP4:
            return getMP4Command(input, finalOutput, videoSettings);
        case VideoFormats.AVI:
            return getAVICommand(input, finalOutput, videoSettings);
        case VideoFormats.MKV:
            return getMKVCommand(input, finalOutput, videoSettings);
        case VideoFormats.MOV:
            return getMOVCommand(input, finalOutput, videoSettings);
        case VideoFormats.FLV:
            return getFLVCommand(input, finalOutput, videoSettings);
        // case VideoFormats.WEBM:
            // return getWEBMCommand(input, finalOutput, videoSettings);
            // return getOptimizedWEBMCommand(input, finalOutput, videoSettings);
        default:
            return getDefaultCommand(input, finalOutput, videoSettings);
    }
};

const getMP4Command = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
) => {
    const ffmpegCommand = [
        "-i",
        input,
        "-c:v",
        "libx264",
        "-profile:v",
        "high",
        "-level:v",
        "4.2",
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        "-maxrate",
        videoSettings.quality === QualityType.High ? "10000k" :
        videoSettings.quality === QualityType.Medium ? "5000k" : "2000k",
        "-bufsize",
        videoSettings.quality === QualityType.High ? "10000k" :
        videoSettings.quality === QualityType.Medium ? "5000k" : "2000k",
        "-tune",
        "film",
        "-ss",
        videoSettings.customStartTime.toString(),
        "-to",
        videoSettings.customEndTime.toString(),
        "-crf",
        videoSettings.quality,
        "-preset",
        videoSettings.quality === QualityType.High ? "slow" :
        videoSettings.quality === QualityType.Medium ? "medium" : "fast",
    ];

    if (!videoSettings.removeAudio) {
        ffmpegCommand.push("-c:a", "aac", "-b:a", 
            videoSettings.quality === QualityType.High ? "256k" :
            videoSettings.quality === QualityType.Medium ? "192k" : "128k");
    } else {
        ffmpegCommand.push("-an");
    }
    
    ffmpegCommand.push("-movflags", "faststart", output);
    return ffmpegCommand;
};

const getMOVCommand = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
) => {
    const ffmpegCommand = [
        "-i",
        input,
        "-c:v",
        "libx264",
        "-crf",
        videoSettings.quality,
        "-preset",
        videoSettings.quality === QualityType.High ? "slow" :
        videoSettings.quality === QualityType.Medium ? "medium" : "fast",
        "-vf",
        `trim=start=${videoSettings.customStartTime}:end=${videoSettings.customEndTime}`,
    ];

    if (!videoSettings.removeAudio) {
        ffmpegCommand.push("-c:a", "aac", "-b:a", 
            videoSettings.quality === QualityType.High ? "256k" :
            videoSettings.quality === QualityType.Medium ? "192k" : "128k");
    } else {
        ffmpegCommand.push("-an");
    }
    
    ffmpegCommand.push(output);
    return ffmpegCommand;
};

const getMKVCommand = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
) => {
    const ffmpegCommand = [
        "-i",
        input,
        "-c:v",
        "libx264",
        "-crf",
        videoSettings.quality,
        "-preset",
        videoSettings.quality === QualityType.High ? "slow" :
        videoSettings.quality === QualityType.Medium ? "medium" : "fast",
        "-vf",
        `trim=start=${videoSettings.customStartTime}:end=${videoSettings.customEndTime}`,
    ];

    if (!videoSettings.removeAudio) {
        ffmpegCommand.push("-c:a", "aac", "-b:a", 
            videoSettings.quality === QualityType.High ? "256k" :
            videoSettings.quality === QualityType.Medium ? "192k" : "128k");
    } else {
        ffmpegCommand.push("-an");
    }
    
    ffmpegCommand.push(output);
    return ffmpegCommand;
};

const getAVICommand = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
) => {
    const ffmpegCommand = [
        "-i", 
        input,
        "-c:v", 
        "mpeg4",
        "-q:v", 
        videoSettings.quality === QualityType.High ? "2" :
        videoSettings.quality === QualityType.Medium ? "4" : "6",
        "-vf", 
        `trim=start=${videoSettings.customStartTime}:end=${videoSettings.customEndTime}`,
    ];

    if (!videoSettings.removeAudio) {
        ffmpegCommand.push("-c:a", "libmp3lame", "-b:a", 
            videoSettings.quality === QualityType.High ? "192k" :
            videoSettings.quality === QualityType.Medium ? "128k" : "96k");
    } else {
        ffmpegCommand.push("-an");
    }
    
    ffmpegCommand.push("-f", "avi", output);
    return ffmpegCommand;
};

const getFLVCommand = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
) => {
    const ffmpegCommand = [
        "-i", 
        input,
        "-c:v", 
        "flv1",
        "-q:v", 
        videoSettings.quality === QualityType.High ? "3" :
        videoSettings.quality === QualityType.Medium ? "5" : "7",
        "-vf", 
        `trim=start=${videoSettings.customStartTime}:end=${videoSettings.customEndTime}`,
    ];

    if (!videoSettings.removeAudio) {
        ffmpegCommand.push("-c:a", "libmp3lame", "-b:a", 
            videoSettings.quality === QualityType.High ? "128k" :
            videoSettings.quality === QualityType.Medium ? "96k" : "64k");
    } else {
        ffmpegCommand.push("-an");
    }
    
    ffmpegCommand.push("-f", "flv", output);
    return ffmpegCommand;
};

const getWEBMCommand = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
) => {
    const ffmpegCommand = [
        "-i", 
        input,
        "-c:v", 
        "libvpx-vp9",
        "-crf", 
        videoSettings.quality === QualityType.High ? "30" :
        videoSettings.quality === QualityType.Medium ? "35" : "40",
        "-b:v", 
        "0",
        "-row-mt", 
        "1",
        "-tile-columns", 
        "4",
        "-frame-parallel", 
        "1",
        "-vf", 
        `trim=start=${videoSettings.customStartTime}:end=${videoSettings.customEndTime}`,
    ];

    if (!videoSettings.removeAudio) {
        ffmpegCommand.push("-c:a", "libvorbis", "-b:a", 
            videoSettings.quality === QualityType.High ? "128k" :
            videoSettings.quality === QualityType.Medium ? "96k" : "64k");
    } else {
        ffmpegCommand.push("-an");
    }
    
    ffmpegCommand.push("-f", "webm", output);
    return ffmpegCommand;
};

const getOptimizedWEBMCommand = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
) => {
    const ffmpegCommand = [
        "-i", 
        input,
        "-c:v", 
        "libvpx-vp9",
        "-crf", 
        videoSettings.quality === QualityType.High ? "32" :
        videoSettings.quality === QualityType.Medium ? "37" : "42",
        "-b:v", 
        "0",
        "-row-mt", 
        "1",
        "-cpu-used", "3",
        "-deadline", "good",
        "-auto-alt-ref", "0",
        "-lag-in-frames", "0",
        "-vf", 
        `scale='min(1280,iw)':-2:flags=lanczos,trim=start=${videoSettings.customStartTime}:end=${videoSettings.customEndTime}`,
        "-fs", 
        "15M",
        "-threads", "2"
    ];

    if (!videoSettings.removeAudio) {
        ffmpegCommand.push(
            "-c:a", 
            "libopus",
            "-b:a", 
            videoSettings.quality === QualityType.High ? "96k" :
            videoSettings.quality === QualityType.Medium ? "64k" : "48k",
            "-application", "audio",
            "-frame_duration", "60"
        );
    } else {
        ffmpegCommand.push("-an");
    }
    
    ffmpegCommand.push("-f", "webm", output);
    return ffmpegCommand;
};

const getDefaultCommand = (
    input: string,
    output: string,
    videoSettings: VideoInputSettings
) => {
    const ffmpegCommand = [
        "-i", 
        input,
        "-c:v", 
        "copy",
    ];

    if (!videoSettings.removeAudio) {
        ffmpegCommand.push("-c:a", "copy");
    } else {
        ffmpegCommand.push("-an");
    }
    
    ffmpegCommand.push(output);
    return ffmpegCommand;
};