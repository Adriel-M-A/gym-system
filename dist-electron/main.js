var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// main/main.ts
var import_electron2 = require("electron");
var import_path3 = __toESM(require("path"));

// main/database/migrator.ts
var import_fs = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));

// main/database/connection.ts
var import_better_sqlite3 = __toESM(require("better-sqlite3"));
var import_path = __toESM(require("path"));
var import_electron = require("electron");
var isDev = !import_electron.app.isPackaged;
var dbPath = isDev ? import_path.default.join(process.cwd(), "database.db") : import_path.default.join(import_electron.app.getPath("userData"), "database.db");
var db = new import_better_sqlite3.default(dbPath, { verbose: console.log });
db.pragma("journal_mode = WAL");
var connection_default = db;

// main/database/migrator.ts
function runMigrations() {
  console.log("[Migrator] Starting migrations...");
  connection_default.prepare(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  const migrationsDir = import_path2.default.join(__dirname, "migrations");
  console.log(`[Migrator] Searching for migrations in: ${migrationsDir}`);
  if (!import_fs.default.existsSync(migrationsDir)) {
    console.log(`[Migrator] No migrations folder found at ${migrationsDir}`);
    return;
  }
  const files = import_fs.default.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();
  console.log(`[Migrator] Found ${files.length} migration files:`, files);
  const appliedStmt = connection_default.prepare("SELECT name FROM _migrations WHERE name = ?");
  const insertStmt = connection_default.prepare("INSERT INTO _migrations (name) VALUES (?)");
  files.forEach((file) => {
    const isApplied = appliedStmt.get(file);
    if (!isApplied) {
      console.log(`[Migrator] Applying ${file}...`);
      const script = import_fs.default.readFileSync(import_path2.default.join(migrationsDir, file), "utf-8");
      const transaction = connection_default.transaction(() => {
        connection_default.exec(script);
        insertStmt.run(file);
      });
      try {
        transaction();
        console.log(`[Migrator] ${file} applied successfully.`);
      } catch (err) {
        console.error(`[Migrator] Error applying ${file}:`, err);
        throw err;
      }
    }
  });
  console.log("[Migrator] All migrations checked.");
}

// main/modules/users/users.repository.ts
function getAllUsers() {
  const stmt = connection_default.prepare("SELECT * FROM users ORDER BY created_at DESC");
  return stmt.all();
}
function createUser(name, email) {
  const stmt = connection_default.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  const info = stmt.run(name, email);
  return {
    id: Number(info.lastInsertRowid),
    name,
    email,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
    // Aproximación, idealmente obtener de BD
  };
}
var users_repository_default = {
  getAllUsers,
  createUser
};

// main/modules/users/users.ipc.ts
function registerIpc(ipcMain2) {
  ipcMain2.handle("db:get-users", async () => {
    return users_repository_default.getAllUsers();
  });
  ipcMain2.handle("db:create-user", async (_, user) => {
    return users_repository_default.createUser(user.name, user.email);
  });
}
var users_ipc_default = { registerIpc };

// main/modules/members/members.repository.ts
function createMember(data) {
  const stmt = connection_default.prepare(`
        INSERT INTO members (first_name, last_name, dni, phone, email, birth_date, notes)
        VALUES (@first_name, @last_name, @dni, @phone, @email, @birth_date, @notes)
    `);
  const info = stmt.run(data);
  return { id: Number(info.lastInsertRowid), ...data };
}
function updateMember(id, data) {
  const stmt = connection_default.prepare(`
        UPDATE members 
        SET first_name = @first_name, last_name = @last_name, dni = @dni, 
            phone = @phone, email = @email, birth_date = @birth_date, notes = @notes
        WHERE id = @id
    `);
  stmt.run({ ...data, id });
  return getMemberById(id);
}
function setMemberStatus(id, isActive) {
  const stmt = connection_default.prepare("UPDATE members SET is_active = ? WHERE id = ?");
  stmt.run(isActive ? 1 : 0, id);
  return { id, is_active: isActive };
}
function getMemberById(id) {
  return connection_default.prepare("SELECT * FROM members WHERE id = ?").get(id);
}
function getMemberByDni(dni) {
  return connection_default.prepare("SELECT * FROM members WHERE dni = ?").get(dni);
}
function getMembers(params = {}) {
  const { search, onlyActive = true } = params;
  let sql = `
        SELECT m.*, 
               mm.name as membership_name, 
               mem_sub.status as membership_status,
               mem_sub.end_date as membership_end_date
        FROM members m
        LEFT JOIN (
            SELECT member_id, membership_id, status, end_date
            FROM member_memberships
            WHERE status = 'ACTIVE' AND end_date >= DATE('now', 'localtime')
            GROUP BY member_id
        ) mem_sub ON m.id = mem_sub.member_id
        LEFT JOIN memberships mm ON mem_sub.membership_id = mm.id
        WHERE 1=1
    `;
  const args = [];
  if (onlyActive) {
    sql += " AND m.is_active = 1";
  }
  if (search) {
    sql += " AND (m.first_name LIKE ? OR m.last_name LIKE ? OR m.dni LIKE ?)";
    const likeTerm = `%${search}%`;
    args.push(likeTerm, likeTerm, likeTerm);
  }
  sql += " ORDER BY m.last_name, m.first_name";
  const rows = connection_default.prepare(sql).all(...args);
  return rows.map((row) => {
    const { membership_name, membership_status, membership_end_date, ...memberData } = row;
    const member = { ...memberData };
    if (membership_name) {
      member.active_membership = {
        id: 0,
        // No recuperamos el ID de la tabla intemedia en el SELECT principal de arriba por defecto, revisar si es crítico
        member_id: member.id,
        membership_id: 0,
        // Tampoco
        status: membership_status,
        start_date: "",
        // No recuperado
        end_date: membership_end_date,
        price_at_purchase: 0,
        created_at: "",
        name: membership_name
      };
    }
    return member;
  });
}
function assignMembership(data) {
  const stmt = connection_default.prepare(`
        INSERT INTO member_memberships (member_id, membership_id, start_date, end_date, price_at_purchase)
        VALUES (@memberId, @membershipId, @startDate, @endDate, @price)
    `);
  const info = stmt.run(data);
  return { id: Number(info.lastInsertRowid), ...data };
}
function getActiveMembership(memberId) {
  return connection_default.prepare(`
        SELECT mm.*, m.name as membership_name 
        FROM member_memberships mm
        JOIN memberships m ON mm.membership_id = m.id
        WHERE mm.member_id = ? 
        AND mm.end_date >= DATE('now', 'localtime')
        AND mm.status = 'ACTIVE'
        ORDER BY mm.end_date DESC
        LIMIT 1
    `).get(memberId);
}
function getMembersWithExpiredMemberships() {
  return connection_default.prepare(`
        SELECT m.*, mm.end_date as expiration_date
        FROM members m
        JOIN member_memberships mm ON m.id = mm.member_id
        WHERE mm.status = 'ACTIVE' AND mm.end_date < DATE('now', 'localtime')
    `).all();
}
var members_repository_default = {
  createMember,
  updateMember,
  setMemberStatus,
  getMemberById,
  getMemberByDni,
  getMembers,
  assignMembership,
  getActiveMembership,
  getMembersWithExpiredMemberships
};

// main/modules/memberships/memberships.repository.ts
function createMembership(data) {
  const stmt = connection_default.prepare(`
        INSERT INTO memberships (name, price, duration_days, description)
        VALUES (@name, @price, @duration_days, @description)
    `);
  const stmtFix = connection_default.prepare(`
        INSERT INTO memberships (name, price, duration_days, description)
        VALUES (@name, @price, @duration_days, @description)
    `);
  const info = stmtFix.run(data);
  return { id: Number(info.lastInsertRowid), ...data };
}
function updateMembership(id, data) {
  const stmt = connection_default.prepare(`
        UPDATE memberships
        SET name = @name, price = @price, duration_days = @duration_days, description = @description
        WHERE id = @id
    `);
  stmt.run({ ...data, id });
  return getMembershipById(id);
}
function getMembershipById(id) {
  return connection_default.prepare("SELECT * FROM memberships WHERE id = ?").get(id);
}
function getAllMemberships(onlyActive = true) {
  let sql = "SELECT * FROM memberships";
  if (onlyActive) {
    sql += " WHERE is_active = 1";
  }
  return connection_default.prepare(sql).all();
}
function deleteMembership(id) {
  return connection_default.prepare("UPDATE memberships SET is_active = 0 WHERE id = ?").run(id);
}
var memberships_repository_default = {
  createMembership,
  updateMembership,
  getMembershipById,
  getAllMemberships,
  deleteMembership
};

// main/utils/date.utils.ts
function toLocalDate(date = /* @__PURE__ */ new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function toLocalDateTime(date = /* @__PURE__ */ new Date()) {
  const d = toLocalDate(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${d} ${hours}:${minutes}:${seconds}`;
}
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
var date_utils_default = {
  toLocalDate,
  toLocalDateTime,
  addDays
};

// main/modules/members/members.service.ts
var MembersService = class {
  createMember(data) {
    if (data.dni) {
      const existing = members_repository_default.getMemberByDni(data.dni);
      if (existing) {
        throw new Error(`Ya existe un socio con DNI ${data.dni}`);
      }
    }
    return members_repository_default.createMember(data);
  }
  updateMember(id, data) {
    if (data.dni) {
      const existing = members_repository_default.getMemberByDni(data.dni);
      if (existing && existing.id !== id) {
        throw new Error(`El DNI ${data.dni} ya pertenece a otro socio`);
      }
    }
    return members_repository_default.updateMember(id, data);
  }
  toggleActiveStatus(id) {
    const member = members_repository_default.getMemberById(id);
    if (!member) throw new Error("Socio no encontrado");
    return members_repository_default.setMemberStatus(id, !member.is_active);
  }
  getAllMembers(params = {}) {
    const members = members_repository_default.getMembers(params);
    return members;
  }
  getMemberDetail(id) {
    const member = members_repository_default.getMemberById(id);
    if (!member) throw new Error("Socio no encontrado");
    const activeMembership = members_repository_default.getActiveMembership(id);
    if (activeMembership) {
      member.active_membership = {
        ...activeMembership,
        status: activeMembership.status
      };
    }
    return member;
  }
  assignMembership(memberId, membershipId) {
    const membership = memberships_repository_default.getMembershipById(membershipId);
    if (!membership) throw new Error("Membres\xEDa no encontrada");
    const startDate = /* @__PURE__ */ new Date();
    const endDate = date_utils_default.addDays(startDate, membership.duration_days);
    const assignmentData = {
      memberId,
      membershipId,
      startDate: date_utils_default.toLocalDate(startDate),
      endDate: date_utils_default.toLocalDate(endDate),
      price: membership.price
    };
    return members_repository_default.assignMembership(assignmentData);
  }
  getExpiredMembers() {
    return members_repository_default.getMembersWithExpiredMemberships();
  }
};
var members_service_default = new MembersService();

// main/modules/members/members.ipc.ts
function registerIpc2(ipcMain2) {
  ipcMain2.handle("members:create", async (_, data) => {
    return members_service_default.createMember(data);
  });
  ipcMain2.handle("members:update", async (_, { id, data }) => {
    return members_service_default.updateMember(id, data);
  });
  ipcMain2.handle("members:get-all", async (_, params = {}) => {
    return members_service_default.getAllMembers(params);
  });
  ipcMain2.handle("members:get-by-id", async (_, id) => {
    return members_service_default.getMemberDetail(id);
  });
  ipcMain2.handle("members:toggle-status", async (_, id) => {
    return members_service_default.toggleActiveStatus(id);
  });
  ipcMain2.handle("members:assign-membership", async (_, { memberId, membershipId }) => {
    return members_service_default.assignMembership(memberId, membershipId);
  });
  ipcMain2.handle("members:get-expired", async () => {
    return members_service_default.getExpiredMembers();
  });
}
var members_ipc_default = { registerIpc: registerIpc2 };

// main/modules/memberships/memberships.service.ts
var MembershipsService = class {
  createMembership(data) {
    return memberships_repository_default.createMembership(data);
  }
  getAllMemberships(onlyActive) {
    return memberships_repository_default.getAllMemberships(onlyActive);
  }
  updateMembership(id, data) {
    if (!memberships_repository_default.getMembershipById(id)) {
      throw new Error("Membres\xEDa no encontrada");
    }
    return memberships_repository_default.updateMembership(id, data);
  }
  deleteMembership(id) {
    return memberships_repository_default.deleteMembership(id);
  }
};
var memberships_service_default = new MembershipsService();

// main/modules/memberships/memberships.ipc.ts
function registerIpc3(ipcMain2) {
  ipcMain2.handle("memberships:create", async (_, data) => {
    return memberships_service_default.createMembership(data);
  });
  ipcMain2.handle("memberships:update", async (_, { id, data }) => {
    return memberships_service_default.updateMembership(id, data);
  });
  ipcMain2.handle("memberships:get-all", async (_, { onlyActive } = {}) => {
    return memberships_service_default.getAllMemberships(onlyActive);
  });
  ipcMain2.handle("memberships:delete", async (_, id) => {
    return memberships_service_default.deleteMembership(id);
  });
}
var memberships_ipc_default = { registerIpc: registerIpc3 };

// main/main.ts
function createWindow() {
  const mainWindow = new import_electron2.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: import_path3.default.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  const isDev2 = !import_electron2.app.isPackaged;
  if (isDev2) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(import_path3.default.join(__dirname, "../dist/index.html"));
  }
}
import_electron2.app.whenReady().then(() => {
  runMigrations();
  users_ipc_default.registerIpc(import_electron2.ipcMain);
  members_ipc_default.registerIpc(import_electron2.ipcMain);
  memberships_ipc_default.registerIpc(import_electron2.ipcMain);
  createWindow();
  import_electron2.app.on("activate", () => {
    if (import_electron2.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
import_electron2.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron2.app.quit();
  }
});
//# sourceMappingURL=main.js.map