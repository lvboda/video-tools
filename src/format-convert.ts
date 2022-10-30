import { formatConvert } from "@/utils/ffmpeg";
import { LOG_TYPE, pushLog } from "@/utils/log";
import { currentInvokeErrorQueue } from "@/utils/error";
import { toFormatConvertData } from "@/utils/ffmpeg-params";
import createFileInput from "@/utils/create-file-input";

function initFormatConvertDOM($: JQueryStatic) {
    const formatConvertFormEl = $("#format-convert-form");

    function onCheckBoxChange() {
        if (!$(this).prop("checked")) $(this).closest("[name$='content']").css("opacity", ".4").find("input:not(:first),select").attr("disabled", "disabled");
        if ($(this).prop("checked")) $(this).closest("[name$='content']").css("opacity", "1").find("input:not(:first),select").removeAttr("disabled");
    }

    function onFormatTypeChange() {
        if ($(this).prop("checked") && $(this).val() === "video") {
            if (formatConvertFormEl.find("[name='isEncode']").prop("checked")) formatConvertFormEl.children("[name='zoom-content']").show();
            if (formatConvertFormEl.find("[name='isEncode']").prop("checked")) formatConvertFormEl.children("[name='quality-content']").show();
            formatConvertFormEl.find(".video").attr("name", "encode").show().siblings(".audio").removeAttr("name").hide();
            formatConvertFormEl.find("[name='fps']").parents(".col-sm-3").show();
        }
        if ($(this).prop("checked") && $(this).val() === "audio") {
            formatConvertFormEl.children("[name='zoom-content']").hide().find("[name='isZoom']").prop("checked", false).trigger("change");
            formatConvertFormEl.children("[name='quality-content']").hide().find("[name='isQuality']").prop("checked", false).trigger("change");
            formatConvertFormEl.find(".audio").attr("name", "encode").show().siblings(".video").removeAttr("name").hide();
            formatConvertFormEl.find("[name='fps']").parents(".col-sm-3").hide();
        }
    }

    function onIsEncodeChange() {
        if (!$(this).prop("checked")) formatConvertFormEl.children("[name$='content']:not(:first)").hide().find("[name^='is']").prop("checked", false).trigger("change");
        if ($(this).prop("checked")) formatConvertFormEl.children("[name$='content']").show();
        formatConvertFormEl.find("[name='formatType']").trigger("change");
    }

    function onFormatConvertFormSubmit(e: JQuery.SubmitEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
        e.preventDefault();

        const data = toFormatConvertData(formatConvertFormEl.serializeArray());

        console.log(data, 1);

        const clearFileInput = createFileInput(async (file) => {
            pushLog("文件处理中，请稍后...");
            console.log(file, 2);
            const href = await formatConvert(data, [file]);
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

    formatConvertFormEl.on("submit", onFormatConvertFormSubmit);
    formatConvertFormEl.find("[name^='is']").on("change", onCheckBoxChange);
    formatConvertFormEl.find("[name='formatType']").on("change", onFormatTypeChange);
    formatConvertFormEl.find("[name='isEncode']").on("change", onIsEncodeChange);
}

export default initFormatConvertDOM;