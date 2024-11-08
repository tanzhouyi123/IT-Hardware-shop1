'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"

export default function MyOrder() {
    const { status, data: session } = useSession();
    const router = useRouter();

    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetch('/api/order/getOrdersByUserId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // @ts-ignore-next-line
                body: JSON.stringify({ user_id: session?.user?.id }),
            })
                .then(response => response.json())
                .then(data => {
                    setOrderItems(data);
                    setIsLoading(false);
                })
        }
    }, [status]);

    const OrderItemRender = ({ item }: {
        item: {
            order_id: string,
            product_id: string,
            quantity: number,
            name: string,
            price: number,
            total_amount: number,
            status: string,
            description: string,
            cover: string
        }
    }) => {
        const StatusBadge = ({ status }: { status: string }) => {
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
        const ReviewBtn = () => {
            const [rating, setRating] = useState(0);
            const [starHover, setStarHover] = useState(0);
            const [comment, setComment] = useState("");

            // Get review by order id
            useEffect(() => {
                fetch('/api/review/getReviewByOrderId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // @ts-ignore-next-line
                    body: JSON.stringify({ order_id: item.order_id }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            setRating(data[0].rating);
                            setComment(data[0].comment);
                        }
                    })
            }, [])

            const handleSaveReview = () => {
                if (rating === 0) {
                    toast.error("Rating must be selected");
                    return;
                }
                if (comment.trim().length === 0) {
                    toast.error("Comment must not be empty");
                    return;
                }
                // Save review
                fetch('/api/review/saveReview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ order_id: item.order_id, rating, comment }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            toast.success("Review saved successfully");
                        } else {
                            toast.error("Failed to save review");
                        }
                    })
            }

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Review</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[30vw]">
                        <DialogHeader>
                            <DialogTitle>Review Order</DialogTitle>
                            <DialogDescription>
                                Your review will be posted publicly. Please don't use sensitive information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-8">
                            <div className="space-y-2">
                                <Label htmlFor="rating">
                                    Rating
                                </Label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            fill={(rating >= star) ? "#facc15" : "none"}
                                            className={`w-6 h-6 cursor-pointer ${(starHover || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
                                            onMouseEnter={() => setStarHover(star)}
                                            onMouseLeave={() => setStarHover(0)}
                                            onClick={() => setRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comment">
                                    Comment
                                </Label>
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button onClick={handleSaveReview}>Save</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )
        }

        return (
            <Card className="lg:flex">
                <CardHeader>
                    <img
                        src={item.cover}
                        alt={item.name}
                        className="aspect-square object-cover w-full rounded-lg overflow-hidden size-40 border"
                    />
                </CardHeader>
                <CardContent className="p-4 flex-auto space-y-4">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl lg:text-3xl lg:max-w-screen-lg line-clamp-2">{item.name}</h1>
                        <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-muted-foreground lg:max-w-screen-lg line-clamp-3">{item.description}</p>
                    <h2 className="text-2xl font-bold">RM {item.price.toFixed(2)}</h2>
                    <div className="flex justify-between items-center">
                        <div className="content-center text-lg">Total {item.quantity} item(s): <span className="text-xl font-bold">RM {(item.price * item.quantity).toFixed(2)}</span></div>
                        {item.status === 'Fulfilled' && <ReviewBtn />}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return <main className="flex-1">
        <section className="w-full py-3 md:py-6 lg:py-8 bg-gray-100 dark:bg-gray-800">
            <div className="px-4 md:px-6 space-y-4 lg:mx-32">
                <h2 className="text-2xl font-bold">My Order</h2>
                <div className="space-y-4">
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
                    ) : orderItems.length === 0 ? (
                        <p className="text-2xl text-center">No items in orders</p>  // Show message if order is empty
                    ) : (
                        orderItems.map((item: any) => <OrderItemRender key={item.order_id} item={item} />) // Render order items
                    )
                    }
                </div>
            </div>
        </section>
    </main>;
}