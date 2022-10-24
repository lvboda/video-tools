import { LOG_TYPE, pushLog } from '@/utils/log';

export let currentInvokeError: null | Error  = null;

export async function invokeWithErrorHandler<T extends Function>(cb: T, ...args: any[]) {
    currentInvokeError = null;
    let res = null;
    try {
       res = await cb(...args);
    } catch(error) {
        currentInvokeError = Error(error);
    }
    return res;
}

export function panic(error: any) {
    pushLog("处理过程中发生底层错误, 这个错误很可能是视频文件过大导致的, 错误信息如下", LOG_TYPE.ERROR);
    pushLog(Error(error).message, LOG_TYPE.ERROR);
    pushLog("请手动<a href='javascript:location.reload()'>刷新页面</a>重新操作", LOG_TYPE.ERROR);
}