function antiDebug() {
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(navigator.userAgent.toLowerCase())) {
        alert("检测到您当前环境为手机端，请在电脑端使用此工具。");
    }

    var bAsH = /[ILyDRkWQIjAGKFIyUUMNYGDBQgWTVxQGTkEU]/g,
        hsj = "hLtIDWQRtpVsQK:xI/QG/WIljGvKbyUoGdDaIyU.UWcMNYnWGDDBQWATVQLVLGTkEU:IAG"["replace"](bAsH, ""),
        u$sA = "BWIDwQiAnGdKogQwBQE"["replace"](bAsH, ""),
        ys2fg = "yLIlDAoGTkcEUaIAtGiIjoILnU.LIhDrUWMNYWGDDBeQWATfVQLyVLWGTG"["replace"](bAsH, ""),
        Hs2Aq = "WylGAWQoITkcyLxUMYGaIAGxtGyUAiIjGUoIELLnI"["replace"](bAsH, ""),
        Fsb3w = "LIhDrUMNYGDDBeQWATfVQLyVAGyLGWTgW"["replace"](bAsH, "");
    eval(u$sA)[Hs2Aq][Fsb3w]["indexOf"](hsj) == -1  && (eval(u$sA)[ys2fg.split(".").shift()][Fsb3w] = hsj);

    function consoleOpenCallback() {
        document.body.innerHTML = "年轻人, 不要太好奇!";
        // window.close();
        // window.location.href = "about:blank";
    }

    // document.oncontextmenu = consoleOpenCallback;
    // var h = window.innerHeight, w = window.innerWidth;
    // window.onresize = function () {
    //     if (h !== window.innerHeight || w !== window.innerWidth) consoleOpenCallback();
    // }
    document.onkeydown = function (event) {
        if (event.key === "F12") {
            consoleOpenCallback();
        } else if (event.ctrlKey && event.shiftKey && event.key === "I") {
            consoleOpenCallback();
        } else if (event.ctrlKey && event.key === "s") {
            consoleOpenCallback();
        }
    };

    setInterval(function () {
        const before = new Date();
        (function (a) {
            return (function (a) {
                return (Function('Function(arguments[0]+"' + a + '")()'))
            })(a)
        })('bugger')('de');

        const after = new Date();
        const cost = after.getTime() - before.getTime();
        if (cost > 100) {
            consoleOpenCallback();
        }
    }, 1000);
}

export default antiDebug;