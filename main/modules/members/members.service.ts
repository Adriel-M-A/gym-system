import membersRepo from './members.repository';
import membershipsRepo from '../memberships/memberships.repository';
// Importamos dateUtils. Si no está migrado, usaremos require o asumiremos existe.
// Asumiremos que lo migraremos a .ts también.
import dateUtils from '../../utils/date.utils';
import { Member, MemberWithActiveMembership } from '../../../shared/types/db-models';

class MembersService {

    createMember(data: Partial<Member>) {
        // Validar duplicado por DNI
        if (data.dni) {
            const existing = membersRepo.getMemberByDni(data.dni);
            if (existing) {
                throw new Error(`Ya existe un socio con DNI ${data.dni}`);
            }
        }
        return membersRepo.createMember(data);
    }

    updateMember(id: number, data: Partial<Member>) {
        if (data.dni) {
            const existing = membersRepo.getMemberByDni(data.dni);
            if (existing && existing.id !== id) {
                throw new Error(`El DNI ${data.dni} ya pertenece a otro socio`);
            }
        }
        return membersRepo.updateMember(id, data);
    }

    toggleActiveStatus(id: number) {
        const member = membersRepo.getMemberById(id);
        if (!member) throw new Error('Socio no encontrado');
        // member.is_active puede ser 0 o 1, al negar !member.is_active funciona igual
        return membersRepo.setMemberStatus(id, !member.is_active);
    }

    getAllMembers(params: { search?: string, onlyActive?: boolean } = {}) {
        // params: { search, onlyActive }
        const members = membersRepo.getMembers(params);

        // El repositorio ya devuelve MemberWithActiveMembership casi listo,
        // pero la lógica original hacía un mapeo manual.
        // En members.repository.ts ya hicimos el mapeo.
        // Si membersRepo.getMembers devuelve la estructura correcta, devolvemos directo.
        // Sin embargo, el repo devuelve active_membership populado.

        return members;
    }

    getMemberDetail(id: number) {
        const member = membersRepo.getMemberById(id) as MemberWithActiveMembership;
        if (!member) throw new Error('Socio no encontrado');

        const activeMembership = membersRepo.getActiveMembership(id);
        if (activeMembership) {
            member.active_membership = {
                ...activeMembership,
                status: activeMembership.status as 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
            } as any;
        }
        return member;
    }

    assignMembership(memberId: number, membershipId: number) {
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

export default new MembersService();
