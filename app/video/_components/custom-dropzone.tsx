"use client";
import { useState } from "react";
import ReactDropzone from "react-dropzone";
import { toast } from "sonner";
import { Projector } from "./projector";

type CustomDropZoneProps = {
    handleUpload: (files: File) => void;
    acceptedFiles: { [key: string]: string[] };
    disabled?: boolean;
};

const translations = {
    en: {
        errorTitle: "Error uploading your file(s)",
        errorDescription: "Allowed files: Audio, Video and Images.",
        instructions: [
            "Click to select video",
            "or",
            "drag and drop"
        ]
    },
    id: {
        errorTitle: "Gagal mengunggah file",
        errorDescription: "File yang diizinkan: Audio, Video dan Gambar.",
        instructions: [
            "Klik untuk memilih video",
            "atau",
            "seret dan lepas"
        ]
    }
};

export const CustomDropZone = ({
    handleUpload,
    acceptedFiles,
    disabled,
}: CustomDropZoneProps) => {
    const [isHover, setIsHover] = useState<boolean>(false);
    const userLanguage = navigator.language || 'en';
    const language = userLanguage.startsWith('id') ? 'id' : 'en';
    const t = translations[language];

    const handleHover = (): void => setIsHover(true);
    const handleExitHover = (): void => setIsHover(false);
    const onDrop = (files: File[]) => {
        handleUpload(files[0]);
        handleExitHover();
    };

    const onError = () => {
        handleExitHover();
        toast.error(t.errorTitle, {
            description: t.errorDescription,
            duration: 5000,
        });
    };

    const onDropRejected = () => {
        handleExitHover();
        toast.error(t.errorTitle, {
            description: t.errorDescription,
            duration: 5000,
        });
    };

    return (
        <ReactDropzone
            disabled={disabled}
            onDragEnter={handleHover}
            onDragLeave={handleExitHover}
            onDrop={onDrop}
            accept={acceptedFiles}
            multiple={false}
            onError={onError}
            onDropRejected={onDropRejected}
        >
            {({ getRootProps, getInputProps }) => (
                <div
                    {...getRootProps()}
                    className={`
                        flex justify-center items-center flex-col 
                        cursor-pointer w-full py-6 bg-gray-100 rounded-3xl
                        ${isHover ? "border-2 border-black" : "border-0"}
                        ${disabled ? "cursor-not-allowed opacity-70" : ""}
                        transition-all duration-200
                    `}
                >
                    <input {...getInputProps()} />
                    <Projector />
                    <h3 className="text-center mt-5">
                        {t.instructions[0]} <br />
                        {t.instructions[1]}
                        <br />
                        {t.instructions[2]}
                    </h3>
                </div>
            )}
        </ReactDropzone>
    );
};