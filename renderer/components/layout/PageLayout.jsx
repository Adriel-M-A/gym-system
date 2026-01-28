import React from 'react';
import { cn } from "@/utils/utils";

export function PageLayout({ title, subtitle, action, children, className }) {
    return (
        <div className={cn("flex flex-col gap-6 p-4 md:p-8 pt-6 h-full", className)}>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
                {action && (
                    <div className="flex items-center gap-2">
                        {action}
                    </div>
                )}
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
