import { LOG_TYPE, pushLog } from "@/utils/log";

async function invokeWithErrorHandler(cb: Function, args: any[]) {
    let res = null;
    try {
       res = await cb?.(...args);
    } catch(err) {
        pushLog("处理过程中发生错误，请检查您的操作是否有误，错误信息如下", LOG_TYPE.ERROR);
        pushLog(err, LOG_TYPE.ERROR);
    }
    return res;
}

export default invokeWithErrorHandler;