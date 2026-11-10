import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "icon";
}) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
        danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    };

    const sizes = {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        icon: "p-2",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}

export function Input({
    className,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm",
                "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-gray-400",
                "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            {...props}
        />
    );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn(
                "text-xs font-medium leading-none text-gray-500",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                "mb-1.5 block",
                className
            )}
            {...props}
        />
    );
}

export function Card({
    className,
    children,
    role,
    "aria-label": ariaLabel,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
    return (
        <div
            className={cn(
                "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm",
                className
            )}
            role={role}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </div>
    );
}

/**
 * Visually hidden element for screen readers
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
    return (
        <span
            className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
            style={{ clip: "rect(0, 0, 0, 0)" }}
        >
            {children}
        </span>
    );
}

