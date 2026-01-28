import React from 'react';
import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/utils/utils";

interface SheetLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function SheetLayout({
    title,
    description,
    children,
    footer,
    className
}: SheetLayoutProps) {
    return (
        <div className={cn("flex flex-col h-full", className)}>
            <SheetHeader className="pb-6 border-b mb-6">
                <SheetTitle className="text-2xl">{title}</SheetTitle>
                {description && (
                    <SheetDescription className="text-base mt-2">
                        {description}
                    </SheetDescription>
                )}
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-1 pr-4 -mr-4">
                <div className="pb-6">
                    {children}
                </div>
            </div>

            {footer && (
                <SheetFooter className="mt-auto pt-6 border-t bg-background">
                    {footer}
                </SheetFooter>
            )}
        </div>
    );
}
