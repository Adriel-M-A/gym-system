import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, MoreHorizontal, Pencil } from "lucide-react";
import { MembershipFormSheet } from '../components/MembershipFormSheet';
import { Membership } from '@/shared/types/db-models';

export const MembershipsPage = () => {
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

    useEffect(() => {
        loadMemberships();
    }, []);

    const loadMemberships = async () => {
        setLoading(true);
        try {
            if (window.api?.memberships) {
                const data = await window.api.memberships.getAll();
                setMemberships(data);
            }
        } catch (error) {
            console.error("Error loading memberships:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedMembership(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (membership: Membership) => {
        setSelectedMembership(membership);
        setIsSheetOpen(true);
    };

    const handleSuccess = () => {
        loadMemberships();
    };

    return (
        <PageLayout
            title="Membresías"
            subtitle="Gestión de planes y suscripciones."
            action={
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Nueva Membresía
                </Button>
            }
        >
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Duración</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Cargando membresías...
                                </TableCell>
                            </TableRow>
                        ) : memberships.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No se encontraron membresías.
                                </TableCell>
                            </TableRow>
                        ) : (
                            memberships.map((membership) => (
                                <TableRow key={membership.id}>
                                    <TableCell className="font-medium">#{membership.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{membership.name}</span>
                                            {membership.description && (
                                                <span className="text-xs text-muted-foreground">{membership.description}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        ${membership.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {membership.duration_days} días
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={membership.is_active ? "default" : "secondary"}
                                        // className={membership.is_active ? "bg-green-500 hover:bg-green-600" : ""}
                                        >
                                            {membership.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(membership)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <MembershipFormSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                membershipToEdit={selectedMembership}
                onSuccess={handleSuccess}
            />
        </PageLayout>
    );
};
