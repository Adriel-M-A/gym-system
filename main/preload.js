const { contextBridge, ipcRenderer } = require('electron');

// Comentario: Exponemos una API segura al proceso de renderizado (React).
contextBridge.exposeInMainWorld('api', {
    platform: process.platform,
    // Comentario: API segura para base de datos
    db: {
        getUsers: () => ipcRenderer.invoke('db:get-users'),
        createUser: (user) => ipcRenderer.invoke('db:create-user', user),
    },
    // Módulo 1: Socios
    members: {
        create: (data) => ipcRenderer.invoke('members:create', data),
        update: (id, data) => ipcRenderer.invoke('members:update', { id, data }),
        getAll: (params) => ipcRenderer.invoke('members:get-all', params),
        getById: (id) => ipcRenderer.invoke('members:get-by-id', id),
        toggleStatus: (id) => ipcRenderer.invoke('members:toggle-status', id),
        assignMembership: (memberId, membershipId) => ipcRenderer.invoke('members:assign-membership', { memberId, membershipId }),
        getExpired: () => ipcRenderer.invoke('members:get-expired'),
    },
    // Módulo 1: Membresías
    memberships: {
        create: (data) => ipcRenderer.invoke('memberships:create', data),
        update: (id, data) => ipcRenderer.invoke('memberships:update', { id, data }),
        getAll: (active) => ipcRenderer.invoke('memberships:get-all', { onlyActive: active }),
        delete: (id) => ipcRenderer.invoke('memberships:delete', id),
    }
});
