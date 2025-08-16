import React, { useState, useEffect } from "react";
import {
    QualityType,
    VideoFormats,
    VideoInputSettings,
} from "../../../utils/types";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type VideoInputControlProps = {
    videoSettings: VideoInputSettings;
    onVideoSettingsChange: (value: VideoInputSettings) => void;
    disable: boolean;
};

type TranslationKeys = {
    removeAudio: string;
    condenseTwitter: string;
    condenseWhatsapp: string;
    quality: string;
    format: string;
    selectQuality: string;
    selectFormat: string;
    qualityOptions: Record<QualityType, string>;
    formatOptions: Record<VideoFormats, string>;
};

const translations: Record<'en' | 'id', TranslationKeys> = {
    en: {
        removeAudio: "Remove Audio",
        condenseTwitter: "Condense for Twitter",
        condenseWhatsapp: "Condense for Whatsapp Status",
        quality: "Quality",
        format: "Format",
        selectQuality: "Select Quality",
        selectFormat: "Select Format",
        qualityOptions: {
            [QualityType.High]: "High",
            [QualityType.Medium]: "Medium",
            [QualityType.Low]: "Low"
        },
        formatOptions: {
            [VideoFormats.MP4]: "MP4 (.mp4)",
            [VideoFormats.MOV]: "MOV (.mov)",
            [VideoFormats.MKV]: "MKV (.mkv)",
            [VideoFormats.AVI]: "AVI (.avi)",
            [VideoFormats.FLV]: "FLV (.flv)",
            // [VideoFormats.WEBM]: "WEBM (.webm)"
        }
    },
    id: {
        removeAudio: "Hapus Audio",
        condenseTwitter: "Kompres untuk Twitter",
        condenseWhatsapp: "Kompres untuk Status Whatsapp",
        quality: "Kualitas",
        format: "Format",
        selectQuality: "Pilih Kualitas",
        selectFormat: "Pilih Format",
        qualityOptions: {
            [QualityType.High]: "Tinggi",
            [QualityType.Medium]: "Sedang",
            [QualityType.Low]: "Rendah"
        },
        formatOptions: {
            [VideoFormats.MP4]: "MP4 (.mp4)",
            [VideoFormats.MOV]: "MOV (.mov)",
            [VideoFormats.MKV]: "MKV (.mkv)",
            [VideoFormats.AVI]: "AVI (.avi)",
            [VideoFormats.FLV]: "FLV (.flv)",
            // [VideoFormats.WEBM]: "WEBM (.webm)"
        }
    }
};

const qualityOptions = Object.values(QualityType).map(value => ({
    value,
    label: value
}));

const formatOptions = Object.values(VideoFormats).map(value => ({
    value,
    label: value
}));

export const VideoInputControl = ({
    videoSettings,
    onVideoSettingsChange,
    disable,
}: VideoInputControlProps) => {
    const [language, setLanguage] = useState<'en' | 'id'>('id');

    useEffect(() => {
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
                    <p>{t.removeAudio}</p>
                    <Switch
                        disabled={disable}
                        onCheckedChange={(value: boolean) =>
                            onVideoSettingsChange({ ...videoSettings, removeAudio: value })
                        }
                        checked={videoSettings.removeAudio}
                    />
                </div>
                <div className="flex justify-between items-center border-b mb-2 pb-2">
                    <p>{t.condenseTwitter}</p>
                    <Switch
                        disabled={disable}
                        onCheckedChange={(value: boolean) =>
                            onVideoSettingsChange({
                                ...videoSettings,
                                twitterCompressionCommand: value,
                            })
                        }
                        checked={videoSettings.twitterCompressionCommand}
                    />
                </div>
                <div className="flex justify-between items-center border-b mb-2 pb-2">
                    <p>{t.condenseWhatsapp}</p>
                    <Switch
                        disabled={disable}
                        onCheckedChange={(value: boolean) =>
                            onVideoSettingsChange({
                                ...videoSettings,
                                whatsappStatusCompressionCommand: value,
                            })
                        }
                        checked={videoSettings.whatsappStatusCompressionCommand}
                    />
                </div>
                {!videoSettings.twitterCompressionCommand &&
                    !videoSettings.whatsappStatusCompressionCommand && (
                        <>
                            <div className="flex justify-between items-center border-b mb-2 pb-2">
                                <p>{t.quality}</p>
                                <Select
                                    disabled={disable}
                                    value={videoSettings.quality}
                                    onValueChange={(value: QualityType) =>
                                        onVideoSettingsChange({ ...videoSettings, quality: value })
                                    }
                                >
                                    <SelectTrigger className="w-[100px] text-sm">
                                        <SelectValue placeholder={t.selectQuality} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {qualityOptions.map(({ value }) => (
                                            <SelectItem value={value} key={value}>
                                                {t.qualityOptions[value]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-between items-center border-b mb-2 pb-2">
                                <p>{t.format}</p>
                                <Select
                                    disabled={disable}
                                    value={videoSettings.videoType}
                                    onValueChange={(value: VideoFormats) =>
                                        onVideoSettingsChange({ ...videoSettings, videoType: value })
                                    }
                                >
                                    <SelectTrigger className="w-[150px] text-sm">
                                        <SelectValue placeholder={t.selectFormat} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formatOptions.map(({ value }) => (
                                            <SelectItem value={value} key={value}>
                                                {t.formatOptions[value]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
            </div>
        </motion.div>
    );
};
