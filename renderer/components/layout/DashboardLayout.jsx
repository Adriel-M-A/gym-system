import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Sidebar Fijo con props de control */}
            <AppSidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />

            {/* Contenido Principal */}
            <main className="flex-1 overflow-auto bg-background p-6">
                <Outlet />
            </main>
        </div>
    );
}
