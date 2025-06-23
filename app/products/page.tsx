"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductGrid } from "@/components/product-grid"
import { SearchModal } from "@/components/search-modal"
import { ArrowLeft, Filter, Grid3X3, List, Search, User, ShoppingBag, Heart } from "lucide-react"
import { useProducts, useBrands } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import { useStore } from "@/lib/store"
import type { ProductFilters } from "@/lib/api"

const priceRanges = [
  { label: "3만원 이하", min: 0, max: 30000 },
  { label: "3만원 - 5만원", min: 30000, max: 50000 },
  { label: "5만원 - 10만원", min: 50000, max: 100000 },
  { label: "10만원 이상", min: 100000, max: Number.POSITIVE_INFINITY },
]

export default function ProductsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { categories } = useCategories()
  const { brands } = useBrands()
  const { getCartCount, wishlistItems } = useStore()

  // 필터 조건 생성
  const filters: ProductFilters = {
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    brands: selectedBrands.length > 0 ? selectedBrands : undefined,
    sortBy: sortBy as ProductFilters["sortBy"],
    page: currentPage,
    limit: 20,
  }

  // 가격 범위 필터 적용
  if (selectedPriceRange.length > 0) {
    const ranges = selectedPriceRange.map((label) => priceRanges.find((range) => range.label === label)).filter(Boolean)

    if (ranges.length > 0) {
      filters.priceMin = Math.min(...ranges.map((r) => r!.min))
      filters.priceMax = Math.max(...ranges.map((r) => (r!.max === Number.POSITIVE_INFINITY ? 1000000 : r!.max)))
    }
  }

  const { products, loading, error, pagination } = useProducts(filters)

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug) ? prev.filter((c) => c !== categorySlug) : [...prev, categorySlug],
    )
    setCurrentPage(1)
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
    setCurrentPage(1)
  }

  const togglePriceRange = (range: string) => {
    setSelectedPriceRange((prev) => (prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedPriceRange([])
    setCurrentPage(1)
  }

  const loadMore = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRange.length > 0

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
              <h1 className="text-xl font-bold">전체 상품</h1>
            </div>

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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Toggle & View Mode */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              <Filter className="h-5 w-5 mr-2" />
              필터
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                필터 초기화
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"} space-y-6`}>
            {/* Categories Filter */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">카테고리</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() => toggleCategory(category.slug)}
                      />
                      <label className="text-sm cursor-pointer">
                        {category.name} ({category.productCount})
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brands Filter */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">브랜드</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedBrands.includes(brand.name)}
                        onCheckedChange={() => toggleBrand(brand.name)}
                      />
                      <label className="text-sm cursor-pointer">{brand.name}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Filter */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">가격</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.label} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedPriceRange.includes(range.label)}
                        onCheckedChange={() => togglePriceRange(range.label)}
                      />
                      <label className="text-sm cursor-pointer">{range.label}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Sort and Results */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">
                  총 {pagination.total.toLocaleString()}개 상품
                  {hasActiveFilters && <span className="ml-2">(필터 적용됨)</span>}
                </p>
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategories.map((slug) => {
                      const category = categories.find((c) => c.slug === slug)
                      return (
                        <span
                          key={slug}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {category?.name}
                        </span>
                      )
                    })}
                    {selectedBrands.map((brand) => (
                      <span
                        key={brand}
                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {brand}
                      </span>
                    ))}
                    {selectedPriceRange.map((range) => (
                      <span
                        key={range}
                        className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                      >
                        {range}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="newest">최신순</SelectItem>
                  <SelectItem value="price-low">낮은 가격순</SelectItem>
                  <SelectItem value="price-high">높은 가격순</SelectItem>
                  <SelectItem value="rating">평점순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid/List */}
            <ProductGrid products={products} loading={loading} error={error} viewMode={viewMode} />

            {/* Load More */}
            {pagination.page < pagination.totalPages && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" onClick={loadMore} disabled={loading}>
                  {loading ? "로딩 중..." : "더 보기"}
                </Button>
              </div>
            )}

            {/* Pagination Info */}
            <div className="text-center mt-4 text-sm text-gray-500">
              {pagination.page} / {pagination.totalPages} 페이지
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
