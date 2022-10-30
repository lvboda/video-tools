import $ from "jquery";

function createFileInput(onChange: (file: File) => void, isAutoClick = true): () => void {
    let fileInput = $("<input>", { type: "file" })
        .on("change", () => onChange(fileInput.prop("files")[0]));
    if (isAutoClick) fileInput.trigger("click");
    return () => fileInput = null;
}

export default createFileInput;