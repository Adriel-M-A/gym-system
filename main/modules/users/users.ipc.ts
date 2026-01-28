import { IpcMain } from 'electron';
import usersRepository from './users.repository';

function registerIpc(ipcMain: IpcMain) {
    ipcMain.handle('db:get-users', async () => {
        return usersRepository.getAllUsers();
    });

    ipcMain.handle('db:create-user', async (_, user) => {
        return usersRepository.createUser(user.name, user.email);
    });
}

export default { registerIpc };
