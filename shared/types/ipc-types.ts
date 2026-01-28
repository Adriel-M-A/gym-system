import { Member, MemberWithActiveMembership, Membership } from './db-models';

export interface IpcApi {
    db: {
        getUsers: () => Promise<any[]>; // Refinar cuando tengamos User definido
        createUser: (user: any) => Promise<any>;
    };
    members: {
        create: (data: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => Promise<number>;
        update: (id: number, data: Partial<Member>) => Promise<void>;
        getAll: (params?: { search?: string }) => Promise<MemberWithActiveMembership[]>;
        getById: (id: number) => Promise<MemberWithActiveMembership | null>;
        toggleStatus: (id: number) => Promise<boolean>;
        assignMembership: (memberId: number, membershipId: number) => Promise<void>;
        getExpired: () => Promise<Member[]>;
    };
    memberships: {
        create: (data: Omit<Membership, 'id' | 'created_at'>) => Promise<number>;
        update: (id: number, data: Partial<Membership>) => Promise<void>;
        getAll: (active?: boolean) => Promise<Membership[]>;
        delete: (id: number) => Promise<void>;
    };
    platform: string;
}

// Para extender el objeto window globalmente
declare global {
    interface Window {
        api: IpcApi;
    }
}
