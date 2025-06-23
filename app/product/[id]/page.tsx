"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ProductGrid } from "@/components/product-grid"
import { ProductReviews } from "@/components/product-reviews"
import { Heart, ShoppingBag, Star, Minus, Plus, ArrowLeft, Share2 } from "lucide-react"
import { useProduct, useRelatedProducts } from "@/hooks/useProducts"
import { useStore } from "@/lib/store"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = Number.parseInt(params.id)
  const { product, loading, error } = useProduct(productId)
  const { products: relatedProducts, loading: relatedLoading } = useRelatedProducts(productId)
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, getCartCount } = useStore()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)

  // 상품이 로드되면 기본 색상 설정
  useEffect(() => {
    if (product && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0])
    }
  }, [product, selectedColor])

  const handleAddToCart = () => {
    if (product && selectedColor && selectedSize) {
      addToCart(product, selectedColor, selectedSize, quantity)
      alert("장바구니에 추가되었습니다!")
    }
  }

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
      } else {
        addToWishlist(product)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">상품을 불러올 수 없습니다.</p>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
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
              <Link href="/" className="text-2xl font-bold text-black">
                MUSINSA
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleWishlistToggle}>
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "text-red-500 fill-current" : ""}`} />
              </Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-black" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating} ({product.reviewCount.toLocaleString()}개 리뷰)
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl font-bold">{product.price.toLocaleString()}원</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                    <Badge className="bg-red-500">{product.discount}% 할인</Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 10 ? (
                  <Badge className="bg-green-500">재고 충분</Badge>
                ) : product.stock > 0 ? (
                  <Badge className="bg-orange-500">품절임박 (재고 {product.stock}개)</Badge>
                ) : (
                  <Badge className="bg-gray-500">품절</Badge>
                )}
              </div>

              {/* Sales Count */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  판매량: <span className="font-medium text-red-500">{product.salesCount.toLocaleString()}개</span>
                </p>
              </div>
            </div>

            <Separator />

            {/* Color Selection */}
            <div>
              <h3 className="font-medium mb-3">색상</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg text-sm ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-medium mb-3">사이즈</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border rounded-lg text-sm font-medium ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">수량</h3>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full h-12 text-lg"
                disabled={!selectedSize || product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.stock === 0 ? "품절" : "장바구니 담기"}
              </Button>
              <Button variant="outline" className="w-full h-12 text-lg" disabled={!selectedSize || product.stock === 0}>
                {product.stock === 0 ? "품절" : "바로 구매하기"}
              </Button>
            </div>

            {/* Product Description */}
            <div className="pt-6">
              <h3 className="font-medium mb-3">상품 설명</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <h4 className="font-medium mb-2">상품 정보</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {product.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <section className="mt-16">
          <ProductReviews productId={productId} />
        </section>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">연관 상품</h2>
          <ProductGrid products={relatedProducts} loading={relatedLoading} viewMode="grid" />
        </section>
      </div>
    </div>
  )
}
