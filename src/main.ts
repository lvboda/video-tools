import { OPERATE_TYPE, loadFFmpeg, dispatchOperate } from "@/utils/ffmpeg";

const videoEl = document.getElementById("video") as HTMLVideoElement;
const uploadEl = document.getElementById("upload") as HTMLInputElement;
const selectEl = document.getElementById("operate-type") as HTMLSelectElement;
const suffixEl = document.getElementById("suffix") as HTMLInputElement;
const buttonEl = document.getElementById("button");
const downloadEl = document.getElementById("download");
const messageEl = document.getElementById("message");

buttonEl.addEventListener("click", async () => {
    const file = uploadEl.files[0];
    const type = Number(selectEl.options[selectEl.selectedIndex].value);
    const suffix = suffixEl.value.trim();
    if (!file) {
        messageEl.innerHTML = "请选择要处理的文件!";
        return;
    }
    messageEl.innerHTML = "文件处理中, 请稍后...";
    const href = await dispatchOperate(type, file, suffix);
    downloadEl.setAttribute("href", href);
    downloadEl.setAttribute("download", `test.${suffix}`);
    downloadEl.style.display = "block";
    messageEl.innerHTML = "文件处理完成!";
});

async function bootstrap() {
    messageEl.innerText = "正在加载组件, 如果您首次进入本页面可能会花费一些时间, 请耐心等待...";
    await loadFFmpeg();
    messageEl.innerText = "组件加载完成!";
}

bootstrap();