import initFormatConvertDOM from "./format-convert"
import initClipMergeDOM from "./clip-merge"
import initAdvanceDOM from "./advance";

function initDOM(jquery: JQueryStatic) {
    initFormatConvertDOM(jquery);
    initClipMergeDOM(jquery);
    initAdvanceDOM(jquery);
}

export default initDOM;