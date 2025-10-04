"use client";

import { useEffect, useRef } from "react";

import { SignUp as ClerkSignUp } from "@clerk/nextjs";

const SignUp = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Function to disable autofill
        const disableAutofill = () => {
            const inputs = containerRef.current?.querySelectorAll("input");
            inputs?.forEach((input) => {
                input.setAttribute("autocomplete", "new-password");
                input.setAttribute("data-form-type", "other");
            });
        };

        // Function to add hint text for username
        const addHintText = () => {
            const usernameInput = containerRef.current?.querySelector(
                'input[name="username"]'
            ) as HTMLInputElement;

            if (!usernameInput) return;

            // Check if hint already exists
            const existingHint = usernameInput.parentElement?.querySelector(".username-hint");
            if (existingHint) return;

            // Create hint element
            const hintDiv = document.createElement("div");
            hintDiv.className = "username-hint";
            hintDiv.style.color = "#FF0000";
            hintDiv.style.fontSize = "13px";
            hintDiv.style.textAlign = "left";
            hintDiv.textContent =
                "* Nhập CC- theo sau là 12 số căn cước công dân của bạn, VD: CC-012345678901";

            // Insert hint after input
            usernameInput.parentElement?.appendChild(hintDiv);
        };

        // Set timeout để đợi Clerk render xong
        const timer = setTimeout(() => {
            disableAutofill();
            addHintText();
        }, 100);

        // Observer để theo dõi khi có input mới được thêm vào
        const observer = new MutationObserver(() => {
            disableAutofill();
            addHintText();
        });
        observer.observe(containerRef.current, {
            childList: true,
            subtree: true,
        });

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-screen h-screen flex items-center justify-center">
            <ClerkSignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                appearance={{
                    elements: {
                        formFieldInput__username: {
                            textTransform: "uppercase",
                        },
                        formFieldInput: {
                            "&:-webkit-autofill": {
                                WebkitBoxShadow: "0 0 0 1000px white inset",
                                WebkitTextFillColor: "#000",
                            },
                        },
                        formFieldHintText: {
                            color: "#6b7280",
                            fontSize: "13px",
                            marginTop: "6px",
                        },
                    },
                }}
            />
        </div>
    );
};

export default SignUp;
