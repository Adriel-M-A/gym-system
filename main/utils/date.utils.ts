/**
 * Retorna la fecha actual o dada en formato YYYY-MM-DD usando la zona horaria LOCAL.
 */
export function toLocalDate(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Retorna la fecha y hora actual o dada en formato YYYY-MM-DD HH:MM:SS usando la zona horaria LOCAL.
 */
export function toLocalDateTime(date: Date = new Date()): string {
    const d = toLocalDate(date);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${d} ${hours}:${minutes}:${seconds}`;
}

/**
 * Agrega días a una fecha dada, respetando la zona local.
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export default {
    toLocalDate,
    toLocalDateTime,
    addDays
};
