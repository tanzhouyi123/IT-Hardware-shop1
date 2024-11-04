"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetails({ params }: { params: { product_id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // Get product by ID
    const [product, setProduct]: any = useState({});
    useEffect(() => {
        fetch('/api/product/getProductById', {
            method: 'POST',
            body: JSON.stringify({ product_id: params.product_id }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    return router.push('/')
                }
                setProduct(data[0])
                setIsLoadingProduct(false)
            })
        fetch('/api/review/getReviewByProductId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: params.product_id }),
        })
            .then(response => response.json())
            .then(data => {
                setReviews(data)
                setIsLoadingReview(false)
            })
    }, []);

    // Add to cart
    const addToCartHandler = () => {
        fetch('/api/cart/addToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // @ts-ignore-next-line
            body: JSON.stringify({ product_id: params.product_id, quantity, user_id: session?.user?.id }),
        })
            .then(response => response.json())
            .then(data => {
                toast.success("Product added to cart");
            })
    }

    return (
        <div className="items-center space-x-6 p-4 border rounded-lg shadow-sm">
            {isLoadingProduct ? (
                <div className="lg:mx-40 flex space-x-8 p-16">
                    <Skeleton className="h-60 w-60" />
                    <div className="space-y-4 w-full">
                        {[...Array(5)].map(() => <Skeleton className="w-full h-8" />)}
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
                    <div className="grid md:grid-cols-5 gap-3 items-start">
                        <div className="md:col-span-4">
                            <img
                                src={product.cover}
                                alt={product.name}
                                className="aspect-square object-cover w-full rounded-lg overflow-hidden"
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 md:gap-10 items-start">
                        <div className="hidden md:flex items-start">
                            <div className="grid gap-4">
                                <h1 className="font-bold text-3xl lg:text-4xl">{product.name}</h1>
                                <div>
                                    <p>{product.description}</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold ml-auto">RM {product.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" onClick={() => setQuantity((prev) => prev === 1 ? 1 : quantity - 1)}>
                                <MinusCircle className="h-5 w-5" />
                            </Button>
                            <span className="text-lg">{quantity}</span>
                            <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                                <PlusCircle className="h-5 w-5" />
                            </Button>
                        </div>
                        <Button
                            size="lg"
                            onClick={addToCartHandler}
                            disabled={status !== 'authenticated' || product.stock === 0 || product.deleted_at}
                        >
                            {
                                product.stock === 0 ? 'Out of Stock' :
                                    product.deleted_at ? 'Product Unavailable' :
                                        status === 'authenticated' ? 'Add to Cart' : 'Sign In to Add to Cart'
                            }
                        </Button>
                    </div>
                </div>
            )
            }
            {/* Reviews */}
            {!isLoadingReview &&
                <div className="lg:px-[10vw] space-y-4 mt-8">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold">Review</h2>
                        <h2 className="text-xl font-bold flex space-x-2">
                            <span>{product.rating ? (product.rating).toFixed(1) : 0}</span>
                            <Star />
                        </h2>
                    </div>
                    {reviews.length === 0 ? (
                        <Card>
                            <CardHeader className="text-xl font-bold text-center">No Review</CardHeader>
                        </Card>
                    ) : (
                        reviews.map((review: any) =>
                            <Card>
                                <CardHeader>
                                    <span className="text-lg">{review.comment}</span>
                                </CardHeader>
                                <CardContent className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            fill={(review.rating >= star) ? "#facc15" : "none"}
                                            className={`w-6 h-6 text-yellow-400`}
                                        />
                                    ))}
                                    <span className="px-2"><Separator orientation="vertical" /></span>
                                    <span className="text-muted-foreground">
                                        {new Date(review.date).toLocaleString()}
                                    </span>
                                    <span className="px-2"><Separator orientation="vertical" /></span>
                                    <span className="text-muted-foreground">
                                        {`${review.first_name} ${review.last_name}`}
                                    </span>
                                </CardContent>
                                {review.admin_reply &&
                                    <CardContent>
                                        <Card>
                                            <div className="p-4 space-y-2 w-full">
                                                <span>Admin Reply</span>
                                                <p className="text-muted-foreground">{review.admin_reply}</p>
                                            </div>
                                        </Card>
                                    </CardContent>
                                }
                            </Card>
                        )
                    )}
                </div>
            }
        </div>
    );
}
