import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names and resolves conflicting Tailwind utilities,
 * so later classes win (used by shadcn components).
 *
 * @example
 * cn("px-2 text-sm", isActive && "underline", "px-4") // "text-sm underline px-4"
 */
export const cn = (...inputs: ClassValue[]) =>
	twMerge(clsx(inputs));
