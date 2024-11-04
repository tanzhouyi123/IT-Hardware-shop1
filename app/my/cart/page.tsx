'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export default function MyCart() {
    const { status, data: session } = useSession();
    const router = useRouter();

    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            getCartItems();
        }
    }, [status]);

    // Get cart items
    const getCartItems = () => {
        setIsLoading(true);
        fetch('/api/cart/getCartByUserId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // @ts-ignore-next-line
            body: JSON.stringify({ user_id: session?.user?.id ?? 0 }),
        })
            .then(response => response.json())
            .then(data => {
                setCartItems(data)
                setIsLoading(false);
            })
    }

    // Calculate total price when cart items change
    useEffect(() => {
        let grandTotal = 0;
        cartItems.forEach((item: any) => {
            // Check if item is in stock
            if (item.stock >= item.quantity && item.deleted_at === null) {
                grandTotal += item.price * item.quantity;
            }
        });
        setTotalPrice(grandTotal);
    }, [cartItems]);

    const CartItemRender = ({ item }: {
        item: {
            cart_id: string,
            product_id: string,
            quantity: number,
            name: string,
            price: number,
            description: string,
            stock: number,
            cover: string,
            deleted_at: string | null
        }
    }) => {
        const RemoveItemBtn = () => {
            // Remove item from cart
            const handleRemove = () => {
                fetch('/api/cart/deleteCartByCartId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cart_id: item.cart_id }),
                })
                    .then(response => response.json())
                    .then(data => {
                        getCartItems();
                    })
            }

            return (<AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Trash2 className="h-5 w-5" color="red" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your cart.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemove}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            )
        }

        const updateQuantity = (action: string) => {
            let qty = item.quantity;
            let newQty = 0;

            switch (action) {
                case 'add':
                    newQty = qty + 1;
                    break;
                case 'subtract':
                    newQty = (qty === 1) ? 1 : qty - 1;
                    break;
                default:
                    newQty = qty;
                    break;
            }

            fetch('/api/cart/updateCartQuantityByCartId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart_id: item.cart_id, quantity: newQty }),
            })
                .then(response => response.json())
                .then(data => {
                    // Update cart items with new quantity
                    setCartItems((prev): any => prev.map((cartItem: any) => cartItem.cart_id === item.cart_id ? { ...cartItem, quantity: newQty } : cartItem));
                })
        }

        return (
            <Card className="container lg:flex">
                <CardHeader>
                    <img
                        src={item.cover}
                        alt={item.name}
                        className="aspect-square object-cover w-full rounded-lg overflow-hidden size-40 border"
                    />
                </CardHeader>
                <CardContent className="p-4 flex-auto space-y-4">
                    <h1 className="font-bold text-2xl lg:text-3xl lg:max-w-screen-lg line-clamp-2">{item.name}</h1>
                    <p className="text-sm text-muted-foreground lg:max-w-screen-lg line-clamp-3">{item.description}</p>
                    <h2 className="text-2xl font-bold">RM {item.price.toFixed(2)}</h2>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" onClick={() => updateQuantity('subtract')}>
                                <MinusCircle className="h-5 w-5" />
                            </Button>
                            <span className="text-lg">{item.quantity}</span>
                            <Button variant="ghost" size="icon" onClick={() => updateQuantity('add')}>
                                <PlusCircle className="h-5 w-5" />
                            </Button>
                            <Separator orientation="vertical" className="h-6" />
                            <RemoveItemBtn />
                            {item.stock < item.quantity && <Badge variant="destructive">Out of Stock</Badge>}
                            {item.deleted_at && <Badge variant="destructive">Product Unavailable</Badge>}
                        </div>
                        <span className="text-3xl font-bold">RM {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const CheckoutBtn = () => {
        const handleCheckout = () => {
            cartItems
                .filter((item: any) => item.stock >= item.quantity)
                .filter((item: any) => item.deleted_at === null)
                .map((item: any) => {
                    // Add to order
                    fetch('/api/cart/makeOrder', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            // @ts-ignore-next-line
                            user_id: session?.user?.id,
                            product_id: item.product_id,
                            price: item.price,
                            quantity: item.quantity,
                            shipping_fee: 0,
                            total_amount: item.price * item.quantity,
                        }),
                    }).then(() => {
                        // Remove cart
                        fetch('/api/cart/deleteCartByCartId', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ cart_id: item.cart_id }),
                        })
                        
                        toast.success("Checkout successfully");
                        router.push('/my/order');
                    })
                })
        }

        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        className="w-full"
                        disabled={cartItems.length === 0 || totalPrice === 0}
                    >Proceed to Checkout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Checkout</AlertDialogTitle>
                        <AlertDialogDescription>
                            Total Payment: <br /><span className="text-xl font-bold">RM {totalPrice.toFixed(2)}</span>
                        </AlertDialogDescription>
                        <AlertDialogDescription>
                            Are you sure you want to checkout?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCheckout}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return <main className="flex-1">
        <section className="w-full py-2 md:py-4 lg:py-6 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6 lg:flex min-w-full">
                {/* My Cart */}
                <div className="flex-auto border p-4 rounded-lg shadow-sm w-full">
                    <h2 className="text-2xl font-bold mb-4">My Cart</h2>
                    <ScrollArea className="h-[80vh] rounded-md">
                        <div className="space-y-4 mr-4">
                            {isLoading ? ( // Show skeleton UI if loading
                                <Card className="p-6">
                                    <div className="flex space-x-3">
                                        <Skeleton className="w-40 h-40 rounded-xl" />
                                        <div className="space-y-4 flex-auto">
                                            <Skeleton className="h-6" />
                                            <Skeleton className="h-6" />
                                            <Skeleton className="h-6" />
                                            <Skeleton className="h-6" />
                                        </div>
                                    </div>
                                </Card>
                            ) : cartItems.length === 0 ? (
                                <p className="text-2xl text-center">No items in cart</p>  // Show message if cart is empty
                            ) : (
                                cartItems.map((item: any) => <CartItemRender key={item.cart_id} item={item} />) // Render cart items
                            )
                            }
                        </div>
                    </ScrollArea>
                </div>

                {/* Order summary */}
                <div className="flex-1/4 border p-4 rounded-lg shadow-sm lg:ml-6 lg:min-w-[20vw]">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>RM {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>RM {totalPrice.toFixed(2)}</span>
                        </div>

                        <CheckoutBtn />
                    </div>
                </div>
            </div>
        </section>
    </main>;
}