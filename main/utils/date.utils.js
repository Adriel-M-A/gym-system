/**
 * Retorna la fecha actual o dada en formato YYYY-MM-DD usando la zona horaria LOCAL.
 * @param {Date} [date=new Date()] 
 * @returns {string} Fecha local
 */
function toLocalDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Retorna la fecha y hora actual o dada en formato YYYY-MM-DD HH:MM:SS usando la zona horaria LOCAL.
 * @param {Date} [date=new Date()] 
 * @returns {string} Fecha y Hora local
 */
function toLocalDateTime(date = new Date()) {
    const d = toLocalDate(date);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${d} ${hours}:${minutes}:${seconds}`;
}

/**
 * Agrega días a una fecha dada, respetando la zona local.
 * @param {Date} date Fecha base
 * @param {number} days Días a sumar
 * @returns {Date} Nueva instancia de fecha
 */
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports = {
    toLocalDate,
    toLocalDateTime,
    addDays
};
