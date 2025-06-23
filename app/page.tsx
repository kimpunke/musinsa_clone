"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product-grid"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SearchModal } from "@/components/search-modal"
import { BannerSlider } from "@/components/banner-slider"
import { BestsellerRanking } from "@/components/bestseller-ranking"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { ShoppingBag, Search, User, Menu, Heart } from "lucide-react"
import { useFeaturedProducts } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import { useStore } from "@/lib/store"

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { products: featuredProducts, loading: productsLoading } = useFeaturedProducts()
  const { categories, loading: categoriesLoading } = useCategories()
  const { getCartCount, wishlistItems } = useStore()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/" className="text-2xl font-bold text-black">
                MUSINSA
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/category/men" className="text-sm font-medium hover:text-gray-600">
                MEN
              </Link>
              <Link href="/category/women" className="text-sm font-medium hover:text-gray-600">
                WOMEN
              </Link>
              <Link href="/category/kids" className="text-sm font-medium hover:text-gray-600">
                KIDS
              </Link>
              <Link href="/brands" className="text-sm font-medium hover:text-gray-600">
                BRANDS
              </Link>
              <Link href="/sale" className="text-sm font-medium hover:text-gray-600 text-red-500">
                SALE
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>
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

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Hero Banner Slider */}
      <BannerSlider />

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">카테고리</h2>
          {categoriesLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <div className="text-center group cursor-pointer">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.productCount.toLocaleString()}개</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Bestseller Ranking */}
            <div className="lg:col-span-1">
              <BestsellerRanking />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Personalized Recommendations */}
              <PersonalizedRecommendations />

              {/* Featured Products */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">추천 상품</h2>
                  <Link href="/products">
                    <Button variant="outline">전체보기</Button>
                  </Link>
                </div>

                <ProductGrid products={featuredProducts} loading={productsLoading} viewMode="grid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">MUSINSA</h3>
              <p className="text-sm text-gray-400">대한민국 대표 패션 플랫폼</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">고객센터</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>1588-0000</li>
                <li>평일 09:00-18:00</li>
                <li>주말/공휴일 휴무</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">회사정보</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>회사소개</li>
                <li>채용정보</li>
                <li>이용약관</li>
                <li>개인정보처리방침</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">SNS</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Instagram
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  YouTube
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 MUSINSA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
