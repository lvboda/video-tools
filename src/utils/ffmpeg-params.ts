export function genArgsByFormatConvertData(data: FormatConvertData): string[] {
    const {
        formatType,
        formatSuffix,
        isEncode,
        encode,
        isQuality,
        quality,
        isCompress,
        fps,
        bps,
        isZoom,
        zoomX,
        zoomY,
    } = data;

    const ffmpegArgs = ["-i", "input1"];

    if (formatType === "video") {
        if (encode !== "libvpx" && encode !== "libvpx-vp9" && encode !== "libtheora") ffmpegArgs.push("-c:a", "copy");

        if (isEncode) {
            ffmpegArgs.push("-c:v", encode);
            if (encode === "libx265") ffmpegArgs.push("-pix_fmt", "yuv420p10le");
            if (isQuality && quality !== "0") ffmpegArgs.push("-crf", quality);
            if (isQuality && quality === "0") ffmpegArgs.push("-qp", quality);
            if (isCompress && Number(fps)) ffmpegArgs.push("-r", fps);
            if (isCompress && bps) ffmpegArgs.push("-b:v", bps);
            if (isZoom && Number(zoomX) && Number(zoomY)) ffmpegArgs.push("-s", `${zoomX}*${zoomY}`);
            ffmpegArgs.push("-preset", "superfast");
        } else ffmpegArgs.push("-c:v", "copy");

    } else if (formatType === "audio") {
        if (isEncode) {
            ffmpegArgs.push("-c:a", encode);
            if (isCompress && bps) ffmpegArgs.push("-b:a", bps);
            ffmpegArgs.push("-preset", "superfast");
        }
    }

    ffmpegArgs.push(`output.${formatSuffix}`);
    return ffmpegArgs;
}

export function genArgsByClipMergeData(data: ClipMergeData): string[] {
    const { type, formatType, formatSuffix, startTime, endTime, encode } = data;
    const ffmpegArgs = [];

    if (type === "clip") {
        ffmpegArgs.push("-i", "input1");
        if (startTime && endTime) ffmpegArgs.push("-ss", startTime, "-t", endTime, "-avoid_negative_ts", "1");
    } else if (type === "merge") {
        if (formatType === "video") ffmpegArgs.push("-i", "concat:input1.ts|input2.ts", "-absf", "aac_adtstoasc");
        if (formatType === "audio") ffmpegArgs.push("-i", "concat:input1.mp3|input2.mp3", "-c", "copy");
    }

    if (encode === "no") ffmpegArgs.push("-c", "copy");
    ffmpegArgs.push(`output.${formatSuffix}`);
    return ffmpegArgs;
}

function makeConvertFn<T>(getDefault: () => T) {
    return function(arr: { name: string; value: string }[]): T {
        return arr.reduce<T>((baseObj, obj) => ({ ...baseObj, [obj.name]: obj.value }), getDefault());
    }
}

export type FormatConvertData = {
    formatType: "video" | "audio";
    formatSuffix: string;
    isEncode?: "1",
    encode?: string,
    isQuality?: "1";
    quality?: "18" | "23" | "28" | "0";
    isCompress?: "1";
    fps?: string;
    bps?: string;
    isZoom?: "1";
    zoomX?: string;
    zoomY?: string;
}

const getDefaultFormatConvertData = (): FormatConvertData => ({
    formatType: "video",
    formatSuffix: "mp4",
    quality: "23",
});

export const toFormatConvertData = makeConvertFn(getDefaultFormatConvertData);

export type ClipMergeData = {
    type: "clip" | "merge";
    formatType: "video" | "audio";
    formatSuffix: string;
    startTime?: string;
    endTime?: string;
    encode?: "yes" | "no";
}

const getDefaultClipMergeData = (): ClipMergeData => ({
    type: "clip",
    formatType: "video",
    formatSuffix: "mp4",
});

export const toClipMergeData = makeConvertFn(getDefaultClipMergeData);