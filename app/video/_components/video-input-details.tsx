import { bytesToSize } from "@/utils/bytesToSize";
import { FileActions } from "@/utils/types";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type Language = 'en' | 'id';

type Translations = {
    fileInput: string;
    clearButton: string;
    fileName: string;
    fileSize: string;
};

const translations: Record<Language, Translations> = {
    en: {
        fileInput: "File Input",
        clearButton: "Clear",
        fileName: "File name",
        fileSize: "File size"
    },
    id: {
        fileInput: "File Input",
        clearButton: "Hapus",
        fileName: "Nama file",
        fileSize: "Ukuran file"
    }
};

type VideoInputDetailsProps = {
    videoFile: FileActions;
    onClear: () => void;
};

export const VideoInputDetails = ({
    videoFile,
    onClear,
}: VideoInputDetailsProps) => {
    const [language, setLanguage] = useState<Language>('id');

    useEffect(() => {
        // Client-side language detection
        const userLanguage = typeof navigator !== 'undefined' ? navigator.language : 'id';
        setLanguage(userLanguage.startsWith('id') ? 'id' : 'en');
    }, []);

    const t = translations[language];

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            key={"drag"}
            transition={{ type: "tween" }}
            className="rounded-2xl px-4 py-3 h-fit bg-gray-100 border border-gray-200"
        >
            <div className="text-sm">
                <div className="flex justify-between items-center border-b mb-2 pb-2">
                    <p>{t.fileInput}</p>
                    <button
                        onClick={onClear}
                        type="button"
                        className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-700 via-purple-950 to-purple-950 rounded-lg text-white/90 relative px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-purple-950 flex-shrink-0"
                    >
                        {t.clearButton}
                    </button>
                </div>
                <p className="border-b mb-2 pb-2">{videoFile?.fileName}</p>
                <div className="flex justify-between items-center">
                    <p>{t.fileSize}</p>
                    <p>{bytesToSize(videoFile.fileSize)}</p>
                </div>
            </div>
        </motion.div>
    );
};
