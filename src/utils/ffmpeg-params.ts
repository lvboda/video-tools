export function genFFmpegParams({ formatType, formatSuffix, quality }: FormatConvertParams): string[] {
    const ffmpegParams = ["-i", "input"];

    if (formatType === "video") {
        ffmpegParams.push("-c:v", "libx264");
        
        if (quality !== "default") ffmpegParams.push("-preset", "ultrafast", "-crf", quality, "-tune", "film", "-c:a", "copy");

        // ffmpegParams.push("-c:v", "copy", "-c:a", "copy");
    } else if (formatType === "audio") {

    }

    ffmpegParams.push(`output.${formatSuffix}`);
    return ffmpegParams;
}

export type FormatConvertParams = {
    formatType: "video" | "audio";
    formatSuffix: string;
    quality: "default" | "50" | "25" | "0";
    isEncode?: "1",
    encode?: string,
    isCompress?: "1";
    compressSize?: number;
    isZoom?: "1";
    zoomX?: number;
    zoomY?: number;
}

const getDefaultFormatConvertParams = (): FormatConvertParams => ({
    formatType: "video",
    formatSuffix: "mp4",
    quality: "default",
});

export function toFormatConvertParams(arr: { name: string, value: string }[]): FormatConvertParams {
    return arr.reduce<FormatConvertParams>((baseObj, obj) => ({ ...baseObj, [obj.name]: obj.value }), getDefaultFormatConvertParams());
}