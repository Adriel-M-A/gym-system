const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// Comentario: Definimos la ruta de la BD igual que antes.
const dbPath = process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../gym-system.db') // Ajuste de ruta relativa desde main/database/
    : path.join(app.getPath('userData'), 'gym-system.db');

console.log(`[DB] Connecting to database at: ${dbPath}`);

const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');

module.exports = db;
