import { redirect } from "next/navigation";

export default function RootPage() {
    // This page will be protected by middleware
    // If user reaches here, they are authenticated
    redirect("/home");
}
