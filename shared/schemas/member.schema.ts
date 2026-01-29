import { z } from 'zod';

export const MemberSchema = z.object({
    id: z.number().optional(), // Optional for creation
    first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z.string().min(6, "El DNI/Documento debe tener al menos 6 caracteres"),
    phone: z.string().optional().nullable(),
    email: z.string().email("Email inválido").optional().or(z.literal('')),
    birth_date: z.string().optional().nullable(), // Store as YYYY-MM-DD string
    notes: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
    created_at: z.string().optional(),
    updated_at: z.string().optional()
});

export type Member = z.infer<typeof MemberSchema>;
