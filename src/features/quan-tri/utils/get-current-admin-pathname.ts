const ADMIN_ATLD = "atld";
const ADMIN_HOC_NGHE = "hoc-nghe";
const ADMIN_USER = "user";

export const getCurrentAdminPathname = (pathname: string, isStaff?: boolean) => {
    if (isStaff) return ADMIN_USER;

    if (pathname.includes(ADMIN_ATLD)) return ADMIN_ATLD;

    if (pathname.includes(ADMIN_HOC_NGHE)) return ADMIN_HOC_NGHE;

    if (pathname.includes(ADMIN_USER)) return ADMIN_USER;

    return ADMIN_ATLD;
};
