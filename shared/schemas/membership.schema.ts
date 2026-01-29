import { z } from 'zod';

export const MembershipSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().optional().nullable(),
    price: z.number().min(0, "El precio no puede ser negativo"),
    duration_days: z.number().int().min(1, "La duración debe ser al menos 1 día"),
    is_active: z.boolean().default(true),
    created_at: z.string().optional(),
    updated_at: z.string().optional()
});

export type Membership = z.infer<typeof MembershipSchema>;
