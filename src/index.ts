import $ from "jquery";
import "bootstrap/dist/js/bootstrap.min";

import { OPERATE_TYPE, loadFFmpeg, dispatchOperate } from "@/utils/ffmpeg";
import { LOG_TYPE, pushLog } from "@/utils/log";
import { currentInvokeError } from "@/utils/invoke-with-error-handler";

const downloadEl = $("#download");
const formatConvertForm = $("#format-convert-form");

formatConvertForm.on("submit", function(e) {
    e.preventDefault();

    const data = formatConvertForm.serializeArray().reduce<any>((baseObj, obj) => ({ ...baseObj, [obj.name]: obj.value }), {});

    let fileInput = $("<input>", { type: "file" })
        .trigger("click")
        .on("change", async function() {
            const file = fileInput.prop("files")[0];
            if (!file) {
                fileInput = null;
                return;
            };

            pushLog("文件处理中, 请稍后...");
            const href = await dispatchOperate(OPERATE_TYPE.FORMAT_CONVERT, file, data.formatSuffix);
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
});

async function bootstrap() {
    pushLog("正在加载组件, 如果您首次进入本站可能会花费一些时间, 请耐心等待...");
    await loadFFmpeg();
    pushLog("组件加载完成!");
}

bootstrap();