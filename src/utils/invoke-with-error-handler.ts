export let currentInvokeError: null | Error  = null;

async function invokeWithErrorHandler(cb: Function, args: any[]) {
    currentInvokeError = null;
    let res = null;
    try {
       res = await cb?.(...args);
    } catch(err) {
        currentInvokeError = err;
    }
    return res;
}

export default invokeWithErrorHandler;