const fs = require('fs');
const path = require('path');
const db = require('./connection');

function runMigrations() {
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
    const migrationsDir = path.join(__dirname, 'migrations');

    if (!fs.existsSync(migrationsDir)) {
        console.log('[Migrator] No migrations folder found.');
        return;
    }

    const files = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

    // 3. Ejecutar migraciones pendientes
    const appliedStmt = db.prepare('SELECT name FROM _migrations WHERE name = ?');
    const insertStmt = db.prepare('INSERT INTO _migrations (name) VALUES (?)');

    files.forEach(file => {
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
                throw err; // Detener proceso si falla una migración
            }
        } else {
            // console.log(`[Migrator] Skipping ${file} (already applied).`);
        }
    });

    console.log('[Migrator] All migrations checked.');
}

module.exports = { runMigrations };
