import db from '../../database/connection';
import { Membership } from '../../../shared/types/db-models';
import { RunResult } from 'better-sqlite3';

function createMembership(data: Partial<Membership>): Membership {
    const stmt = db.prepare(`
        INSERT INTO memberships (name, price, duration_days, description)
        VALUES (@name, @price, @duration_days, @description)
    `);
    // Ojo: @durationDays vs @duration_days. En DB original schema (002) es duration_days.
    // El repo original usaba @durationDays, asumo que mandaban el objeto con camelCase.
    // Pero aquí 'data' parcial de Membership tiene snake_case si usamos la interfaz DB.
    // Si viene del frontend/service, suele ser camelCase.
    // Estandaricemos a que data aquí debe coincidir con los parámetros SQL.
    // Voy a cambiar SQL parámetros para usar camelCase para facilitar el paso directo de objetos JS,
    // o mapear. Mejor mapear keys si es necesario, pero SQLite bind @param busca la key param.
    // Usaremos camelCase en el query para coincidir con lo que probablemente envíe el servicio (que recibe del IPC).
    // Aunque... Membership interface tiene duration_days.
    // Si usamos data: Partial<Membership> (interface DB), entonces data.duration_days.
    // Entonces SQL params deben ser @duration_days.

    // Revisión rápida members.repository.js original:
    // INSERT INTO memberships ... VALUES (@name, @price, @durationDays, @description)
    // Esto implica que el objeto data tenía { durationDays: ... }

    // Si queremos ser estrictos con TypeScript, definiremos una interfaz de entrada (Dto).
    // Por ahora, modifico el SQL para esperar duration_days si usamos la interfaz DB.

    // Pero si el frontend manda camelCase...
    // El servicio debería normalizar o el repo.
    // Asumiré que el repo recibe data con formato DB (snake_case) para ser consistente con el tipo Membership.
    // Así que usaré @duration_days.

    const stmtFix = db.prepare(`
        INSERT INTO memberships (name, price, duration_days, description)
        VALUES (@name, @price, @duration_days, @description)
    `);

    const info: RunResult = stmtFix.run(data);
    return { id: Number(info.lastInsertRowid), ...data } as Membership;
}

function updateMembership(id: number, data: Partial<Membership>) {
    const stmt = db.prepare(`
        UPDATE memberships
        SET name = @name, price = @price, duration_days = @duration_days, description = @description
        WHERE id = @id
    `);
    stmt.run({ ...data, id });
    return getMembershipById(id);
}

function getMembershipById(id: number): Membership | undefined {
    return db.prepare('SELECT * FROM memberships WHERE id = ?').get(id) as Membership;
}

function getAllMemberships(onlyActive = true): Membership[] {
    let sql = 'SELECT * FROM memberships';
    if (onlyActive) {
        sql += ' WHERE is_active = 1';
    }
    return db.prepare(sql).all() as Membership[];
}

function deleteMembership(id: number) {
    // Soft delete
    return db.prepare('UPDATE memberships SET is_active = 0 WHERE id = ?').run(id);
}

export default {
    createMembership,
    updateMembership,
    getMembershipById,
    getAllMemberships,
    deleteMembership
};
