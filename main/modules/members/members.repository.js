const db = require('../../database/connection');

// --- Members CRUD ---

function createMember(data) {
    const stmt = db.prepare(`
        INSERT INTO members (first_name, last_name, dni, phone, email, birth_date)
        VALUES (@firstName, @lastName, @dni, @phone, @email, @birthDate)
    `);
    const info = stmt.run(data);
    return { id: info.lastInsertRowid, ...data };
}

function updateMember(id, data) {
    const stmt = db.prepare(`
        UPDATE members 
        SET first_name = @firstName, last_name = @lastName, dni = @dni, 
            phone = @phone, email = @email, birth_date = @birthDate
        WHERE id = @id
    `);
    stmt.run({ ...data, id });
    return getMemberById(id);
}

function setMemberStatus(id, isActive) {
    const stmt = db.prepare('UPDATE members SET is_active = ? WHERE id = ?');
    stmt.run(isActive ? 1 : 0, id);
    return { id, is_active: isActive };
}

function getMemberById(id) {
    return db.prepare('SELECT * FROM members WHERE id = ?').get(id);
}

function getMemberByDni(dni) {
    return db.prepare('SELECT * FROM members WHERE dni = ?').get(dni);
}

function getMembers(onlyActive = true) {
    let sql = 'SELECT * FROM members';
    if (onlyActive) {
        sql += ' WHERE is_active = 1';
    }
    sql += ' ORDER BY last_name, first_name';
    return db.prepare(sql).all();
}

// --- Member Memberships (Subscriptions) ---

function assignMembership(data) {
    const stmt = db.prepare(`
        INSERT INTO member_memberships (member_id, membership_id, start_date, end_date, price_at_purchase)
        VALUES (@memberId, @membershipId, @startDate, @endDate, @price)
    `);
    const info = stmt.run(data);
    return { id: info.lastInsertRowid, ...data };
}

function getActiveMembership(memberId) {
    // Busca una membresía cuya fecha de fin sea mayor o igual a hoy y no esté cancelada
    return db.prepare(`
        SELECT mm.*, m.name as membership_name 
        FROM member_memberships mm
        JOIN memberships m ON mm.membership_id = m.id
        WHERE mm.member_id = ? 
        AND mm.end_date >= DATE('now')
        AND mm.status = 'ACTIVE'
        ORDER BY mm.end_date DESC
        LIMIT 1
    `).get(memberId);
}

function getMembersWithExpiredMemberships() {
    return db.prepare(`
        SELECT m.*, mm.end_date as expiration_date
        FROM members m
        JOIN member_memberships mm ON m.id = mm.member_id
        WHERE mm.status = 'ACTIVE' AND mm.end_date < DATE('now')
    `).all();
}

module.exports = {
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
