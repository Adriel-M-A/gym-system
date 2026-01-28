import {
    Users,
    Activity,
    CreditCard,
    DollarSign,
    TrendingUp,
    AlertCircle,
    MoreHorizontal
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Datos Mock para la tabla
const recentMembers = [
    {
        id: "#9281",
        name: "Alex Johnson",
        plan: "Plan Pro",
        status: "active",
        endDate: "12 Oct 2024",
    },
    {
        id: "#9278",
        name: "Sarah Miller",
        plan: "Plan Básico",
        status: "active",
        endDate: "15 Oct 2024",
    },
    {
        id: "#9275",
        name: "James Wilson",
        plan: "Plan Elite",
        status: "pending",
        endDate: "28 Sep 2024",
    },
    {
        id: "#9272",
        name: "Elena Rodriguez",
        plan: "Plan Pro",
        status: "active",
        endDate: "02 Nov 2024",
    },
    {
        id: "#9269",
        name: "Michael Chen",
        plan: "Plan Básico",
        status: "expired",
        endDate: "20 Sep 2024",
    },
];

export function HomePage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Resumen General</h1>
                    <p className="text-muted-foreground">
                        Monitoreo de actividad y métricas del gimnasio
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>+ Nuevo Registro</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Socios Totales</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,240</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500 font-medium">+2.4%</span> vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Acciones Pendientes</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-muted-foreground">
                            <Badge variant="destructive" className="mt-1">Requiere Atención</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Asistencia Hoy</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <div className="text-xs text-muted-foreground">
                            <Badge variant="secondary" className="mt-1 text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100">En Vivo</Badge> Pista Activa
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos (Mes)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500 font-medium">+8.1%</span> meta lograda
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Records Table */}
            <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Registros de Socios</CardTitle>
                        <CardDescription>Ultimos movimientos y estados de cuentas</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">Ver Todos</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Socio</TableHead>
                                <TableHead>Suscripción</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Vencimiento</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium text-muted-foreground">{member.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-medium">{member.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{member.plan}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                member.status === 'active' ? 'default' :
                                                    member.status === 'pending' ? 'secondary' : 'destructive'
                                            }
                                            className={
                                                member.status === 'active' ? 'bg-green-500 hover:bg-green-600' :
                                                    member.status === 'pending' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''
                                            }
                                        >
                                            {member.status === 'active' ? 'Activo' :
                                                member.status === 'pending' ? 'Pendiente' : 'Expirado'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{member.endDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
