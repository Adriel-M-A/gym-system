const membersRepo = require('./members.repository');
const membershipsRepo = require('../memberships/memberships.repository');
const dateUtils = require('../../utils/date.utils');

class MembersService {

    createMember(data) {
        // Validar duplicado por DNI
        const existing = membersRepo.getMemberByDni(data.dni);
        if (existing) {
            throw new Error(`Ya existe un socio con DNI ${data.dni}`);
        }
        return membersRepo.createMember(data);
    }

    updateMember(id, data) {
        // Validar si dni cambió y ya existe otro
        const existing = membersRepo.getMemberByDni(data.dni);
        if (existing && existing.id !== id) {
            throw new Error(`El DNI ${data.dni} ya pertenece a otro socio`);
        }
        return membersRepo.updateMember(id, data);

    }

    toggleActiveStatus(id) {
        const member = membersRepo.getMemberById(id);
        if (!member) throw new Error('Socio no encontrado');
        return membersRepo.setMemberStatus(id, !member.is_active);
    }

    getAllMembers(params = {}) {
        // params: { search, onlyActive }
        const members = membersRepo.getMembers(params);
        return members.map(m => ({
            ...m,
            active_membership: m.membership_name ? {
                name: m.membership_name,
                status: m.membership_status,
                end_date: m.membership_end_date
            } : null
        }));
    }

    getMemberDetail(id) {
        const member = membersRepo.getMemberById(id);
        if (!member) throw new Error('Socio no encontrado');
        member.active_membership = membersRepo.getActiveMembership(id);
        return member;
    }

    assignMembership(memberId, membershipId) {
        const membership = membershipsRepo.getMembershipById(membershipId);
        if (!membership) throw new Error('Membresía no encontrada');

        const startDate = new Date();
        const endDate = dateUtils.addDays(startDate, membership.duration_days);

        const assignmentData = {
            memberId,
            membershipId,
            startDate: dateUtils.toLocalDate(startDate),
            endDate: dateUtils.toLocalDate(endDate),
            price: membership.price
        };

        return membersRepo.assignMembership(assignmentData);
    }

    getExpiredMembers() {
        return membersRepo.getMembersWithExpiredMemberships();
    }
}

module.exports = new MembersService();
