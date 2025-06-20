import {ReactNode} from "react";

export type TypographyProps = {
    children: ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLElement>;

export function TypographyH1({ children, className = "", ...props }: TypographyProps) {
    return (
        <h1
            className={`scroll-m-20 text-4xl font-extrabold tracking-tight text-balance ${className}`}
            {...props}
        >
            {children}
        </h1>
    );
}

export function TypographyH2({ children, className = "", ...props }: TypographyProps) {
    return (
        <h2
            className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
            {...props}
        >
            {children}
        </h2>
    );
}

export function TypographyH3({ children, className = "", ...props }: TypographyProps) {
    return (
        <h3
            className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
            {...props}
        >
            {children}
        </h3>
    );
}

export function TypographyH4({ children, className = "", ...props }: TypographyProps) {
    return (
        <h4
            className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
            {...props}
        >
            {children}
        </h4>
    );
}

export function TypographyP({ children, className = "", ...props }: TypographyProps) {
    return (
        <p
            className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}
            {...props}
        >
            {children}
        </p>
    );
}

export function TypographyLarge({ children, className = "", ...props }: TypographyProps) {
    return (
        <div
            className={`text-lg font-semibold ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function TypographySmall({ children, className = "", ...props }: TypographyProps) {
    return (
        <small
            className={`text-sm leading-none font-medium ${className}`}
            {...props}
        >
            {children}
        </small>
    );
}

export function TypographyMuted({ children, className = "", ...props }: TypographyProps) {
    return (
        <p
            className={`text-muted-foreground text-sm ${className}`}
            {...props}
        >
            {children}
        </p>
    );
}