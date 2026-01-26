const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

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
        mainWindow.loadURL('http://localhost:3000');
        // Comentario: Abre las herramientas de desarrollo automáticamente en modo dev.
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

// Comentario: Se ejecuta cuando Electron ha terminado de inicializarse.
app.whenReady().then(() => {
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

// Comentario: Sistema de Base de Datos y Módulos
const { runMigrations } = require('./database/migrator');
const usersModule = require('./modules/users/users.ipc');

// Módulo 1
const membersModule = require('./modules/members/members.ipc');
const membershipsModule = require('./modules/memberships/memberships.ipc');

// Comentario: Inicializar base de datos y migraciones
runMigrations();

// Comentario: Registrar módulos IPC
usersModule.registerIpc(ipcMain);
membersModule.registerIpc(ipcMain);
membershipsModule.registerIpc(ipcMain);
