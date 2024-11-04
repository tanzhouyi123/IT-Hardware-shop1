'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { badgeVariants } from "@/components/ui/badge"
import Link from "next/link"

export default function Home() {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search');

  // Get product list
  useEffect(() => {
    if (searchQuery === null)
      fetch('/api/product/getAllProduct', {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => setProductList(data))
    else
      fetch('/api/product/getProductByName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_name: searchQuery }),
      })
        .then(response => response.json())
        .then(data => setProductList(data))
    setIsLoading(false);
  }, [searchQuery]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-6 md:py-12 lg:py-16 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto p-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              {searchQuery ? 'Search Results' : 'Featured Products'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? [1, 2, 3, 4].map((_, index) =>   // Loading skeleton
                <Card className="p-6" key={index}>
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-40 rounded-xl" />
                    <div className="space-y-4">
                      <Skeleton className="h-6" />
                      <Skeleton className="h-6" />
                      <Skeleton className="h-6" />
                      <Skeleton className="h-6" />
                    </div>
                  </div>
                </Card>
              ) : productList.length === 0 ? (    // No products found
                <div className="text-center">
                  <p className="text-2xl">No products found</p>
                </div>
              ) : productList.map((product: any) => (  // Display products
                <Card key={product.product_id}>
                  <CardHeader>
                    <img
                      src={product.cover}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle>{product.name}</CardTitle>
                    <p className="text-muted-foreground line-clamp-3">{product.description}</p>
                  </CardContent>
                  <CardContent className="flex justify-between">
                    <Link
                      href={`/category/${product.category}`}
                      className={badgeVariants({ variant: "outline" })}
                    >{product.category}</Link>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{product.rating ? (product.rating).toFixed(1) : 0}</span>
                      <Star />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-left text-2xl font-bold">RM {product.price.toFixed(2)}</span>
                    <Button onClick={() => router.push(`/product/${product.product_id}`)}>View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
