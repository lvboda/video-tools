import { formatConvert } from "@/utils/ffmpeg";
import { LOG_TYPE, pushLog } from "@/utils/log";
import { currentInvokeError } from "@/utils/error";
import { toFormatConvertParams } from "@/utils/ffmpeg-params";

function initFormatConvertDOM($: JQueryStatic) {
    const downloadEl = $("#download");
    const formatConvertFormEl = $("#format-convert-form");

    function onCheckBoxChange() {
        if (!$(this).prop('checked')) $(this).closest("[name$='content']").css("opacity", ".4").find("input:not(:first),select").attr("disabled", "disabled");
        if ($(this).prop('checked')) $(this).closest("[name$='content']").css("opacity", "1").find("input:not(:first),select").removeAttr("disabled");
    }

    function onFormatTypeChange() {
        if ($(this).val() === "video") {
            formatConvertFormEl.children("[name='zoom-content']").show();
            formatConvertFormEl.find("[name='encode']").removeAttr("name").hide().siblings(":hidden").attr("name", "encode").show();
        }
        if ($(this).val() === "audio") {
            formatConvertFormEl.children("[name='zoom-content']").hide().find("[name='isZoom']").prop("checked", false).trigger("change");
            formatConvertFormEl.find("[name='encode']").removeAttr("name").hide().siblings(":hidden").attr("name", "encode").show();
        }
    }

    function onFormatConvertFormSubmit(e: JQuery.SubmitEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
        e.preventDefault();

        const data = toFormatConvertParams(formatConvertFormEl.serializeArray());

        pushLog(JSON.stringify(data));

        let fileInput = $("<input>", { type: "file" })
            .trigger("click")
            .on("change", async function () {
                const file = fileInput.prop("files")[0];
                if (!file) {
                    fileInput = null;
                    return;
                };

                pushLog("文件处理中, 请稍后...");
                const href = await formatConvert(file, data);
                if (currentInvokeError) {
                    pushLog("处理过程中发生错误，请检查您的操作是否有误，错误信息如下", LOG_TYPE.ERROR);
                    pushLog(currentInvokeError.message, LOG_TYPE.ERROR);
                    fileInput = null;
                    return
                }

                downloadEl.attr("href", href);
                downloadEl.attr("download", `test.${data.formatSuffix}`);
                downloadEl.show();
                pushLog("文件处理完成!");

                fileInput = null;
            });
    }

    formatConvertFormEl.on("submit", onFormatConvertFormSubmit);
    formatConvertFormEl.find("[name^='is']").on("change", onCheckBoxChange);
    formatConvertFormEl.find("[name='formatType']").on("change", onFormatTypeChange);
}

export default initFormatConvertDOM;