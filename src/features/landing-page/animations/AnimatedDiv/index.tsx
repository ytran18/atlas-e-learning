"use client";

import { FunctionComponent, PropsWithChildren } from "react";

import { HTMLMotionProps, Variants, motion } from "framer-motion";

type AnimatedDivProps = PropsWithChildren<{
    className?: string;
    variants?: Variants;
}> &
    HTMLMotionProps<"div">;

const AnimatedDiv: FunctionComponent<AnimatedDivProps> = ({
    children,
    className,
    variants,
    ...props
}) => {
    return (
        <motion.div variants={variants} className={className} {...props}>
            {children}
        </motion.div>
    );
};

export default AnimatedDiv;
