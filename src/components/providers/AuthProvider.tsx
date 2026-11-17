
"use client";

import { ReactNode } from "react";
import { AuthProvider as Provider } from "@/context/AuthContext";

export default function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    return <Provider>{children}</Provider>;
}
