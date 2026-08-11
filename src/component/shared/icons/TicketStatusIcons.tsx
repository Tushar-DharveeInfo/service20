import { forwardRef, memo, type SVGProps } from "react";

type IStatusIconProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    strokeWidth?: number;
};

const Released_24x24 = forwardRef<SVGSVGElement, IStatusIconProps>(
    ({ size = 24, fill = "currentColor", strokeWidth = 1, ...props }, ref) => (
        <svg
            ref={ref}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={fill}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            <path d="M12 3v12" />
            <path d="m7 10 5-5 5 5" />
            <path d="M5 21h14" />
        </svg>
    )
);
Released_24x24.displayName = "Released_24x24";

const Accepted_24x24 = forwardRef<SVGSVGElement, IStatusIconProps>(
    ({ size = 24, fill = "currentColor", strokeWidth = 1, ...props }, ref) => (
        <svg
            ref={ref}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            <circle cx="12" cy="12" r="10" fill={fill} />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
);
Accepted_24x24.displayName = "Accepted_24x24";

const Received_24x24 = forwardRef<SVGSVGElement, IStatusIconProps>(
    ({ size = 24, fill = "currentColor", strokeWidth = 1, ...props }, ref) => (
        <svg
            ref={ref}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={fill}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="12 10 16 15 20 10" />
            <line x1="16" x2="16" y1="15" y2="3" />
        </svg>
    )
);
Received_24x24.displayName = "Received_24x24";

export {
    Released_24x24,
    Accepted_24x24,
    Received_24x24,
    Released_24x24 as Released24x24,
    Accepted_24x24 as Accepted24x24,
    Received_24x24 as Received24x24,
};

export default memo(Released_24x24);
