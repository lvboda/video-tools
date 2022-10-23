import jQuery from "jquery";
import "bootstrap/dist/js/bootstrap.min";

import initFormatConvertDOM from './format-convert';

import { loadFFmpeg } from "@/utils/ffmpeg";
import { pushLog } from "@/utils/log";

jQuery(function($) {
    initFormatConvertDOM($);
})

async function bootstrap() {
    pushLog("正在加载组件, 如果您首次进入本站可能会花费一些时间, 请耐心等待...");
    await loadFFmpeg();
    pushLog("组件加载完成!");
    jQuery("#loading").hide().siblings(".tab-content").show();
}

bootstrap();