import { FunctionComponent, PropsWithChildren } from "react";

import { HTMLMotionProps, Variants, motion } from "framer-motion";

type AnimatedParagraphProps = PropsWithChildren<{
    className?: string;
    variants?: Variants;
}> &
    HTMLMotionProps<"p">;

const AnimatedParagraph: FunctionComponent<AnimatedParagraphProps> = ({
    children,
    className,
    variants,
    ...props
}) => {
    return (
        <motion.p variants={variants} className={className} {...props}>
            {children}
        </motion.p>
    );
};

export default AnimatedParagraph;
