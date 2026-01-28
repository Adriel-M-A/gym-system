import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const MembersPage = () => {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMembers();
    }, [search]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = await window.api.members.getAll({ search });
            setMembers(data);
        } catch (error) {
            console.error("Error loading members:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout
            title="Socios"
            subtitle="Gestión de socios, membresías y estados."
            action={
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Socio
                </Button>
            }
        >
            <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o DNI..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Socio</TableHead>
                                <TableHead>DNI / Teléfono</TableHead>
                                <TableHead>Membresía</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Cargando socios...
                                    </TableCell>
                                </TableRow>
                            ) : members.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No se encontraron socios.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">#{member.id}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{member.last_name}, {member.first_name}</span>
                                                <span className="text-xs text-muted-foreground">{member.email || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{member.dni}</span>
                                                <span className="text-xs text-muted-foreground">{member.phone || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {member.active_membership ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{member.active_membership.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Vence: {format(new Date(member.active_membership.end_date), 'dd MMM yyyy', { locale: es })}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Sin membresía activa</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={member.is_active ? "default" : "secondary"}
                                                className={member.is_active ? "bg-green-500 hover:bg-green-600" : ""}
                                            >
                                                {member.is_active ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
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
            </div>
        </PageLayout>
    );
};
