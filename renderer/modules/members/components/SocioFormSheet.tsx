import React, { useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SheetLayout } from "@/components/layout/SheetLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { Member } from '@/shared/types/db-models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemberSchema, Member as MemberType } from '@/shared/schemas/member.schema';

import { z } from 'zod';

interface SocioFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    memberToEdit?: Member | null;
    onSuccess?: () => void;
}

export function SocioFormSheet({
    open,
    onOpenChange,
    memberToEdit = null,
    onSuccess
}: SocioFormSheetProps) {
    const isEditing = !!memberToEdit;

    // 1. Create specific form schema (omit auto-generated fields logic)
    const formSchema = MemberSchema.omit({
        id: true,
        created_at: true,
        updated_at: true
    });

    type FormValues = z.input<typeof formSchema>;

    // 2. Use typed form
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            dni: '',
            phone: '',
            email: '',
            birth_date: '',
            notes: '',
            is_active: true
        }
    });

    useEffect(() => {
        if (open) {
            if (memberToEdit) {
                reset({
                    first_name: memberToEdit.first_name,
                    last_name: memberToEdit.last_name,
                    dni: memberToEdit.dni,
                    phone: memberToEdit.phone || null,
                    email: memberToEdit.email || '',
                    birth_date: memberToEdit.birth_date || null,
                    notes: memberToEdit.notes || null,
                    is_active: Boolean(memberToEdit.is_active)
                });
            } else {
                reset({
                    first_name: '',
                    last_name: '',
                    dni: '',
                    phone: '',
                    email: '',
                    birth_date: '',
                    notes: '',
                    is_active: true
                });
            }
        }
    }, [open, memberToEdit, reset]);

    const onSubmit = async (data: FormValues) => {
        try {
            // 3. Map to Payload
            // Omit<Member, 'id' | 'created_at' | 'updated_at'> expects:
            // first_name, last_name, dni, phone, email, birth_date, join_date, is_active, notes

            // Note: form schema doesn't have join_date currently? MemberSchema has join_date?
            // Let's check MemberSchema. If it has join_date, we need it. 
            // Usually join_date is auto-set by DB or Backend, but IPC type says Omit only id/created/updated.
            // If Member has join_date, we must provide it or backend must handle it.
            // Assuming backend handles it or it's optional in schema. 
            // Reviewing schema in next step if needed, but for now strict mapping:

            const payload = {
                ...data,
                phone: data.phone || null,
                email: data.email || null,
                birth_date: data.birth_date || null,
                notes: data.notes || null,

                is_active: data.is_active
            };

            // We need to verify if payload matches completely. 
            // MemberSchema has join_date: string.

            if (isEditing && memberToEdit) {
                // Update: partial update
                await window.api.members.update(memberToEdit.id, payload);
            } else {
                // Create: strict type Omit<Member, 'id' | 'created_at' | 'updated_at'>
                // Ensure all fields are present and typed correctly
                await window.api.members.create({
                    ...payload,
                    is_active: payload.is_active ?? true,
                    join_date: (() => {
                        const d = new Date();
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    })()
                });
            }
            onSuccess?.();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error saving member:", error);
            alert("Error al guardar: " + error.message);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-0 sm:max-w-md w-full">
                <SheetLayout
                    title={isEditing ? "Editar Socio" : "Nuevo Socio"}
                    description={isEditing ? "Modifica los datos del socio." : "Ingresa los datos para registrar un nuevo socio."}
                    footer={
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    }
                >
                    <form id="member-form" onSubmit={handleSubmit(onSubmit)} className="p-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    {...register('first_name')}
                                    placeholder="Juan"
                                />
                                {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Apellido <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    {...register('last_name')}
                                    placeholder="Pérez"
                                />
                                {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                DNI / Documento <span className="text-red-500">*</span>
                            </label>
                            <Input
                                {...register('dni')}
                                placeholder="12345678"
                            />
                            {errors.dni && <p className="text-red-500 text-xs">{errors.dni.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Teléfono
                                </label>
                                <Input
                                    {...register('phone')}
                                    placeholder="555-1234"
                                />
                                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Fecha Nacimiento
                                </label>
                                <Input
                                    type="date"
                                    {...register('birth_date')}
                                />
                                {errors.birth_date && <p className="text-red-500 text-xs">{errors.birth_date.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email
                            </label>
                            <Input
                                type="email"
                                {...register('email')}
                                placeholder="juan@ejemplo.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Notas
                            </label>
                            <textarea
                                className={cn(
                                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                )}
                                {...register('notes')}
                                placeholder="Información adicional (lesiones, preferencias, etc.)"
                            />
                            {errors.notes && <p className="text-red-500 text-xs">{errors.notes.message}</p>}
                        </div>
                    </form>
                </SheetLayout>
            </SheetContent>
        </Sheet>
    );
}
