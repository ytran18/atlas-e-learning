export const ATLD_SLUG = "atld";
export const HOC_NGHE_SLUG = "hocNgheId";

export const navigationPaths = {
    LANDING_PAGE: "/landing-page",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    ATLD: "/atld",
    HOC_NGHE: "/hoc-nghe",
    ADMIN: "/admin",
    ATLD_PREVIEW: `/atld/[${ATLD_SLUG}]`,
    HOC_NGHE_PREVIEW: `/hoc-nghe/[${HOC_NGHE_SLUG}]`,
    ATLD_LEARN: `/atld/[${ATLD_SLUG}]/learn`,
    ATLD_VERIFY: `/atld/[${ATLD_SLUG}]/verify`,
    HOC_NGHE_LEARN: `/hoc-nghe/[${HOC_NGHE_SLUG}]/learn`,
    HOC_NGHE_VERIFY: `/hoc-nghe/[${HOC_NGHE_SLUG}]/verify`,
};

export const publicPaths = [
    navigationPaths.LANDING_PAGE,
    navigationPaths.SIGN_IN,
    navigationPaths.SIGN_UP,
];
