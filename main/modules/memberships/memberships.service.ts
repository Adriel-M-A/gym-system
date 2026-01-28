import membershipsRepo from './memberships.repository';
import { Membership } from '../../../shared/types/db-models';

class MembershipsService {
    createMembership(data: Partial<Membership>) {
        return membershipsRepo.createMembership(data);
    }

    getAllMemberships(onlyActive: boolean) {
        return membershipsRepo.getAllMemberships(onlyActive);
    }

    updateMembership(id: number, data: Partial<Membership>) {
        if (!membershipsRepo.getMembershipById(id)) {
            throw new Error('Membresía no encontrada');
        }
        return membershipsRepo.updateMembership(id, data);
    }

    deleteMembership(id: number) {
        return membershipsRepo.deleteMembership(id);
    }
}

export default new MembershipsService();
