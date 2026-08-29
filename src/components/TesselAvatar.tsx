import React from "react";

interface TesselAvatarProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
    isThinking?: boolean;
}

const sizeMap = {
    xs: "h-4 w-4 rounded-md",
    sm: "h-6 w-6 rounded-lg",
    md: "h-8 w-8 rounded-xl",
    lg: "h-11 w-11 rounded-2xl",
    xl: "h-16 w-16 rounded-3xl",
};

export const TesselAvatar: React.FC<TesselAvatarProps> = ({
    size = "md",
    className = "",
    isThinking = false,
}) => {
    return (
        <div
            className={`relative flex items-center justify-center shrink-0 select-none bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden ${sizeMap[size]} ${className}`}
        >
            {/* Pure Vector Geometric Tessellation Mark */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-[72%] h-[72%] transition-transform duration-500 ${
                    isThinking ? "scale-110 rotate-12" : "hover:scale-105"
                }`}
            >
                {/* Top Isometric Facet */}
                <path
                    d="M50 14L81 31.5L50 49L19 31.5L50 14Z"
                    fill="url(#tesselTopGrad)"
                    stroke="url(#tesselTopStroke)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />

                {/* Bottom Left Isometric Facet */}
                <path
                    d="M17 35L48 52.5V86L17 68.5V35Z"
                    fill="url(#tesselLeftGrad)"
                    stroke="url(#tesselLeftStroke)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />

                {/* Bottom Right Isometric Facet */}
                <path
                    d="M52 52.5L83 35V68.5L52 86V52.5Z"
                    fill="url(#tesselRightGrad)"
                    stroke="url(#tesselRightStroke)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />

                {/* Central Floating Core Dot */}
                <circle
                    cx="50"
                    cy="50"
                    r="3.5"
                    fill="#38BDF8"
                    className={isThinking ? "animate-ping origin-center" : ""}
                />
                <circle
                    cx="50"
                    cy="50"
                    r="2.5"
                    fill="#FFFFFF"
                />

                {/* Color Gradients */}
                <defs>
                    {/* Top Facet: High-Refraction Cyan to Indigo */}
                    <linearGradient id="tesselTopGrad" x1="19" y1="14" x2="81" y2="49" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38BDF8" stopOpacity="0.9" />
                        <stop offset="0.6" stopColor="#6366F1" stopOpacity="0.85" />
                        <stop offset="1" stopColor="#A855F7" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="tesselTopStroke" x1="19" y1="14" x2="81" y2="49" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#7DD3FC" />
                        <stop offset="1" stopColor="#C084FC" />
                    </linearGradient>

                    {/* Left Facet: Deep Violet to Indigo */}
                    <linearGradient id="tesselLeftGrad" x1="17" y1="35" x2="48" y2="86" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6366F1" stopOpacity="0.75" />
                        <stop offset="1" stopColor="#312E81" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="tesselLeftStroke" x1="17" y1="35" x2="48" y2="86" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#818CF8" />
                        <stop offset="1" stopColor="#4338CA" />
                    </linearGradient>

                    {/* Right Facet: Electric Cyan to Deep Slate */}
                    <linearGradient id="tesselRightGrad" x1="52" y1="35" x2="83" y2="86" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#06B6D4" stopOpacity="0.75" />
                        <stop offset="1" stopColor="#0E7490" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="tesselRightStroke" x1="52" y1="35" x2="83" y2="86" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#67E8F9" />
                        <stop offset="1" stopColor="#0891B2" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Thinking / Active Subtle Ambient Ring */}
            {isThinking && (
                <span className="absolute inset-0 rounded-[inherit] ring-2 ring-cyan-400/60 animate-pulse pointer-events-none" />
            )}
        </div>
    );
};

export default TesselAvatar;
