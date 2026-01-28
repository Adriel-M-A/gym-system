import db from '../../database/connection';
import { Member, MemberWithActiveMembership } from '../../../shared/types/db-models';
import { RunResult } from 'better-sqlite3';

// --- Members CRUD ---

function createMember(data: Partial<Member>): Member {
    const stmt = db.prepare(`
        INSERT INTO members (first_name, last_name, dni, phone, email, birth_date, notes)
        VALUES (@first_name, @last_name, @dni, @phone, @email, @birth_date, @notes)
    `);

    // Asegurar mapeo de camelCase a snake_case si es necesario, 
    // pero aquí el objeto 'data' debería venir ya formateado o usamos parámetros nombrados
    // que coincidan con las claves del objeto.
    // El frontend suele enviar camelCase, revisaremos el servicio para la conversión si hace falta.
    // Asumiremos que el servicio pasa los datos listos o las claves coinciden con los @params.
    // Revisando members.repository.js original: VALUES (@firstName...)
    // Entonces el objeto debe tener claves firstName, lastName.
    // Ajustaremos para usar las claves correctas.

    // En el JS original: VALUES (@firstName, @lastName...)
    // Entonces `data` tiene { firstName, lastName ... }

    const info: RunResult = stmt.run(data);
    return { id: Number(info.lastInsertRowid), ...data } as Member;
}

function updateMember(id: number, data: Partial<Member>): Member | undefined {
    // El original usaba @firstName etc.
    const stmt = db.prepare(`
        UPDATE members 
        SET first_name = @first_name, last_name = @last_name, dni = @dni, 
            phone = @phone, email = @email, birth_date = @birth_date, notes = @notes
        WHERE id = @id
    `);
    stmt.run({ ...data, id });
    return getMemberById(id);
}

function setMemberStatus(id: number, isActive: boolean) {
    const stmt = db.prepare('UPDATE members SET is_active = ? WHERE id = ?');
    stmt.run(isActive ? 1 : 0, id);
    return { id, is_active: isActive };
}

function getMemberById(id: number): Member | undefined {
    return db.prepare('SELECT * FROM members WHERE id = ?').get(id) as Member;
}

function getMemberByDni(dni: string): Member | undefined {
    return db.prepare('SELECT * FROM members WHERE dni = ?').get(dni) as Member;
}

function getMembers(params: { search?: string; onlyActive?: boolean } = {}): MemberWithActiveMembership[] {
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

    const args: any[] = [];

    if (onlyActive) {
        sql += ' AND m.is_active = 1';
    }

    if (search) {
        sql += ' AND (m.first_name LIKE ? OR m.last_name LIKE ? OR m.dni LIKE ?)';
        const likeTerm = `%${search}%`;
        args.push(likeTerm, likeTerm, likeTerm);
    }

    sql += ' ORDER BY m.last_name, m.first_name';

    const rows = db.prepare(sql).all(...args) as any[];

    // Mappear a estructura MemberWithActiveMembership
    return rows.map(row => {
        const { membership_name, membership_status, membership_end_date, ...memberData } = row;
        const member: MemberWithActiveMembership = { ...memberData };

        if (membership_name) {
            member.active_membership = {
                id: 0, // No recuperamos el ID de la tabla intemedia en el SELECT principal de arriba por defecto, revisar si es crítico
                member_id: member.id,
                membership_id: 0, // Tampoco
                status: membership_status,
                start_date: '', // No recuperado
                end_date: membership_end_date,
                price_at_purchase: 0,
                created_at: '',
                name: membership_name
            };
        }
        return member;
    });
}

// --- Member Memberships (Subscriptions) ---

function assignMembership(data: any) {
    const stmt = db.prepare(`
        INSERT INTO member_memberships (member_id, membership_id, start_date, end_date, price_at_purchase)
        VALUES (@memberId, @membershipId, @startDate, @endDate, @price)
    `);
    const info: RunResult = stmt.run(data);
    return { id: Number(info.lastInsertRowid), ...data };
}

function getActiveMembership(memberId: number) {
    return db.prepare(`
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
    return db.prepare(`
        SELECT m.*, mm.end_date as expiration_date
        FROM members m
        JOIN member_memberships mm ON m.id = mm.member_id
        WHERE mm.status = 'ACTIVE' AND mm.end_date < DATE('now', 'localtime')
    `).all();
}

export default {
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
