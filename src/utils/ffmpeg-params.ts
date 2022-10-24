export function genFFmpegParams(formatConvertParams: FormatConvertParams): string[] {
    const {
        formatType,
        formatSuffix,
        isEncode,
        encode,
        isQuality,
        quality,
        isCompress,
        compressSize,
        isZoom,
        zoomX,
        zoomY
    } = formatConvertParams;

    const ffmpegParams = ["-i", "input"];

    if (formatType === "video") {
        ffmpegParams.push("-c:a", "copy");

        if (isEncode) {
            ffmpegParams.push("-c:v", encode);
            if (encode === "libx265") ffmpegParams.push("-pix_fmt", "yuv420p10le");
            if (isQuality && quality !== "default") ffmpegParams.push("-crf", quality);
            if (isCompress && Number(compressSize)) ffmpegParams.push("-fs", `${compressSize}MB`);
            if (isZoom && Number(zoomX) && Number(zoomY)) ffmpegParams.push("-s", `${zoomX}*${zoomY}`);
            ffmpegParams.push("-preset", "superfast");
        } else ffmpegParams.push("-c:v", "copy");

        if (encode === "libx265") ffmpegParams.push("-pix_fmt", "yuv420p10le");
            if (isQuality && quality !== "default") ffmpegParams.push("-crf", quality);
            if (isCompress && Number(compressSize)) ffmpegParams.push("-fs", `${compressSize}MB`);
            if (isZoom && Number(zoomX) && Number(zoomY)) ffmpegParams.push("-s", `${zoomX}*${zoomY}`);

    } else if (formatType === "audio") {
        if (isEncode) {
            ffmpegParams.push("-c:a", encode);
            if (isQuality && quality !== "default") ffmpegParams.push("-crf", quality);
            if (isCompress && Number(compressSize)) ffmpegParams.push("-fs", compressSize);
            ffmpegParams.push("-preset", "superfast");
        }
    }

    ffmpegParams.push(`output.${formatSuffix}`);
    return ffmpegParams;
}

export type FormatConvertParams = {
    formatType: "video" | "audio";
    formatSuffix: string;
    isEncode?: "1",
    encode?: string,
    isQuality?: "1";
    quality?: "default" | "50" | "25" | "0";
    isCompress?: "1";
    compressSize?: string;
    isZoom?: "1";
    zoomX?: string;
    zoomY?: string;
}

const getDefaultFormatConvertParams = (): FormatConvertParams => ({
    formatType: "video",
    formatSuffix: "mp4",
    quality: "default",
});

export function toFormatConvertParams(arr: { name: string, value: string }[]): FormatConvertParams {
    return arr.reduce<FormatConvertParams>((baseObj, obj) => ({ ...baseObj, [obj.name]: obj.value }), getDefaultFormatConvertParams());
}