"use client";

import { FlatNamespace, KeyPrefix } from "i18next";
import { FallbackNs, UseTranslationOptions } from "react-i18next";

import { useTranslation } from "@/libs/i18n/client";

export const useI18nTranslate = <
    Ns extends FlatNamespace | FlatNamespace[] | undefined = undefined,
    KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
    options?: UseTranslationOptions<KPrefix>
) => {
    return useTranslation("translation", { ...options });
};
