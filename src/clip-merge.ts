import { writeFiles, runFFmpeg, clipMerge } from "@/utils/ffmpeg";
import { toClipMergeData } from "@/utils/ffmpeg-params";
import { LOG_TYPE, pushLog } from "@/utils/log";
import { currentInvokeErrorQueue } from "@/utils/error";
import createFileInput from "@/utils/create-file-input";

function initClipMergeDOM($: JQueryStatic) {
    const clipMergeFormEl = $("#clip-merge-form");

    function onTypeChange() {
        if ($(this).prop("checked") && $(this).val() === "clip") {
            clipMergeFormEl.children("[name='time-content']").show();
            clipMergeFormEl.children("[name^='file-content']").hide();
        }
        if ($(this).prop("checked") && $(this).val() === "merge") {
            clipMergeFormEl.children("[name='time-content']").hide();
            clipMergeFormEl.children("[name^='file-content']").show();
        }
    }

    async function onClipMergeFormSubmit(e: JQuery.SubmitEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
        e.preventDefault();

        const data = toClipMergeData(clipMergeFormEl.serializeArray());
        const isClip = data.type === "clip";
        const isVideo = data.formatType === "video";

        if (!isClip) {
            const file1 = clipMergeFormEl.find("[name='file1']").prop("files")[0];
            const file2 = clipMergeFormEl.find("[name='file2']").prop("files")[0];
            data.formatSuffix = isVideo ? file2.name.split('.').pop() : "mp3";
            await writeFiles([file1, file2]);
            pushLog("正在转换格式(文件1)...");
            await runFFmpeg(isVideo ? ["-i", "input1", "-c", "copy", "input1.ts"] : ["-i", "input1", "input1.mp3"]);
            pushLog("正在转换格式(文件2)...");
            await runFFmpeg(isVideo ? ["-i", "input2", "-c", "copy", "input2.ts"] : ["-i", "input2", "input2.mp3"]);
            pushLog("文件格式转换完成。");
            pushLog("文件处理中，请稍后...");
            const href = await clipMerge(data, [file1, file2]);
            if (!currentInvokeErrorQueue.isEmpty()) {
                pushLog("处理过程中发生错误，请检查您的操作是否有误，错误信息如下。", LOG_TYPE.ERROR);
                currentInvokeErrorQueue.forEach((error) => pushLog(error.message, LOG_TYPE.ERROR));
                return;
            }

            pushLog(`文件处理完成，<a href="${href}" download="output.${data.formatSuffix}">点击下载</a>。`);
            return;
        }

        const clearFileInput = createFileInput(async (file) => {
            data.formatSuffix = file.name.split('.').pop();
            pushLog("文件处理中，请稍后...");
            const href = await clipMerge(data, [file]);
            if (!currentInvokeErrorQueue.isEmpty()) {
                pushLog("处理过程中发生错误，请检查您的操作是否有误，错误信息如下。", LOG_TYPE.ERROR);
                currentInvokeErrorQueue.forEach((error) => pushLog(error.message, LOG_TYPE.ERROR));
                clearFileInput();
                return;
            }

            pushLog(`文件处理完成，<a href="${href}" download="output.${data.formatSuffix}">点击下载</a>。`);
            clearFileInput();
        });
    }

    clipMergeFormEl.on("submit", onClipMergeFormSubmit);
    clipMergeFormEl.find("[name='type']").on("change", onTypeChange);
}

export default initClipMergeDOM;