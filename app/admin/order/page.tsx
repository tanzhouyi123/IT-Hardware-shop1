'use client';

import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import {
    ExternalLink,
    Ellipsis,
    Loader,
    Truck,
    CircleCheck,
    Undo2
} from "lucide-react"
import Link from "next/link";

const AdminOrder = () => {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        getOrders();
    }, [])

    const getOrders = () => {
        fetch('/api/admin/order_GetAllOrders', {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                setOrders(data)
            })
    }

    const updateOrderStatus = (order_id: number, status: string) => {
        fetch('/api/admin/order_UpdateOrderStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_id, status }),
        })
            .then(response => response.json())
            .then(data => {
                toast.success("Order status updated successfully");
                getOrders();
            })
    }

    const StatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return <Badge variant="outline" className="bg-yellow-600 text-white">Pending</Badge>
            case 'Shipping':
                return <Badge variant="outline" className="bg-blue-600 text-white">Shipping</Badge>
            case 'Fulfilled':
                return <Badge variant="outline" className="bg-green-600 text-white">Delivered</Badge>
            case 'Refund':
                return <Badge variant="outline" className="bg-red-600 text-white">Refund</Badge>
            default:
                return <Badge variant="outline" className="bg-gray-600 text-white">Unknown</Badge>
        }
    }

    return (
        <div className="w-full">
            <span className="text-3xl font-bold">Order</span>
            <p className="text-muted-foreground my-4">Manage your orders</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-right">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price (RM)</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Total Amount (RM)</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order: any) => (
                        <TableRow key={order.order_id}>
                            <TableCell className="text-right">{order.order_id}</TableCell>
                            <TableCell className="flex flex-col space-y-1">
                                <span>{order.user_name}</span>
                                <span className="text-muted-foreground">{order.user_email}</span>
                            </TableCell>
                            <TableCell className="max-w-[300px]">
                                <Link
                                    href={`/product/${order.product_id}`}
                                    className="flex items-center space-x-1"
                                    target="_blank"
                                >
                                    <span className="line-clamp-2">{order.product_name}</span>
                                    <ExternalLink size={12} />
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">{order.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{order.quantity}</TableCell>
                            <TableCell className="text-right">{order.total_amount.toFixed(2)}</TableCell>
                            <TableCell className="text-center">{StatusBadge(order.status)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Ellipsis />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Mark As</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer space-x-4 text-yellow-600"
                                            onClick={() => updateOrderStatus(order.order_id, 'Pending')}
                                        >
                                            <Loader />
                                            <span>Pending</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer space-x-4 text-blue-600"
                                            onClick={() => updateOrderStatus(order.order_id, 'Shipping')}
                                        >
                                            <Truck />
                                            <span>Shipping</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer space-x-4 text-green-600"
                                            onClick={() => updateOrderStatus(order.order_id, 'Fulfilled')}
                                        >
                                            <CircleCheck />
                                            <span>Fulfilled</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer space-x-4 text-red-600"
                                            onClick={() => updateOrderStatus(order.order_id, 'Refund')}
                                        >
                                            <Undo2 />
                                            <span>Refund</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminOrder;