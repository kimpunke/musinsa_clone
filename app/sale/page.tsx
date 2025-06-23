"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product-grid"
import { ArrowLeft, Search, User, ShoppingBag } from "lucide-react"
import { useProducts } from "@/hooks/useProducts"

export default function SalePage() {
  // 할인 상품만 필터링
  const { products, loading, error } = useProducts({
    sortBy: "price-low",
    limit: 24,
  })

  // 할인 상품만 필터링
  const saleProducts = products.filter((product) => product.discount > 0)

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
              <h1 className="text-xl font-bold text-red-500">SALE</h1>
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    2
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sale Banner */}
      <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">SPECIAL SALE</h1>
          <p className="text-xl mb-6">최대 50% 할인 특가 상품</p>
          <p className="text-lg">놓치면 후회하는 기회! 지금 바로 쇼핑하세요</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">할인 상품</h2>
          <p className="text-gray-600">총 {saleProducts.length}개의 할인 상품이 있습니다</p>
        </div>

        <ProductGrid products={saleProducts} loading={loading} error={error} viewMode="grid" />

        {saleProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">현재 진행 중인 할인 상품이 없습니다.</p>
            <Link href="/">
              <Button>전체 상품 보기</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
