export const fallbackLng = "vi";
export const languages = [fallbackLng, "en", "kr"];
export const defaultNS = "translation";
export const i18nCookieName = "Atld.Locale";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
    return {
        // debug: true,
        ns,
        lng,
        defaultNS,
        fallbackLng,
        fallbackNS: defaultNS,
        supportedLngs: languages,
    };
}
