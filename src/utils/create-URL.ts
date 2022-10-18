function createURL(buffer: ArrayBuffer | Blob, type: string) {
    return URL.createObjectURL(new Blob([buffer], { type }));
}

export default createURL;