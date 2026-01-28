import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const isDev = !app.isPackaged;

// En desarrollo, guardamos la DB en la raíz del proyecto.
// En producción, en la carpeta de datos de usuario del SO.
const dbPath = isDev
    ? path.join(process.cwd(), 'database.db')
    : path.join(app.getPath('userData'), 'database.db');

const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');

export default db;
