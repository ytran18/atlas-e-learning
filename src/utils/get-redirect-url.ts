import { isAndroid, isIOS, isSamsungBrowser } from "react-device-detect";

export const getRedirectUrl = (
    baseUrl: { android: string; ios: string },
    pathname: string,
    searchParamsString: string
) => {
    if (isAndroid) {
        return `intent://${baseUrl.android}${pathname}${searchParamsString}#Intent;scheme=https;end`;
    }

    if (isIOS) {
        return `x-safari-${baseUrl.ios}${pathname}${searchParamsString}`;
    }

    if (isSamsungBrowser) {
        return `intent://${baseUrl.android}${pathname}${searchParamsString}/#Intent;scheme=https;package=com.sec.android.app.sbrowser;end`;
    }

    return `${baseUrl.ios}${pathname}${searchParamsString}`;
};
