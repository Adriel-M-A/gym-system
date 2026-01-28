import { contextBridge, ipcRenderer } from 'electron';
import { Member, Membership } from '../shared/types/db-models';

// Comentario: Exponemos una API segura al proceso de renderizado (React).
// Debemos tipar esto para que coincida con IpcApi definido en ipc-types.ts

contextBridge.exposeInMainWorld('api', {
    platform: process.platform,
    // Comentario: API segura para base de datos
    db: {
        getUsers: () => ipcRenderer.invoke('db:get-users'),
        createUser: (user: any) => ipcRenderer.invoke('db:create-user', user),
    },
    // Módulo 1: Socios
    members: {
        create: (data: Partial<Member>) => ipcRenderer.invoke('members:create', data),
        update: (id: number, data: Partial<Member>) => ipcRenderer.invoke('members:update', { id, data }),
        getAll: (params: any) => ipcRenderer.invoke('members:get-all', params),
        getById: (id: number) => ipcRenderer.invoke('members:get-by-id', id),
        toggleStatus: (id: number) => ipcRenderer.invoke('members:toggle-status', id),
        assignMembership: (memberId: number, membershipId: number) => ipcRenderer.invoke('members:assign-membership', { memberId, membershipId }),
        getExpired: () => ipcRenderer.invoke('members:get-expired'),
    },
    // Módulo 1: Membresías
    memberships: {
        create: (data: Partial<Membership>) => ipcRenderer.invoke('memberships:create', data),
        update: (id: number, data: Partial<Membership>) => ipcRenderer.invoke('memberships:update', { id, data }),
        getAll: (params: any) => ipcRenderer.invoke('memberships:get-all', params), // params usually { onlyActive }
        delete: (id: number) => ipcRenderer.invoke('memberships:delete', id),
    }
});
