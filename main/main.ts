import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { runMigrations } from './database/migrator';
import usersModule from './modules/users/users.ipc';
import membersModule from './modules/members/members.ipc';
import membershipsModule from './modules/memberships/memberships.ipc';

// Comentario: Función para crear la ventana principal de la aplicación.
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Comentario: En desarrollo, carga la URL del servidor de Vite.
    // En producción, carga el archivo HTML compilado.
    const isDev = !app.isPackaged;

    if (isDev) {
        // En dev, Vite corre en 3000 (wait-on tcp:3000 en package.json)
        mainWindow.loadURL('http://localhost:3000');
        // Comentario: Abre las herramientas de desarrollo automáticamente en modo dev.
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

// Comentario: Se ejecuta cuando Electron ha terminado de inicializarse.
app.whenReady().then(() => {
    // Comentario: Inicializar base de datos y migraciones
    runMigrations();

    // Registrar módulos IPC antes de crear ventana
    usersModule.registerIpc(ipcMain);
    membersModule.registerIpc(ipcMain);
    membershipsModule.registerIpc(ipcMain);

    createWindow();

    app.on('activate', () => {
        // Comentario: En macOS, es común recrear la ventana si se hace clic en el dock.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Comentario: Cierra la aplicación cuando todas las ventanas están cerradas (excepto en macOS).
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
