import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['main/main.ts', 'main/preload.ts'],
    outDir: 'dist-electron',
    format: ['cjs'],
    target: 'node16',
    platform: 'node',
    external: ['electron', 'better-sqlite3'],
    clean: true,
    sourcemap: true,
    bundle: true,
    // Copiar carpeta de migraciones manualmente después del build o usar plugin.
    // tsup no tiene 'copy' nativo simple para directorios recursivos en config básico sin plugins.
    // Lo haremos en el script de npm.
    loader: {
        '.sql': 'file' // Solo por si acaso
    }
});
