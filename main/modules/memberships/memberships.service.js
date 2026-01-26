const membershipsRepo = require('./memberships.repository');

class MembershipsService {
    createMembership(data) {
        return membershipsRepo.createMembership(data);
    }

    getAllMemberships(onlyActive) {
        return membershipsRepo.getAllMemberships(onlyActive);
    }

    updateMembership(id, data) {
        if (!membershipsRepo.getMembershipById(id)) {
            throw new Error('Membresía no encontrada');
        }
        return membershipsRepo.updateMembership(id, data);
    }

    deleteMembership(id) {
        return membershipsRepo.deleteMembership(id);
    }
}

module.exports = new MembershipsService();
