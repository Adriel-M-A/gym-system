// main/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("api", {
  platform: process.platform,
  // Comentario: API segura para base de datos
  db: {
    getUsers: () => import_electron.ipcRenderer.invoke("db:get-users"),
    createUser: (user) => import_electron.ipcRenderer.invoke("db:create-user", user)
  },
  // Módulo 1: Socios
  members: {
    create: (data) => import_electron.ipcRenderer.invoke("members:create", data),
    update: (id, data) => import_electron.ipcRenderer.invoke("members:update", { id, data }),
    getAll: (params) => import_electron.ipcRenderer.invoke("members:get-all", params),
    getById: (id) => import_electron.ipcRenderer.invoke("members:get-by-id", id),
    toggleStatus: (id) => import_electron.ipcRenderer.invoke("members:toggle-status", id),
    assignMembership: (memberId, membershipId) => import_electron.ipcRenderer.invoke("members:assign-membership", { memberId, membershipId }),
    getExpired: () => import_electron.ipcRenderer.invoke("members:get-expired")
  },
  // Módulo 1: Membresías
  memberships: {
    create: (data) => import_electron.ipcRenderer.invoke("memberships:create", data),
    update: (id, data) => import_electron.ipcRenderer.invoke("memberships:update", { id, data }),
    getAll: (params) => import_electron.ipcRenderer.invoke("memberships:get-all", params),
    // params usually { onlyActive }
    delete: (id) => import_electron.ipcRenderer.invoke("memberships:delete", id)
  }
});
//# sourceMappingURL=preload.js.map