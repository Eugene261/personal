"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileImagesProps {
    images: string[];
    name?: string;
}

export default function ProfileImages({ images, name = "Eugene" }: ProfileImagesProps) {
    const [hovered, setHovered] = useState(false);

    if (!images || images.length === 0) return null;

    const mainImage = images[0];
    const extraImages = images.slice(1);

    // Fan-out positions for extra images (relative offsets from center)
    const fanPositions = [
        { x: -28, y: -18, rotate: -12 },
        { x: 22, y: -24, rotate: 8 },
        { x: -18, y: 20, rotate: -6 },
        { x: 30, y: 12, rotate: 14 },
        { x: -8, y: -30, rotate: -16 },
    ];

    return (
        <div
            className="relative w-20 h-20 sm:w-[88px] sm:h-[88px]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Extra images that fan out on hover */}
            <AnimatePresence>
                {hovered && extraImages.map((img, idx) => {
                    const pos = fanPositions[idx % fanPositions.length];
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6 }}
                            animate={{
                                opacity: 1,
                                x: pos.x,
                                y: pos.y,
                                rotate: pos.rotate,
                                scale: 0.85,
                            }}
                            exit={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                delay: idx * 0.04,
                            }}
                            className="absolute inset-0 z-0"
                        >
                            <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 shadow-lg">
                                <img
                                    src={img}
                                    alt={`${name} photo ${idx + 2}`}
                                    className="w-full h-full object-cover rounded-[22px]"
                                    draggable={false}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Main image (always on top) */}
            <motion.div
                className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 shadow-md cursor-pointer"
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                <img
                    src={mainImage}
                    alt={name}
                    className="w-full h-full object-cover rounded-[22px]"
                    draggable={false}
                />
            </motion.div>
        </div>
    );
}
