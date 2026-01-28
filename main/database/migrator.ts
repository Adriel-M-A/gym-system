import fs from 'fs';
import path from 'path';
import db from './connection';

export function runMigrations(): void {
    console.log('[Migrator] Starting migrations...');

    // 1. Crear tabla de migraciones si no existe
    db.prepare(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

    // 2. Leer archivos de migración
    // IMPORTANTE: En producción con Vite/Electron, los archivos .sql deben ser copiados a dist
    // o leídos de una manera compatible.
    // Asumiremos que están en __dirname/migrations en dev y prod por ahora,
    // pero esto podría requerir ajustes en vite.config.ts para copiar assets.
    // En dev (ts-node/vite), __dirname puede ser distinto.
    // Usaremos path.resolve para intentar ubicarlo relativo al archivo compilado.

    const migrationsDir = path.join(__dirname, 'migrations');
    console.log(`[Migrator] Searching for migrations in: ${migrationsDir}`);

    if (!fs.existsSync(migrationsDir)) {
        console.log(`[Migrator] No migrations folder found at ${migrationsDir}`);
        return;
    }

    const files = fs.readdirSync(migrationsDir)
        .filter((file) => file.endsWith('.sql'))
        .sort();

    console.log(`[Migrator] Found ${files.length} migration files:`, files);

    // 3. Ejecutar migraciones pendientes
    const appliedStmt = db.prepare('SELECT name FROM _migrations WHERE name = ?');
    const insertStmt = db.prepare('INSERT INTO _migrations (name) VALUES (?)');

    files.forEach((file) => {
        const isApplied = appliedStmt.get(file);

        if (!isApplied) {
            console.log(`[Migrator] Applying ${file}...`);
            const script = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

            const transaction = db.transaction(() => {
                db.exec(script);
                insertStmt.run(file);
            });

            try {
                transaction();
                console.log(`[Migrator] ${file} applied successfully.`);
            } catch (err) {
                console.error(`[Migrator] Error applying ${file}:`, err);
                throw err;
            }
        }
    });

    console.log('[Migrator] All migrations checked.');
}
