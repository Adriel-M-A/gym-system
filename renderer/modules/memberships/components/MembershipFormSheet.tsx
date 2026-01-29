import React, { useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SheetLayout } from "@/components/layout/SheetLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { Membership } from '@/shared/types/db-models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MembershipSchema } from '@/shared/schemas/membership.schema';

interface MembershipFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    membershipToEdit?: Membership | null;
    onSuccess?: () => void;
}

export function MembershipFormSheet({
    open,
    onOpenChange,
    membershipToEdit = null,
    onSuccess
}: MembershipFormSheetProps) {
    const isEditing = !!membershipToEdit;

    // Define schema specifically for the form (excluding system fields)
    // We use .required() to ensure strictness if needed, but the base schema is good.
    const formSchema = MembershipSchema.omit({
        id: true,
        created_at: true,
        updated_at: true
    });

    type FormValues = z.input<typeof formSchema>;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            price: 0,
            duration_days: 30,
            description: null,
            is_active: true
        }
    });

    useEffect(() => {
        if (open) {
            if (membershipToEdit) {
                reset({
                    name: membershipToEdit.name,
                    price: membershipToEdit.price,
                    duration_days: membershipToEdit.duration_days,
                    description: membershipToEdit.description || null,
                    is_active: Boolean(membershipToEdit.is_active)
                });
            } else {
                reset({
                    name: '',
                    price: 0,
                    duration_days: 30,
                    description: null,
                    is_active: true
                });
            }
        }
    }, [open, membershipToEdit, reset]);

    const onSubmit = async (data: FormValues) => {
        try {
            // Explicitly map data to match the IPC contract
            // IPC expects Omit<Membership, 'id' | 'created_at' | 'updated_at'>
            // which is: { name, price, duration_days, description, is_active }
            // data.is_active is optional in z.input, so default to true.
            const payload = {
                name: data.name,
                price: data.price,
                duration_days: data.duration_days,
                description: data.description || null,
                is_active: data.is_active ?? true
            };

            if (isEditing && membershipToEdit) {
                await window.api.memberships.update(membershipToEdit.id, payload);
            } else {
                await window.api.memberships.create(payload);
            }
            onSuccess?.();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error saving membership:", error);
            alert("Error al guardar: " + error.message);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-0 sm:max-w-md w-full">
                <SheetLayout
                    title={isEditing ? "Editar Membresía" : "Nueva Membresía"}
                    description={isEditing ? "Modifica los detalles del plan." : "Crea un nuevo plan de suscripción."}
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
                    <form id="membership-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Nombre del Plan <span className="text-red-500">*</span>
                            </label>
                            <Input
                                {...register('name')}
                                placeholder="Ej: Mensual Full, Pase Diario"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Precio ($) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    {...register('price', { valueAsNumber: true })}
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Duración (Días) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    {...register('duration_days', { valueAsNumber: true })}
                                    min="1"
                                    placeholder="30"
                                />
                                {errors.duration_days && <p className="text-red-500 text-xs">{errors.duration_days.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Descripción
                            </label>
                            <textarea
                                className={cn(
                                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                )}
                                {...register('description')}
                                placeholder="Detalles sobre qué incluye este plan..."
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                        </div>
                    </form>
                </SheetLayout>
            </SheetContent>
        </Sheet>
    );
}
