import { isBrowser } from "./is-browser";

export const getIsWebView = (userAgent?: string) => {
    let ua = userAgent || "";

    if (isBrowser() && !userAgent) {
        ua = navigator.userAgent;
    }

    const isWebView =
        /wv|WebView|(iPhone|iPod|iPad)(?!.*Safari)|Android.*(wv|Version\/\d+\.\d+).*Chrome\/\d+\.\d+\.\d+\.\d+/i.test(
            ua
        );
    return isWebView;
};
