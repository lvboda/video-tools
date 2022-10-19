import $ from "jquery";

export enum LOG_TYPE {
    INFO = "info",
    ERROR = "error",
}

export function pushLog(msg: string, type?: LOG_TYPE) {
    const date = new Date();
    const time = `[ ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ]: ` 
    const dom = $(`<div>${time}</div>`);
    const content = $(`<span>${msg}</span>`);
    if (type === LOG_TYPE.ERROR) content.css("color", "red");
    dom.append(content);
    $("#log").append(dom);
    $('#log').scrollTop($('#log').prop("scrollHeight"));
}

export function clearLog() {
    $("#log").val("");
}