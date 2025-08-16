import React from "react";
import { Loader } from "lucide-react";
import { formatTime } from "@/utils/convert";
import { Progress } from "@/components/ui/progress";

const translations = {
    en: {
        condensing: "Condensing",
        loadingVideo: "Loading Video",
    },
    id: {
        condensing: "Mengompres",
        loadingVideo: "Memuat Video",
    }
};

export const VideoCondenseProgress = ({
    progress,
    seconds,
}: {
    progress: number;
    seconds: number;
}) => {
    const userLanguage = navigator?.language || 'en';
    const language = userLanguage.startsWith('id') ? 'id' : 'en';
    const t = translations[language];

    return (
        <div className="flex justify-between items-center gap-2 p-0.5">
            <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                    <div className="flex gap-2 items-center">
                        {progress ? (
                            <p>{t.condensing}</p>
                        ) : (
                            <p>{t.loadingVideo}</p>
                        )}
                        <Loader className="animate-spin w-4 h-4" />
                    </div>
                    <p className="text-sm">{formatTime(seconds / 1000)}</p>
                </div>
                <Progress value={progress} />
            </div>
        </div>
    );
};
