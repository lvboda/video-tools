function createObjectURL(buffer: ArrayBuffer | Blob, type?: string): string {
    return URL.createObjectURL(new Blob([buffer], { type }));
}

export default createObjectURL;