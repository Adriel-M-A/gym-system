const { getAllUsers, createUser } = require('./users.repository');

function registerIpc(ipcMain) {
    ipcMain.handle('db:get-users', () => {
        try {
            return getAllUsers();
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    });

    ipcMain.handle('db:create-user', (event, { name, email }) => {
        try {
            return createUser(name, email);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    });
}

module.exports = { registerIpc };
