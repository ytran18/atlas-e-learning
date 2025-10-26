import { IconHammer, IconShield, IconUsers } from "@tabler/icons-react";

export const adminNavItems = [
    {
        value: "atld",
        label: "An toàn lao động",
        icon: IconShield,
        color: "blue",
        href: "/admin/atld",
    },
    {
        value: "hoc-nghe",
        label: "Học nghề",
        icon: IconHammer,
        color: "orange",
        href: "/admin/hoc-nghe",
    },
    { value: "user", label: "Người dùng", icon: IconUsers, color: "teal", href: "/admin/user" },
];
