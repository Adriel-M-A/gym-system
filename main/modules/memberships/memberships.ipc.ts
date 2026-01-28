import { IpcMain } from 'electron';
import membershipsService from './memberships.service';

function registerIpc(ipcMain: IpcMain) {
    ipcMain.handle('memberships:create', async (_, data) => {
        return membershipsService.createMembership(data);
    });

    ipcMain.handle('memberships:update', async (_, { id, data }) => {
        return membershipsService.updateMembership(id, data);
    });

    ipcMain.handle('memberships:get-all', async (_, { onlyActive } = {}) => {
        return membershipsService.getAllMemberships(onlyActive);
    });

    ipcMain.handle('memberships:delete', async (_, id) => {
        return membershipsService.deleteMembership(id);
    });
}

export default { registerIpc };
