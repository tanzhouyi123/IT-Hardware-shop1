'use client';

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Package2, ShoppingCart, Users } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { status, data: session } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            // @ts-ignore-next-line
            if (session.user.data.role !== 'Admin') {
                toast.error("You are not authorized to access this page.");
                router.push('/');
            }
        }
    }, [status]);

    const NavigationBar = () => {
        const isActive = (path: string) => {
            return path === pathname ? "default" : "outline";
        }

        const RenderItem = ({ children, path, tooltip }: { children: React.ReactNode, path: string, tooltip: string }) => {
            return (
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                className="rounded-full"
                                variant={isActive(path)}
                                onClick={() => router.push(path)}
                            >
                                {children}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {tooltip}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
        return (
            <Card className="h-[80vh] bg-zinc-50 dark:bg-zinc-900">
                <CardContent className="p-6 flex flex-col space-y-8">
                    <RenderItem path="/admin" tooltip="Dashboard">
                        <LayoutDashboard />
                    </RenderItem>
                    <RenderItem path="/admin/product" tooltip="Product">
                        <Package2 />
                    </RenderItem>
                    <RenderItem path="/admin/order" tooltip="Order">
                        <ShoppingCart />
                    </RenderItem>
                    <RenderItem path="/admin/user" tooltip="User">
                        <Users />
                    </RenderItem>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="flex p-6 space-x-8">
            <NavigationBar />
            {children}
        </div>
    );
}