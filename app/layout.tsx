'use client';

import localFont from "next/font/local";
import "./globals.css";

import { useState } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search, Menu, ClipboardList, User, Moon, Sun } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()

  const DarkModeToggle = () => {
    const { setTheme } = useTheme();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const Header = () => {
    // Define state variables
    const { status, data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery) {
        router.push(`/?search=${searchQuery}`);
      } else {
        router.push('/');
      }
    };

    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container min-w-full flex h-14 items-center px-6">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">IT Hardware Shop</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/">Products</Link>
              <Link href="/category/All">Categories</Link>
              {/* @ts-ignore-next-line */}
              {session?.user.data.role === 'Admin' && <Link href="/admin">Admin Dashboard</Link>}
            </nav>
          </div>
          <Button variant="outline" size="icon" className="mr-2 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <form className="flex space-x-2" onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="sm:w-[100px] md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
            </div>
            <nav className="flex items-center">
              <DarkModeToggle />
              <Button variant="ghost" size="icon" onClick={() => router.push("/my/cart")}>
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/my/order")}>
                <ClipboardList className="h-5 w-5" />
                <span className="sr-only">Order</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  {status === "authenticated" ? (
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => router.push("/auth/login")}
                      className="cursor-pointer"
                    >
                      Login
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>
    )
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {!["/auth/login", "/auth/signup"].includes(pathname) && <Header />}

            {children}
            <Toaster richColors closeButton position="top-right" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
