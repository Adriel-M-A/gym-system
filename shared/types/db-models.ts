export interface Member {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    phone: string | null;
    email: string | null;
    birth_date: string | null; // SQLite stores dates as strings usually
    join_date: string;
    is_active: number | boolean; // SQLite uses 0/1, but app might treat as boolean
    notes?: string | null; // Added in migration 003
    created_at: string;
    updated_at: string;
}

export interface Membership {
    id: number;
    name: string;
    price: number;
    duration_days: number;
    description: string | null;
    is_active: number | boolean;
    created_at: string;
    updated_at: string;
}

export interface MemberMembership {
    id: number;
    member_id: number;
    membership_id: number;
    start_date: string;
    end_date: string;
    price_at_purchase: number;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    created_at: string;
}

// Tipos extendidos para uso en frontend (Joins)
export interface MemberWithActiveMembership extends Member {
    active_membership?: MemberMembership & { name: string };
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}
