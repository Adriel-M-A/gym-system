import { Link, useLocation } from "react-router-dom";
import {
    Users,
    CreditCard,
    LayoutDashboard,
    Dumbbell,
    LogOut,
    Settings,
    PanelLeftClose
} from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";

const items = [
    { title: "Inicio", url: "/", icon: LayoutDashboard },
    { title: "Socios", url: "/members", icon: Users },
    { title: "Membresías", url: "/memberships", icon: CreditCard },
];

interface AppSidebarProps {
    collapsed: boolean;
    toggle: () => void;
}

export function AppSidebar({ collapsed, toggle }: AppSidebarProps) {
    const location = useLocation();

    return (
        <aside
            className={cn(
                "flex flex-col border-r bg-card text-card-foreground transition-all duration-300 ease-in-out md:flex",
                collapsed ? "w-16" : "w-64"
            )}
        >

            {/* Header del Sidebar */}
            <div className={cn("flex h-16 items-center border-b", collapsed ? "justify-center" : "justify-between px-4")}>
                {!collapsed && (
                    <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <Dumbbell className="h-6 w-6 text-primary shrink-0" />
                        <span className="font-bold text-lg">Gym System</span>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="h-8 w-8 shrink-0"
                    title={collapsed ? "Expandir" : "Colapsar"}
                >
                    {collapsed ? <Dumbbell className="h-6 w-6 text-primary" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
            </div>


            {/* Menú de Navegación */}
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-2">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            to={item.url}
                            title={collapsed ? item.title : ""}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                location.pathname === item.url ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                collapsed ? "justify-center px-2" : ""
                            )}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.title}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Footer del Sidebar */}
            <div className="border-t p-4 grid gap-1">
                <button
                    title={collapsed ? "Configuración" : ""}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        collapsed ? "justify-center px-2" : ""
                    )}
                >
                    <Settings className="h-4 w-4 shrink-0" />
                    {!collapsed && "Configuración"}
                </button>
                <button
                    title={collapsed ? "Cerrar Sesión" : ""}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        collapsed ? "justify-center px-2" : ""
                    )}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && "Cerrar Sesión"}
                </button>
            </div>
        </aside>
    );
}
