const ATLD_SLUG = "atld";

const HOC_NGHE_SLUG = "hoc-nghe";

export const navigationPaths = {
    LANDING_PAGE: "/landing-page",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    ATLD: "/atld",
    HOC_NGHE: "/hoc-nghe",
    ADMIN: "/admin",
    ATLD_PREVIEW: `/atld/[${ATLD_SLUG}]`,
    HOC_NGHE_PREVIEW: `/hoc-nghe/[${HOC_NGHE_SLUG}]`,
};

export const publicPaths = [
    navigationPaths.LANDING_PAGE,
    navigationPaths.SIGN_IN,
    navigationPaths.SIGN_UP,
];
