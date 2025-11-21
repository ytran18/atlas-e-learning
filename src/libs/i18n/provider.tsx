import React, { FunctionComponent, PropsWithChildren, useContext } from "react";

import { fallbackLng } from "./settings";

interface I18nContextProps {
    lng: string;
}

export const I18nContext = React.createContext<I18nContextProps>({
    lng: fallbackLng,
});

export type I18nProviderProps = PropsWithChildren<{
    lng: string;
}>;

export const I18nProvider: FunctionComponent<I18nProviderProps> = (props) => {
    return <I18nContext.Provider value={{ lng: props.lng }}>{props.children}</I18nContext.Provider>;
};

export const useI18nContext = () => useContext(I18nContext);
