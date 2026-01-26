const membersRepo = require('./members.repository');
const membershipsRepo = require('../memberships/memberships.repository'); // Dependencia cruzada permitida en Service

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

    getAllMembers(onlyActive) {
        const members = membersRepo.getMembers(onlyActive);
        // Podríamos enriquecer la data aquí con la membresía actual
        return members.map(m => {
            const activeMembership = membersRepo.getActiveMembership(m.id);
            return { ...m, active_membership: activeMembership || null };
        });
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
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + membership.duration_days);

        const assignmentData = {
            memberId,
            membershipId,
            startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
            endDate: endDate.toISOString().split('T')[0],
            price: membership.price
        };

        return membersRepo.assignMembership(assignmentData);
    }

    getExpiredMembers() {
        return membersRepo.getMembersWithExpiredMemberships();
    }
}

module.exports = new MembersService();
