const membersService = require('./members.service');

function registerIpc(ipcMain) {
    // --- Members ---
    ipcMain.handle('members:create', async (_, data) => {
        return membersService.createMember(data);
    });

    ipcMain.handle('members:update', async (_, { id, data }) => {
        return membersService.updateMember(id, data);
    });

    ipcMain.handle('members:get-all', async (_, { onlyActive } = {}) => {
        return membersService.getAllMembers(onlyActive);
    });

    ipcMain.handle('members:get-by-id', async (_, id) => {
        return membersService.getMemberDetail(id);
    });

    ipcMain.handle('members:toggle-status', async (_, id) => {
        return membersService.toggleActiveStatus(id);
    });

    // --- Subscriptions ---
    ipcMain.handle('members:assign-membership', async (_, { memberId, membershipId }) => {
        return membersService.assignMembership(memberId, membershipId);
    });

    ipcMain.handle('members:get-expired', async () => {
        return membersService.getExpiredMembers();
    });
}

module.exports = { registerIpc };
