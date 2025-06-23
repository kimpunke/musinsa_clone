"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product-grid"
import { ArrowLeft, Search, User, ShoppingBag } from "lucide-react"
import { useProducts, useBrands } from "@/hooks/useProducts"

interface BrandPageProps {
  params: {
    slug: string
  }
}

export default function BrandPage({ params }: BrandPageProps) {
  const { brands } = useBrands()
  const brand = brands.find((b) => b.slug === params.slug)

  const { products, loading, error } = useProducts({
    brands: brand ? [brand.name] : [],
    limit: 24,
  })

  if (!brand && brands.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">브랜드를 찾을 수 없습니다.</p>
          <Link href="/brands">
            <Button>브랜드 목록으로 돌아가기</Button>
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
              <Link href="/brands">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">{brand?.name || params.slug}</h1>
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

      {/* Brand Info */}
      {brand && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-32 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">{brand.name}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{brand.description}</p>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{brand?.name || params.slug} 상품</h2>
          <p className="text-gray-600">총 {products.length}개의 상품이 있습니다</p>
        </div>

        <ProductGrid products={products} loading={loading} error={error} viewMode="grid" />
      </div>
    </div>
  )
}
