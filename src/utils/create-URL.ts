function createURL(buffer: Uint8Array, type: string): string {
    return URL.createObjectURL(new Blob([buffer.buffer], { type }));
}

export default createURL;