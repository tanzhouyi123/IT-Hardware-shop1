'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, ChevronsUpDown, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { badgeVariants } from "@/components/ui/badge"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function CategoryPage({ params }: { params: { category_name: string } }) {
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Get category list
  useEffect(() => {
    fetch('/api/product/getAllCategory', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => setCategoryList(data.map((item: any) => item.category)))
  }, []);

  // Get product list
  useEffect(() => {
    if (params.category_name === 'All')
      fetch('/api/product/getAllProduct', {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => setProductList(data))
    else
      fetch('/api/product/getProductByCategoryName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_name: params.category_name }),
      })
        .then(response => response.json())
        .then(data => setProductList(data))
    setIsLoading(false);
  }, [params.category_name]);

  const CategoryCombobox = () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {params.category_name === 'All' ? "Select category..." : params.category_name}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categoryList.map((item, index) => (
                  <CommandItem
                    key={index}
                    value={item}
                    onSelect={(currentValue) => {
                      setOpen(false)
                      router.push(`/category/${currentValue}`)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        params.category_name === item ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-6 md:py-12 lg:py-16 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto p-4">
            <h2 className="text-3xl font-bold sm:text-5xl text-center">Category</h2>
          </div>
          <div className="container px-4 md:px-6 mx-auto p-4">
            <p className="mb-12">Select Category: <CategoryCombobox /></p>
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
