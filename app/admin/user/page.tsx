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
import { Badge } from "@/components/ui/badge"

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch('/api/admin/user_GetAllUsers', {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data)
            })
    }, [])
    return (
        <div className="w-full">
            <span className="text-3xl font-bold">User</span>
            <p className="text-muted-foreground my-4">Your website users</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-right">User ID</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: any) => (
                        <TableRow key={user.user_id}>
                            <TableCell className="text-right">{user.user_id}</TableCell>
                            <TableCell>{user.first_name}</TableCell>
                            <TableCell>{user.last_name}</TableCell>
                            <TableCell>{user.phone_number}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={`text-white ${user.role === "Admin" ? "bg-blue-600" : "bg-green-600"}`}
                                >
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminUser;