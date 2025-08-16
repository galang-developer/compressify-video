import { FFmpeg } from "@ffmpeg/ffmpeg";
import { FileActions, VideoInputSettings } from "./types";
import { fetchFile } from "@ffmpeg/util";
import { customVideoCompressionCommand } from "./ffmpegCommands";

const translations = {
  en: {
    hours: "hr",
    minutes: "min",
    seconds: "sec",
    errorLargeFile: "File is too large, please use a smaller file",
    errorConverting: "Error converting video, trying simpler method..."
  },
  id: {
    hours: "jam",
    minutes: "menit",
    seconds: "detik",
    errorLargeFile: "File terlalu besar, mohon gunakan file lebih kecil",
    errorConverting: "Error mengkonversi video, mencoba metode lebih sederhana..."
  }
};

export function getFileExtension(fileName: string) {
    return fileName.split('.').pop()?.toLowerCase() || '';
}

export function removeFileExtension(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, "");
}

export default async function convertFile(
    ffmpeg: FFmpeg,
    actionFile: FileActions,
    videoSettings: VideoInputSettings
): Promise<any> {
    const { file, fileName } = actionFile;
    const output = removeFileExtension(fileName) + "_compressed." + videoSettings.videoType.toLowerCase();
    
    await ffmpeg.writeFile(fileName, await fetchFile(file));
    
    const command = customVideoCompressionCommand(fileName, output, videoSettings);

    console.log("Executing FFmpeg command:", command.join(" "));
    await ffmpeg.exec(command);
    
    // Read output file
    const data = await ffmpeg.readFile(output);
    const blob = new Blob([data as unknown as BlobPart], { type: `video/${videoSettings.videoType.toLowerCase()}` });
    const url = URL.createObjectURL(blob);
    
    return { url, output, outputBlob: blob };
}

export const formatTime = (seconds: number): string => {
  const userLanguage = navigator?.language || 'en';
  const language = userLanguage.startsWith('id') ? 'id' : 'en';
  const t = translations[language];

  seconds = Math.round(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return [
    hours > 0 ? `${hours} ${t.hours}` : null,
    minutes > 0 ? `${minutes} ${t.minutes}` : null,
    `${remainingSeconds} ${t.seconds}`
  ].filter(Boolean).join(" ");
};
