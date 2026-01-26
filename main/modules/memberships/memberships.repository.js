const db = require('../../database/connection');

function createMembership(data) {
    const stmt = db.prepare(`
        INSERT INTO memberships (name, price, duration_days, description)
        VALUES (@name, @price, @durationDays, @description)
    `);
    const info = stmt.run(data);
    return { id: info.lastInsertRowid, ...data };
}

function updateMembership(id, data) {
    const stmt = db.prepare(`
        UPDATE memberships
        SET name = @name, price = @price, duration_days = @durationDays, description = @description
        WHERE id = @id
    `);
    stmt.run({ ...data, id });
    return getMembershipById(id);
}

function getMembershipById(id) {
    return db.prepare('SELECT * FROM memberships WHERE id = ?').get(id);
}

function getAllMemberships(onlyActive = true) {
    let sql = 'SELECT * FROM memberships';
    if (onlyActive) {
        sql += ' WHERE is_active = 1';
    }
    return db.prepare(sql).all();
}

function deleteMembership(id) {
    // Soft delete
    return db.prepare('UPDATE memberships SET is_active = 0 WHERE id = ?').run(id);
}

module.exports = {
    createMembership,
    updateMembership,
    getMembershipById,
    getAllMemberships,
    deleteMembership
};
