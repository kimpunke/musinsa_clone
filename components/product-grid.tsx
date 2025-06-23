"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Heart, Star } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/api"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  error?: string | null
  viewMode?: "grid" | "list"
}

export function ProductGrid({ products, loading, error, viewMode = "grid" }: ProductGridProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useStore()

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">오류가 발생했습니다: {error}</p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">상품이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}>
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          {viewMode === "grid" ? (
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => handleWishlistToggle(e, product)}
                  >
                    <Heart
                      className={`h-4 w-4 ${isInWishlist(product.id) ? "text-red-500 fill-current" : "text-gray-600"}`}
                    />
                  </Button>
                  {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">NEW</Badge>}
                  {product.discount > 0 && (
                    <Badge className="absolute top-8 left-2 bg-red-500">{product.discount}%</Badge>
                  )}
                  {product.stock <= 10 && product.stock > 0 && (
                    <Badge className="absolute bottom-2 left-2 bg-orange-500">품절임박</Badge>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-gray-800">품절</Badge>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                  <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-bold">{product.price.toLocaleString()}원</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="ml-2">({product.reviewCount.toLocaleString()})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-24 h-32 object-cover rounded group-hover:scale-105 transition-transform"
                    />
                    {product.isNew && <Badge className="absolute top-1 left-1 bg-green-500 text-xs">NEW</Badge>}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                        <Badge className="bg-gray-800 text-xs">품절</Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-bold">{product.price.toLocaleString()}원</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice.toLocaleString()}원
                          </span>
                          <Badge className="bg-red-500 text-xs">{product.discount}%</Badge>
                        </>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="ml-2">({product.reviewCount.toLocaleString()})</span>
                    </div>
                    <p className="text-xs text-gray-400">재고: {product.stock}개</p>
                  </div>

                  <Button variant="ghost" size="sm" onClick={(e) => handleWishlistToggle(e, product)}>
                    <Heart
                      className={`h-4 w-4 ${isInWishlist(product.id) ? "text-red-500 fill-current" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </Link>
      ))}
    </div>
  )
}
