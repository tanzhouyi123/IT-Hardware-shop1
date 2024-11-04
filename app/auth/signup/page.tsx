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
import { useSession } from 'next-auth/react';
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export const description =
    "Signup form with email and password. Signup to your account."

export default function SignUpForm() {
    // Define state variables
    const { data: session, status } = useSession();
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Redirect to homepage if user is already logged in
    useEffect(() => {
        if (session) {
            toast.info("You are already logged in.");
            router.push('/');
        }
    }, [session]);

    // Reset error message when input changes
    useEffect(() => {
        setError('');
    }, [firstName, lastName, phoneNumber, email, password]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verify that all fields are filled
        if (!firstName || !lastName || !phoneNumber || !email || !password) {
            setError('All fields are required.');
            return;
        }

        // Verify that email is valid
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Invalid email address.');
            return;
        }

        // Verify that password is at least 8 characters long
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        // Verify that password contains at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter.');
            return;
        }

        // Verify that password contains at least one number
        if (!/\d/.test(password)) {
            setError('Password must contain at least one number.');
            return;
        }

        // Verify that password contains at least one special character
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            setError('Password must contain at least one special character.');
            return;
        }

        // Verify that password contains at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            setError('Password must contain at least one lowercase letter.');
            return;
        }

        // Verify that phone number is valid (10 / 11 digits)
        if (!/^\d{10}$/.test(phoneNumber) && !/^\d{11}$/.test(phoneNumber)) {
            setError('Invalid phone number.');
            return;
        }

        // Verify that email is not already in use
        const responseEmail = await fetch('/api/user/getUserByEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        const resultEmail = await responseEmail.json();

        if (resultEmail.length > 0) {
            setError('Email already in use.');
            return;
        }

        // If all checks pass, add user to database
        const response = await fetch('/api/user/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                email: email,
                password: password,
            }),
        });
        const result = await response.json();

        if (!response.ok) {
            setError(result);
        } else {
            setError('');
            toast.success("Successfully signed up. Please login to your account.");
            // Redirect to login after successful signup
            router.push('/auth/login');
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to sign up an account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex gap-2">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={status === "loading"}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={status === "loading"}
                            required
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber"
                        type="number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={status === "loading"}
                        required
                    />
                </div>
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
                <Button className="w-full" onClick={handleSignUp} disabled={status === "loading"}>
                    {status === "loading" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show loading spinner
                    ) : (
                        "Sign Up"
                    )}
                </Button>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="underline">
                        Login
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
