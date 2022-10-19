import $ from "jquery";
import 'bootstrap/dist/js/bootstrap.min.js'

import { loadFFmpeg, dispatchOperate } from "@/utils/ffmpeg";
import { pushLog } from "@/utils/log";

var operateType = 0;

const videoEl = $("#video");
const uploadEl = $("#upload");
const suffixEl = $("#suffix");
const buttonEl = $("#button");
const downloadEl = $("#download");

buttonEl.on("click", async () => {
    const file = uploadEl.prop('files')[0];
    const suffix = suffixEl.val()
    if (!file) {
        pushLog("请选择要处理的文件!");
        return;
    }
    pushLog("文件处理中, 请稍后...");
    const href = await dispatchOperate(operateType, file, suffix);
    downloadEl.attr("href", href);
    downloadEl.attr("download", `test.${suffix}`);
    downloadEl.show();
    pushLog("文件处理完成!");
});

async function bootstrap() {
    pushLog("正在加载组件, 如果您首次进入本站可能会花费一些时间, 请耐心等待...");
    await loadFFmpeg();
    pushLog("组件加载完成!");
}

bootstrap();