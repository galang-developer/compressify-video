import {
    bytesToSize,
    calculateBlobSize,
    reduceSize,
} from "@/utils/bytesToSize";
import { formatTime } from "@/utils/convert";
import { FileActions } from "@/utils/types";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";

type Language = 'en' | 'id';

type Translations = {
    outputFile: string;
    download: string;
    newFileSize: string;
    sizeReducedPercent: string;
    originalFileSize: string;
    sizeReduced: string;
    timeTaken: string;
    notAvailable: string;
};

const translations: Record<Language, Translations> = {
    en: {
        outputFile: "Output file",
        download: "Download",
        newFileSize: "New file size",
        sizeReducedPercent: "Size Reduced",
        originalFileSize: "Original file size",
        sizeReduced: "Size Reduced",
        timeTaken: "Time taken",
        notAvailable: "-"
    },
    id: {
        outputFile: "File hasil",
        download: "Unduh",
        newFileSize: "Ukuran file baru",
        sizeReducedPercent: "Pengurangan ukuran",
        originalFileSize: "Ukuran file asli",
        sizeReduced: "Pengurangan ukuran",
        timeTaken: "Waktu proses",
        notAvailable: "-"
    }
};

type VideoOutputDetailsProps = {
    videoFile: FileActions;
    timeTaken?: number;
};

export const VideoOutputDetails = ({
    videoFile,
    timeTaken,
}: VideoOutputDetailsProps) => {
    const [language, setLanguage] = useState<Language>('id');

    useEffect(() => {
        const userLanguage = typeof navigator !== 'undefined' ? navigator.language : 'id';
        setLanguage(userLanguage.startsWith('id') ? 'id' : 'en');
    }, []);

    const t = translations[language];
    const outputFileSize = calculateBlobSize(videoFile.outputBlob);
    const { sizeReduced, percentage } = reduceSize(
        videoFile.fileSize,
        videoFile.outputBlob
    );

    const download = () => {
        if (!videoFile.url) return;

        try {
            const a = document.createElement("a");
            a.href = videoFile.url;
            a.download = videoFile.output;
            a.rel = "noopener noreferrer";

            const event = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            a.dispatchEvent(event);

            setTimeout(() => {
                URL.revokeObjectURL(videoFile.url!);
            }, 10000);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            key={"output"}
            transition={{ type: "tween" }}
            className="rounded-2xl px-4 py-3 h-fit bg-gray-100 border border-gray-200"
        >
            <div className="text-sm">
                <div className="flex justify-between items-center border-b mb-2 pb-2">
                    <div className="flex items-center gap-1">
                        <p>{t.outputFile}</p>
                        <BadgeCheck className="text-white rounded-full" fill="#7e22ce" />
                    </div>
                    <button
                        type="button"
                        className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-700 via-purple-950 to-purple-950 rounded-lg text-white/90 relative px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-purple-950 flex-shrink-0"
                        onClick={download}
                    >
                        {t.download}
                    </button>
                </div>

                <div className="flex justify-between items-center border-b mb-2 pb-2">
                    <p className="font-semibold">{t.newFileSize}</p>
                    <p className="font-semibold">{outputFileSize}</p>
                </div>
                <div className="flex justify-between items-center border-b mb-2 pb-2">
                    <p className="font-semibold">{t.sizeReducedPercent}</p>
                    <p className="font-semibold">{percentage}%</p>
                </div>
                <div className="flex justify-between items-center border-b mb-2 pb-2">
                    <p>{t.originalFileSize}</p>
                    <p>{bytesToSize(videoFile.fileSize)}</p>
                </div>
                <div className="flex justify-between items-center border-b mb-2 pb-2">
                    <p>{t.sizeReduced}</p>
                    <p>{sizeReduced}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p>{t.timeTaken}</p>
                    <p>{timeTaken ? formatTime(timeTaken / 1000) : t.notAvailable}</p>
                </div>
            </div>
        </motion.div>
    );
};
