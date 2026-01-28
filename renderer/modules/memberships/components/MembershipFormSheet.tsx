import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SheetLayout } from "@/components/layout/SheetLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { Membership } from '@/shared/types/db-models';

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
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration_days: '',
        description: ''
    });

    useEffect(() => {
        if (open) {
            if (membershipToEdit) {
                setFormData({
                    name: membershipToEdit.name || '',
                    price: membershipToEdit.price ? membershipToEdit.price.toString() : '',
                    duration_days: membershipToEdit.duration_days ? membershipToEdit.duration_days.toString() : '',
                    description: membershipToEdit.description || ''
                });
            } else {
                setFormData({
                    name: '',
                    price: '',
                    duration_days: '',
                    description: ''
                });
            }
        }
    }, [open, membershipToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                duration_days: parseInt(formData.duration_days)
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
        } finally {
            setLoading(false);
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
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    }
                >
                    <form id="membership-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Nombre del Plan <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Ej: Mensual Full, Pase Diario"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Precio ($) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Duración (Días) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    name="duration_days"
                                    value={formData.duration_days}
                                    onChange={handleChange}
                                    required
                                    placeholder="30"
                                    min="1"
                                />
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
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detalles sobre qué incluye este plan..."
                            />
                        </div>
                    </form>
                </SheetLayout>
            </SheetContent>
        </Sheet>
    );
}
