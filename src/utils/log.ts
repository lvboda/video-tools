import $ from "jquery";

export enum LOG_TYPE {
    DEFAULT = "none",
    INFO = "#198754",
    ERROR = "#dc3545",
    HR = "hr",
}

export function pushLog(msg: string | JQuery<HTMLElement>, type = LOG_TYPE.DEFAULT) {
    if (type === LOG_TYPE.HR) {
        pushLog("------------------>", LOG_TYPE.INFO);
        return;
    }
    const date = new Date();
    const time = `[ ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ]:  ` 
    const dom = $(`<div>${time}</div>`);
    const content = $(`<span />`).append(msg);
    content.css("color", type);
    dom.append(content);
    $("#log-box").append(dom);
    $('#log-box').scrollTop($('#log-box').prop("scrollHeight"));
}

export function clearLog() {
    $("#log-box").val("");
}