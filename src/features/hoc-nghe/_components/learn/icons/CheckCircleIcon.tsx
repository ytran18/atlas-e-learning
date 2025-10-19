interface CheckCircleIconProps {
    className?: string;
}

const CheckCircleIcon = ({ className = "w-4 h-4" }: CheckCircleIconProps) => {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
};

export default CheckCircleIcon;
