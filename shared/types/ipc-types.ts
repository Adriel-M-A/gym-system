import { Member, MemberWithActiveMembership, Membership } from './db-models';

export interface IPCAPI {
    db: {
        getUsers: () => Promise<any[]>;
        createUser: (user: any) => Promise<any>;
    };
    members: {
        create: (data: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => Promise<number>;
        update: (id: number, data: Partial<Omit<Member, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
        getAll: (params?: { search?: string }) => Promise<MemberWithActiveMembership[]>;
        getById: (id: number) => Promise<MemberWithActiveMembership | null>;
        toggleStatus: (id: number) => Promise<boolean>;
        assignMembership: (memberId: number, membershipId: number) => Promise<void>;
        getExpired: () => Promise<Member[]>;
    };
    memberships: {
        create: (data: Omit<Membership, 'id' | 'created_at' | 'updated_at'>) => Promise<number>;
        update: (id: number, data: Partial<Omit<Membership, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
        getAll: (active?: boolean) => Promise<Membership[]>;
        delete: (id: number) => Promise<void>;
    };
    platform: string;
}
