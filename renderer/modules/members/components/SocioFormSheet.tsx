import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SheetLayout } from "@/components/layout/SheetLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { Member } from '@/shared/types/db-models';

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
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        dni: '',
        phone: '',
        email: '',
        birth_date: '',
        notes: ''
    });

    // Reset form when opening/closing or changing memberToEdit
    useEffect(() => {
        if (open) {
            if (memberToEdit) {
                setFormData({
                    first_name: memberToEdit.first_name || '',
                    last_name: memberToEdit.last_name || '',
                    dni: memberToEdit.dni || '',
                    phone: memberToEdit.phone || '',
                    email: memberToEdit.email || '',
                    birth_date: memberToEdit.birth_date || '', // Expected YYYY-MM-DD
                    notes: memberToEdit.notes || ''
                });
            } else {
                setFormData({
                    first_name: '',
                    last_name: '',
                    dni: '',
                    phone: '',
                    email: '',
                    birth_date: '',
                    notes: ''
                });
            }
        }
    }, [open, memberToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing && memberToEdit) {
                await window.api.members.update(memberToEdit.id, formData);
            } else {
                await window.api.members.create(formData);
            }
            onSuccess?.();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error saving member:", error);
            alert("Error al guardar: " + error.message);
        } finally {
            setLoading(false);
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
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    }
                >
                    <form id="member-form" onSubmit={handleSubmit} className="p-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Juan"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Apellido <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Pérez"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                DNI / Documento <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                required
                                placeholder="12345678"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Teléfono
                                </label>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="555-1234"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Fecha Nacimiento
                                </label>
                                <Input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="juan@ejemplo.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Notas
                            </label>
                            <textarea
                                className={cn(
                                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                )}
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Información adicional (lesiones, preferencias, etc.)"
                            />
                        </div>
                    </form>
                </SheetLayout>
            </SheetContent>
        </Sheet>
    );
}
