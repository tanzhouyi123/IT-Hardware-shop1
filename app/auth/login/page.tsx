'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, useSession } from 'next-auth/react';
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export const description =
    "Login form with email and password. Login to your account."

export default function LoginForm() {
    // Define state variables
    const { data: session, status } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Redirect to homepage if user is already logged in
    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session]);

    // Reset error message when email or password changes
    useEffect(() => {
        setError('');
    }, [email, password]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            setError('');
            toast.success("Successfully logged in.")
            // Redirect to homepage after successful login
            router.push('/');
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === "loading"}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={status === "loading"}
                        required
                    />
                </div>
            </CardContent>
            <CardContent className="justify-items-start">
                <Button className="w-full" onClick={handleLogin} disabled={status === "loading"}>
                    {status === "loading" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show loading spinner
                    ) : (
                        "Login"
                    )}
                </Button>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="underline">
                        Sign up
                    </Link>
                </div>
                <Separator className="my-4" />
                <div className="text-center text-sm">
                    <Link href="/" className="underline">Back to Homepage</Link>
                </div>
            </CardContent>
            {error &&
                <CardFooter>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardFooter>
            }
        </Card>
    )
}
