import { LOG_TYPE, pushLog } from "@/utils/log";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

import createURL from "@/utils/create-URL";
import { invokeWithErrorHandler, panic } from "@/utils/error";
import { genFFmpegParams } from "@/utils/ffmpeg-params";

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import type { FormatConvertParams } from "@/utils/ffmpeg-params";

let ffmpeg: null | FFmpeg = null;

export function unlink(...fileNames: string[]) {
    fileNames.forEach((fileName) => ffmpeg.FS("unlink", fileName));
}

export async function loadFFmpeg() {
    async function fn() {
        if (!ffmpeg) ffmpeg = createFFmpeg({ corePath: "/ffmpeg-core.js" });
        if (!ffmpeg.isLoaded()) await ffmpeg.load();

        ffmpeg.setProgress((() => {
            let preProgress = 0;
            return ({ ratio }) => {
                const progress = ratio * 100;
                if (Math.ceil(progress) >= 100) {
                    if (preProgress) pushLog(`处理进度: ${parseInt(progress.toString())}%`)
                    preProgress = 0;
                    return;
                } else if (progress > preProgress + 1) {
                    preProgress = progress;
                    pushLog(`处理进度: ${parseInt(progress.toString())}%`)
                }
            }
        })());

        ffmpeg.setLogger(({ message }) => {
            console.log(message);
            if ((message as any) instanceof Error) panic(message);
        });
    }

    await invokeWithErrorHandler(fn);
}

async function runFFmpeg(ffmpegParams: string[]) {
    await ffmpeg.run(...ffmpegParams);
}

export async function formatConvert(file: File, data: FormatConvertParams) {
    async function fn() {
        ffmpeg.FS("writeFile", "input", await fetchFile(file));

        await runFFmpeg(genFFmpegParams(data));
    
        return createURL(ffmpeg.FS("readFile", `output.${data.formatSuffix}`), `${data.formatType}/${data.formatSuffix}`);
    }

    return await invokeWithErrorHandler(fn, file, data);
}