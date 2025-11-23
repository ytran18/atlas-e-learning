import { FunctionComponent, PropsWithChildren } from "react";

import { HTMLMotionProps, Variants, motion } from "framer-motion";

type AnimatedH1Props = PropsWithChildren<{
    className?: string;
    variants?: Variants;
}> &
    HTMLMotionProps<"h1">;

const AnimatedH1: FunctionComponent<AnimatedH1Props> = ({
    children,
    className,
    variants,
    ...props
}) => {
    return (
        <motion.h1 variants={variants} className={className} {...props}>
            {children}
        </motion.h1>
    );
};

export default AnimatedH1;
