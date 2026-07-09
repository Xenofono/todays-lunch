import {ReactNode} from "react";
import {cn} from "@/lib/utils";

export type TypographyProps = {
    children: ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLElement>;

/** The giant serif masthead title. */
export function TypographyMasthead({ children, className, ...props }: TypographyProps) {
    return (
        <h1
            className={cn("text-center font-serif text-[clamp(52px,9vw,96px)] font-normal leading-[.95] tracking-[-.015em] text-foreground", className)}
            {...props}
        >
            {children}
        </h1>
    );
}

/**
 * Serif headline — entry names (default 23px). Dialog titles (26px) and the
 * winner name (40px) override the size via className.
 */
export function TypographyHeadline({ children, className, ...props }: TypographyProps) {
    return (
        <h2
            className={cn("font-serif text-[23px] font-normal leading-[1.1] text-foreground", className)}
            {...props}
        >
            {children}
        </h2>
    );
}

/**
 * Tracked uppercase sans label — kickers, entry indices, day labels, stamps,
 * button captions. No default color so buttons/links can drive hover states.
 */
export function TypographyKicker({ children, className, ...props }: TypographyProps) {
    return (
        <span
            className={cn("font-sans text-[10px] font-bold leading-none tracking-[.18em]", className)}
            {...props}
        >
            {children}
        </span>
    );
}

/** Italic serif editorial copy — taglines, info lines, notices, captions. */
export function TypographyEditorial({ children, className, ...props }: TypographyProps) {
    return (
        <p
            className={cn("font-serif text-[13.5px] italic leading-relaxed text-muted-foreground", className)}
            {...props}
        >
            {children}
        </p>
    );
}

/** Plain sans body text — dish lines and other running copy. */
export function TypographyBody({ children, className, ...props }: TypographyProps) {
    return (
        <div
            className={cn("font-sans text-[14px] leading-normal text-foreground", className)}
            {...props}
        >
            {children}
        </div>
    );
}
