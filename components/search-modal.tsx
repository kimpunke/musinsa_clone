"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { X, Search, Clock, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { mockApi, type Product } from "@/lib/api"
import Link from "next/link"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const { searchHistory, addToSearchHistory, clearSearchHistory } = useStore()

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await mockApi.getProducts({ search: searchQuery, limit: 8 })
      setResults(response.data)
      addToSearchHistory(searchQuery)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery)
    handleSearch(historyQuery)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        handleSearch(query)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Search Header */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="상품명, 브랜드명을 검색해보세요"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Search History */}
            {!query && searchHistory.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">최근 검색어</h3>
                  <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && (
              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">검색 결과 ({results.length}개)</h3>
                    {results.map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`} onClick={onClose}>
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold">{product.price.toLocaleString()}원</span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {product.originalPrice.toLocaleString()}원
                                </span>
                              )}
                            </div>
                          </div>
                          {product.discount > 0 && <Badge className="bg-red-500">{product.discount}%</Badge>}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">검색 결과가 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
