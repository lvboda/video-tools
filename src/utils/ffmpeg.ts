import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

import createURL from '@/utils/create-URL';
import invokeWithErrorHandler from "@/utils/invoke-with-error-handler";

import type { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: null | FFmpeg = null;

export enum OPERATE_TYPE {
    FORMAT_CONVERT = 0
}

const operateMap = new Map<OPERATE_TYPE, (...params: any) => any>();

function registerOperate() {
    operateMap.set(OPERATE_TYPE.FORMAT_CONVERT, formatConvert);
}
registerOperate();

async function formatConvert(suffix: string) {
    suffix = suffix.trim();
    if (!suffix) suffix = "mp4";
    await ffmpeg.run(
        "-i",
        "input",
        "-c:v",
        "copy",
        "-c:a",
        "copy",
        `output.${suffix}`
      );
    const buffer = ffmpeg.FS("readFile", `output.${suffix}`).buffer;

    return createURL(buffer, `video/${suffix}`);
}

export async function loadFFmpeg() {
    if (!ffmpeg) ffmpeg = createFFmpeg({ log: true });
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    return ffmpeg;
}

export async function dispatchOperate(oType: OPERATE_TYPE, file: File, ...params: any) {
    return await invokeWithErrorHandler(async () => {
        ffmpeg.FS("writeFile", "input", await fetchFile(file));
        return operateMap.get(oType)?.(...params);
    }, [ oType, file, ...params ]);
}