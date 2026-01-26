import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AboutPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-10 space-y-4 bg-background">
            <h1 className="text-3xl font-bold">Acerca de</h1>
            <p className="text-muted-foreground">Esta es una página de ejemplo en la nueva arquitectura modular.</p>

            <Link to="/">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                </Button>
            </Link>
        </div>
    );
}
