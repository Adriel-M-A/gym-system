import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Comentario: Función de utilidad para combinar clases de Tailwind de manera segura.
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
