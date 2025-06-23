"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, User, ShoppingBag, Trash2, Star } from "lucide-react"
import { useStore } from "@/lib/store"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart, getCartCount } = useStore()

  const handleAddToCart = (item: any) => {
    // 기본값으로 첫 번째 색상과 사이즈 선택
    const defaultColor = item.product.colors[0] || "기본색상"
    const defaultSize = item.product.sizes[0] || "기본사이즈"
    addToCart(item.product, defaultColor, defaultSize, 1)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">찜한 상품</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-medium mb-2">찜한 상품이 없습니다</h2>
            <p className="text-gray-500 mb-6">마음에 드는 상품을 찜해보세요</p>
            <Link href="/">
              <Button>쇼핑 계속하기</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">찜한 상품</h2>
              <p className="text-gray-600">총 {wishlistItems.length}개의 상품</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group relative">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Link href={`/product/${item.product.id}`}>
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => removeFromWishlist(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      {item.product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">NEW</Badge>}
                      {item.product.discount > 0 && (
                        <Badge className="absolute top-8 left-2 bg-red-500">{item.product.discount}%</Badge>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="text-xs text-gray-500 mb-1">{item.product.brand}</p>
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="text-sm font-medium mb-2 line-clamp-2 hover:text-gray-600">
                          {item.product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-bold">{item.product.price.toLocaleString()}원</span>
                        {item.product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {item.product.originalPrice.toLocaleString()}원
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span>{item.product.rating}</span>
                        </div>
                        <span className="ml-2">({item.product.reviewCount.toLocaleString()})</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.product.stock === 0}
                      >
                        {item.product.stock === 0 ? "품절" : "장바구니 담기"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
