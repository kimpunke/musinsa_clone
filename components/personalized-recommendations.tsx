"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Heart, Star, Sparkles } from "lucide-react"
import { mockApi, type Product } from "@/lib/api"
import { useStore } from "@/lib/store"

export function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useStore()

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await mockApi.getRecommendedProducts(user?.id)
        setRecommendations(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch recommendations")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [user])

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>{user ? `${user.name}님을 위한 추천` : "추천 상품"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>추천 상품</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-center py-8">추천 상품을 불러올 수 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span>{user ? `${user.name}님을 위한 추천` : "추천 상품"}</span>
          <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-700">
            AI 추천
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="group cursor-pointer">
                <div className="relative mb-2">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full aspect-[4/5] object-cover rounded-lg group-hover:scale-105 transition-transform"
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
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                  <h3 className="text-sm font-medium mb-1 line-clamp-2 group-hover:text-purple-600">{product.name}</h3>
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-sm font-bold">{product.price.toLocaleString()}원</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span>{product.rating}</span>
                    <span className="ml-1">({product.reviewCount})</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href="/products">
            <Button variant="outline" size="sm">
              더 많은 추천 상품 보기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
