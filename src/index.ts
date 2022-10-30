import jQuery from "jquery";
import "bootstrap/dist/js/bootstrap.min";

import { loadFFmpeg } from "@/utils/ffmpeg";
import { LOG_TYPE, pushLog } from "@/utils/log";
import antiDebug from "@/utils/anti-debug";
import initDOM from './init-dom';

// antiDebug();
jQuery(initDOM);

async function bootstrap() {
    pushLog("", LOG_TYPE.HR);
    pushLog("欢迎使用在线音视频处理工具！", LOG_TYPE.INFO);
    pushLog("该工具没有服务器参与，免去了传输成本，保证了高处理性能、数据安全。", LOG_TYPE.INFO);
    pushLog("该工具仅支持输出文件为2GB以内大小的处理。", LOG_TYPE.INFO);
    pushLog("如果遇到使用上的问题或bug可以发送邮件到页面下方邮箱。", LOG_TYPE.INFO);
    pushLog("", LOG_TYPE.HR);
    pushLog("开始加载组件...");
    pushLog("如果您首次进入本站可能会花费一些时间，请耐心等待...");
    await loadFFmpeg();
    pushLog("组件加载完成!");
    jQuery("#loading").hide().siblings(".tab-content").show();
}

bootstrap();