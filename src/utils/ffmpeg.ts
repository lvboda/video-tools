import { pushLog } from "@/utils/log";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

import createObjectURL from "@/utils/create-object-url";
import { invokeWithErrorHandler, panic } from "@/utils/error";
import { genArgsByFormatConvertData, genArgsByClipMergeData } from "@/utils/ffmpeg-params";

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import type { FormatConvertData, ClipMergeData } from "@/utils/ffmpeg-params";

let ffmpeg: null | FFmpeg = null;

export async function loadFFmpeg() {

    async function fn() {
        if (!ffmpeg) ffmpeg = createFFmpeg({ corePath: "/video-tools/ffmpeg-core.js" });
        if (!ffmpeg.isLoaded()) await ffmpeg.load();

        ffmpeg?.setProgress((() => {
            let preProgress = 0;
            return ({ ratio }) => {
                const progress = ratio * 100;
                if (Math.ceil(progress) >= 100) {
                    if (preProgress) pushLog(`处理进度: ${parseInt(progress.toString())}%...`)
                    preProgress = 0;
                    return;
                } else if (progress > preProgress + 1) {
                    preProgress = progress;
                    pushLog(`处理进度: ${parseInt(progress.toString())}%...`)
                }
            }
        })());

        ffmpeg?.setLogger(({ message }) => {
            console.log(message);
            if (
                (
                    message &&
                    message.constructor === String &&
                    message.indexOf("Error") == 0
                ) || (message as any) instanceof Error
            ) panic(message);
        });
    }

    await invokeWithErrorHandler(fn);
}

export function unlink(fileNames: string[]) {
    fileNames.forEach((fileName) => ffmpeg.FS("unlink", fileName));
}

export async function writeFiles(files: File[], inputName?: string) {
    for (let i = 0; i < files.length; i++) {
        ffmpeg.FS("writeFile", `${inputName ?? "input" + (i + 1)}`, await fetchFile(files[i]))
    }
}

export function readFile(fileName: string): Uint8Array {
    return ffmpeg.FS("readFile", fileName);
}

export async function runFFmpeg(ffmpegArgs: string[]) {
    await ffmpeg.run(...ffmpegArgs);
}

export async function formatConvert(data: FormatConvertData, files: File[]) {
    return await invokeWithErrorHandler(async () => {
        await writeFiles(files);

        await runFFmpeg(genArgsByFormatConvertData(data));

        return createObjectURL(readFile(`output.${data.formatSuffix}`).buffer, files[files.length - 1].type);
    });
}

export async function clipMerge(data: ClipMergeData, files: File[]) {
    return await invokeWithErrorHandler(async () => {
        await writeFiles(files);

        await runFFmpeg(genArgsByClipMergeData(data));

        return createObjectURL(readFile(`output.${data.formatSuffix}`).buffer, files[files.length - 1].type);
    });
}