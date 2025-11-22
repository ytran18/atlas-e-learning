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

export enum Language {
    VIETNAM = "vi",
    ENGLISH = "en",
    KOREAN = "kr",
}

export type ListLanguaeType = {
    value: Language;
    label: string;
};

export const listLanguages: ListLanguaeType[] = [
    { value: Language.VIETNAM, label: "Tiếng Việt" },
    { value: Language.ENGLISH, label: "English" },
    { value: Language.KOREAN, label: "한국어" },
];
