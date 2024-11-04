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
import { Button } from "@/components/ui/button"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { ExternalLink, Star, SquarePen, MessageSquareText, Trash2, Reply } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"

const defaultProductInfo = {
    product_id: null,
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    cover: "https://placehold.co/150?text=Preview",
}

const AdminProduct = () => {
    const router = useRouter();
    const [addOrUpdateProduct, setAddOrUpdateProduct] = useState<any>(false);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
        return () => {
            setProducts([]);
        }
    }, [])

    const getProducts = async () => {
        const res = await fetch('/api/admin/product_GetAllProducts', {
            method: "POST",
        });
        const data = await res.json();
        setProducts(data);
    }

    const AddOrUpdateProductDialog = () => {
        const [productDetail, setProductDetail] = useState<any>({});
        const [previewCover, setPreviewCover] = useState<any>(null);
        const [uploadedCover, setUploadedCover] = useState<any>(null);

        useEffect(() => {
            if (addOrUpdateProduct) {
                setProductDetail(addOrUpdateProduct);
                setPreviewCover(addOrUpdateProduct.cover);
            }
        }, [addOrUpdateProduct])

        const handleSaveProduct = async () => {
            // Verify data
            if (productDetail.name.trim().length === 0) {
                toast.error('Please enter valid name');
                return;
            }
            if (productDetail.description.trim().length === 0) {
                toast.error('Please enter valid description');
                return;
            }
            if (productDetail.price <= 0) {
                toast.error('Please enter valid price');
                return;
            }
            if (productDetail.stock < 0) {
                toast.error('Please enter valid stock');
                return;
            }
            if (productDetail.category.trim().length === 0) {
                toast.error('Please enter valid category');
                return;
            }

            const getCoverPath = async () => {
                if (!uploadedCover)
                    return productDetail.cover;

                // Upload new cover
                const formData = new FormData();
                formData.append('cover', uploadedCover);
                return await fetch('/api/admin/product_UploadCover', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => data.data)
            }

            // Save product
            const res = await fetch('/api/admin/product_SaveProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...productDetail,
                    cover: await getCoverPath()
                })
            })
            const data = await res.json();
            if (data.success) {
                toast.success('Product saved successfully');
                setAddOrUpdateProduct(false);
                getProducts();
            } else {
                toast.error('Failed to save product');
            }
        }

        return (
            <AlertDialog open={!!addOrUpdateProduct} onOpenChange={setAddOrUpdateProduct}>
                <AlertDialogContent className="min-w-[70vw]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{productDetail.product_id ? 'Update' : 'Add'} Product</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex gap-8">
                        <div className="w-full space-y-4">
                            <div className="space-y-2">
                                <span>Name</span>
                                <Input
                                    value={productDetail.name}
                                    onChange={(e) => setProductDetail({ ...productDetail, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <span>Description</span>
                                <Textarea
                                    value={productDetail.description}
                                    onChange={(e) => setProductDetail({ ...productDetail, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-full space-y-2">
                                    <span>Stock</span>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={productDetail.stock}
                                        onChange={(e) => setProductDetail({ ...productDetail, stock: e.target.value })}
                                    />
                                </div>
                                <div className="w-full space-y-2">
                                    <span>Price (RM)</span>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={productDetail.price}
                                        onChange={(e) => setProductDetail({ ...productDetail, price: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full space-y-4">
                            <div className="space-y-2">
                                <span>Category</span>
                                <Input
                                    value={productDetail.category}
                                    onChange={(e) => setProductDetail({ ...productDetail, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <span>Cover</span>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;

                                        if (files[0].type.split('/')[0] !== 'image')
                                            return toast.error('Only image files are allowed');

                                        setPreviewCover(URL.createObjectURL(files[0]));
                                        setUploadedCover(files[0]);
                                    }}
                                />
                                <img
                                    className="w-[150px] h-[150px]"
                                    src={previewCover} alt={productDetail.name}
                                />
                            </div>
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Discard</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSaveProduct}
                        >Save</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    const RenderProducts = () => {
        const ReviewProduct = ({ product_id, rating }: { product_id: number, rating: number }) => {
            const [reviews, setReviews] = useState([]);

            useEffect(() => {
                fetch('/api/review/getReviewByProductId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        product_id: product_id
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        setReviews(data);
                    })
            }, [])


            const RenderReview = ({ review }: { review: any }) => {
                const [showReply, setShowReply] = useState(false);

                const RenderReply = ({ review }: { review: any }) => {
                    const [comment, setComment] = useState(review.admin_reply ?? "");

                    const handleSaveReply = () => {
                        if (comment.trim().length === 0) {
                            toast.error("Reply must not be empty");
                            return;
                        }
                        fetch('/api/admin/review_UpdateReply', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                review_id: review.review_id,
                                admin_reply: comment
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    toast.success("Reply saved successfully");
                                } else {
                                    toast.error("Failed to save reply");
                                }
                            })
                    }

                    return (
                        <Card>
                            <div className="p-4 flex justify-between gap-4">
                                <div className="space-y-2 w-full">
                                    <Label className="text-muted-foreground">Admin Reply</Label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button size="sm" onClick={handleSaveReply}>Reply</Button>
                                </div>
                            </div>
                        </Card>
                    )
                }

                return (
                    <Card className="mb-4 mr-4">
                        <CardHeader>
                            <span className="text-base">{review.comment}</span>
                        </CardHeader>
                        <CardContent className="flex justify-between">
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        fill={(review.rating >= star) ? "#facc15" : "none"}
                                        className={`w-5 h-5 text-yellow-400`}
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
                            </div>
                            <div>
                                <Button size="sm" variant="outline" onClick={() => setShowReply(!showReply)}>
                                    <Reply size={16} />
                                </Button>
                            </div>
                        </CardContent>
                        {showReply &&
                            <CardContent>
                                <RenderReply review={review} />
                            </CardContent>
                        }
                    </Card>
                )
            }

            return (
                <AlertDialog>
                    <AlertDialogTrigger>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" className="w-8 h-8 text-yellow-500">
                                        <MessageSquareText size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Review</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="min-w-[70vw]">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Product Reviews</AlertDialogTitle>
                            <AlertDialogDescription>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">{rating.toFixed(1)}</span>
                                    <Star size={18} className="text-yellow-500" />
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {reviews.length === 0 ? (
                            <Card>
                                <CardHeader className="text-xl font-bold text-center">No Review</CardHeader>
                            </Card>
                        ) : (
                            <ScrollArea className="max-h-[70vh]">
                                {reviews.map((review: any, index) =>
                                    <RenderReview key={index} review={review} />
                                )}
                            </ScrollArea>
                        )}
                        <AlertDialogFooter>
                            <AlertDialogCancel>Done</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        }

        const DeleteProduct = ({ product_id }: { product_id: number }) => {
            const handleDeleteProduct = async () => {
                const res = await fetch('/api/admin/product_DeleteProduct', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        product_id: product_id
                    })
                });
                const data = await res.json();
                if (data.success) {
                    toast.success('Product deleted successfully');
                    setAddOrUpdateProduct(false);
                    getProducts();
                } else {
                    toast.error('Failed to delete product');
                }
            }

            return (
                <AlertDialog>
                    <AlertDialogTrigger>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" className="w-8 h-8 text-red-500">
                                        <Trash2 size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Delete</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete selected product.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="hover:bg-red-600 hover:text-white"
                                onClick={handleDeleteProduct}
                            >Confirm Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-right">Product ID</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Product Description</TableHead>
                        <TableHead className="text-right">Price (RM)</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-center">Category</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product: any) => (
                        <TableRow key={product.product_id}>
                            <TableCell className="w-[100px] text-right">{product.product_id}</TableCell>
                            <TableCell className="max-w-[200px] lg:flex items-center min-w-full">
                                <img
                                    src={product.cover}
                                    alt={product.name}
                                    className="w-20 h-20"
                                />
                                <Link
                                    href={`/product/${product.product_id}`}
                                    className="flex items-center space-x-1"
                                    target="_blank"
                                >
                                    <span className="lg:ml-4 mt-4 lg:mt-0 line-clamp-4">{product.name}</span>
                                    <ExternalLink size={12} />
                                </Link>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                                <span className="text-muted-foreground line-clamp-4">
                                    {product.description}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">{product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{product.stock}</TableCell>
                            <TableCell className="text-center">
                                <Link
                                    href={`/category/${product.category}`}
                                    className={badgeVariants({ variant: "outline" })}
                                >{product.category}</Link>
                            </TableCell>
                            <TableCell className="text-center">
                                {product.deleted_at !== null ? (
                                    <Badge variant="outline" className="text-white bg-red-600">Deleted</Badge>
                                ) : product.stock > 0 ? (
                                    <Badge variant="outline" className="text-white bg-green-600">Avaliable</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-white bg-yellow-600">Out of Stock</Badge>
                                )}
                            </TableCell>
                            <TableCell className="w-[100px]">
                                <div className="flex gap-2 justify-end w-full">
                                    <ReviewProduct product_id={product.product_id} rating={product.rating ?? 0} />
                                    {product.deleted_at === null &&
                                        <>
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="w-8 h-8 text-blue-500"
                                                            onClick={() => setAddOrUpdateProduct(product)}
                                                        >
                                                            <SquarePen size={16} />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom">Update</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <DeleteProduct product_id={product.product_id} />
                                        </>
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return (
        <div className="w-full">
            <span className="text-3xl font-bold">Product</span>
            <p className="text-muted-foreground my-4">Manage your products</p>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setAddOrUpdateProduct(defaultProductInfo)}>Add Product</Button>
            </div>
            {addOrUpdateProduct && <AddOrUpdateProductDialog />}
            <RenderProducts />
        </div>
    )
}

export default AdminProduct;