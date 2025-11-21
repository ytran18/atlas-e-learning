import { useEffect } from "react";

import i18next, { FlatNamespace, KeyPrefix } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { useCookies } from "react-cookie";
import {
    FallbackNs,
    UseTranslationOptions,
    initReactI18next,
    useTranslation as useTranslationOrg,
} from "react-i18next";

import { useI18nContext } from "./provider";
import { getOptions, i18nCookieName, languages } from "./settings";

const runsOnServerSide = typeof window === "undefined";

i18next
    .use(initReactI18next)
    .use(
        resourcesToBackend(
            (language: any, namespace: any) =>
                import(`../../../public/locales/${language}/${namespace}.json`)
        )
    )
    .init({
        ...getOptions(),
        lng: "vi",
        detection: {
            order: ["path", "htmlTag", "cookie", "navigator"],
        },
        preload: runsOnServerSide ? languages : [],
        interpolation: {
            escapeValue: true,
        },
    });

export function useTranslation<
    Ns extends FlatNamespace | FlatNamespace[] | undefined = undefined,
    KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(ns?: Ns, options?: UseTranslationOptions<KPrefix>) {
    const { lng } = useI18nContext();

    const [cookies, setCookie] = useCookies([i18nCookieName]);

    const ret = useTranslationOrg<Ns, KPrefix>(ns, {
        ...options,
        lng,
    });

    const { i18n } = ret;

    if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
        i18n.changeLanguage(lng);
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (i18n.resolvedLanguage !== lng) {
                i18n.changeLanguage(lng);
            }
        }, [lng, i18n]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (cookies[i18nCookieName] === lng || !lng) return;

            setCookie(i18nCookieName, lng, { path: "/" });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [lng]);
    }
    return ret;
}

export default i18next;
