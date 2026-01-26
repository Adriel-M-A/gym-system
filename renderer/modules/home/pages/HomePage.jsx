import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, CreditCard, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="border-b p-6">
                <h1 className="text-3xl font-bold text-primary">Gym System</h1>
                <p className="text-muted-foreground">Panel de Control</p>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card: Socios */}
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Socios
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Gestión</div>
                            <p className="text-xs text-muted-foreground">
                                Altas, bajas y modificaciones
                            </p>
                            <div className="mt-4">
                                <Button className="w-full">Ver Socios</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Membresías */}
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Membresías
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Planes</div>
                            <p className="text-xs text-muted-foreground">
                                Configuración de suscripciones
                            </p>
                            <div className="mt-4">
                                <Button variant="secondary" className="w-full">Ver Planes</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Reportes (Placeholder) */}
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Actividad
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Reportes</div>
                            <p className="text-xs text-muted-foreground">
                                Estado del gimnasio
                            </p>
                            <div className="mt-4">
                                <Button variant="outline" className="w-full">Ver Estadísticas</Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}
