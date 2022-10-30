import createFileInput from "@/utils/create-file-input";
import { writeFiles, unlink, runFFmpeg, readFile } from "@/utils/ffmpeg";
import { LOG_TYPE, pushLog } from "@/utils/log";
import { currentInvokeErrorQueue, invokeWithErrorHandler } from "@/utils/error";
import createURL from "@/utils/create-URL";

function initAdvanceDOM($: JQueryStatic) {
    const advanceFormEl = $("#advance-form");
    let uploadLoading = false;
    let uploadIndex = 1;
    let advanceTabShowFlag = false;

    function onUploadClick() {
        const clearFileInput = createFileInput(async (file) => {
            uploadLoading = true;
            const inputName = `input${uploadIndex}`;
            await writeFiles([file], inputName);
            uploadIndex++;
            const fileTextContent = $(`
                <div class="row mb-2 align-items-center" name="${inputName}-content">
                    <div class="col-sm-1"></div>
                        <div class="col-sm-4">
                            <span class="col-form-label">文件名:</span> ${file.name}
                        </div>
                        <div class="col-sm-4">
                            <span class="col-form-label">输入参数名:</span> ${inputName}
                        </div>
                    <div class="col-sm-2" name="del-file-content">
                    </div>
                </div>
            `)
            const delBtn = $(`<button type="button" class="btn-close"></button>`).on("click", function() {
                unlink([inputName]);
                fileTextContent.remove();
            });
            fileTextContent.find("[name='del-file-content']").append(delBtn);
            advanceFormEl.prepend(fileTextContent);
            clearFileInput();
            uploadLoading = false;
            pushLog("文件上传完成。");
        });
    }

    function onAdvanceTabClick() {
        if (advanceTabShowFlag) return;
        advanceTabShowFlag = true;
        pushLog("", LOG_TYPE.HR);
        pushLog("在高级模式下您可以自定义FFmpeg参数完成相应操作，操作步骤如下。", LOG_TYPE.INFO);
        pushLog("1: 点击文件上传，上传您想操作的输入文件并得到参数名。", LOG_TYPE.INFO);
        pushLog("2: 在输入框内输入FFmpeg参数, 其中-i的值为您上传文件得到的参数名。", LOG_TYPE.INFO);
        pushLog("3: 点击开始按钮进行相应处理。", LOG_TYPE.INFO);
        pushLog("例: 格式转换(不重新编码): -i {输入文件名} -c copy {输出文件名}", LOG_TYPE.INFO);
        pushLog("<a href='https://ffmpeg.org' target='_blank'>查看FFmpeg官网</a>。", LOG_TYPE.INFO);
        pushLog("<a href='https://www.longqi.cf/tools/2015/02/13/ffmpegcn' target='_blank'>查看FFmpeg中文文档</a>。", LOG_TYPE.INFO);
        pushLog("", LOG_TYPE.HR);
    }

    async function onAdvanceFormSubmit(e: JQuery.SubmitEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
        e.preventDefault();

        if (uploadLoading) {
            pushLog("文件上传中，请稍后再试...");
            return;
        }

        const ffmpegParams = $(this).find("[name='ffmpegParams']").val() as string;
        const ffmpegArgs = ffmpegParams.split(" ");
        const outputName = ffmpegArgs[ffmpegArgs.length - 1];

        pushLog("文件处理中，请稍后...");
        const href = await invokeWithErrorHandler(async () => {
            await runFFmpeg(ffmpegArgs);
            return createURL(readFile(outputName).buffer);
        });

        if (!currentInvokeErrorQueue.isEmpty()) {
            pushLog("处理过程中发生错误，请检查您的操作是否有误，错误信息如下。", LOG_TYPE.ERROR);
            currentInvokeErrorQueue.forEach((error) => pushLog(error.message, LOG_TYPE.ERROR));
            return;
        }

        pushLog(`文件处理完成，<a href="${href}" download="${outputName}">点击下载</a>。`);
    }

    advanceFormEl.on("submit", onAdvanceFormSubmit);
    advanceFormEl.find("[name='upload']").on("click", onUploadClick);
    $("button[data-bs-target='#advance']").on("click", onAdvanceTabClick);
}

export default initAdvanceDOM;