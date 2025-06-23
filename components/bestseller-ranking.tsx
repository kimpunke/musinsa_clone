"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { TrendingUp, Crown, Medal, Award } from "lucide-react"
import { mockApi, type Product } from "@/lib/api"

export function BestsellerRanking() {
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await mockApi.getBestSellers()
        setBestSellers(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch best sellers")
      } finally {
        setLoading(false)
      }
    }

    fetchBestSellers()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>실시간 베스트</span>
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
            <TrendingUp className="h-5 w-5" />
            <span>실시간 베스트</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-center py-8">데이터를 불러올 수 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-red-500" />
          <span>실시간 베스트</span>
          <Badge variant="outline" className="ml-auto">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {bestSellers.map((product, index) => {
            const rank = index + 1
            return (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="flex items-center p-3 hover:bg-gray-50 transition-colors group">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8 mr-3">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${getRankBadgeColor(rank)}`}
                    >
                      {rank <= 3 ? getRankIcon(rank) : rank}
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="w-12 h-12 mr-3 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sales Count */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">판매량</p>
                    <p className="text-sm font-bold text-red-500">{product.salesCount.toLocaleString()}</p>
                  </div>

                  {/* Rank Change Indicator */}
                  {rank <= 3 && (
                    <div className="ml-2 flex items-center">
                      <TrendingUp className="h-3 w-3 text-red-500" />
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="p-3 border-t">
          <Link href="/products?sortBy=popular">
            <div className="text-center text-sm text-gray-600 hover:text-blue-600 cursor-pointer">전체 랭킹 보기 →</div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
