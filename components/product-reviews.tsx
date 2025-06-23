"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Star, ThumbsUp, User, Camera, CheckCircle } from "lucide-react"
import { mockApi, type Review } from "@/lib/api"

interface ProductReviewsProps {
  productId: number
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await mockApi.getReviews(productId, currentPage)
        setReviews(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reviews")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId, currentPage])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const getFitText = (fit: string) => {
    switch (fit) {
      case "small":
        return "작아요"
      case "large":
        return "커요"
      default:
        return "적당해요"
    }
  }

  const getFitColor = (fit: string) => {
    switch (fit) {
      case "small":
        return "text-blue-600 bg-blue-50"
      case "large":
        return "text-red-600 bg-red-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>상품 리뷰</CardTitle>
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
          <CardTitle>상품 리뷰</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-center py-8">리뷰를 불러올 수 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>상품 리뷰 ({pagination.total})</span>
          <Button variant="outline" size="sm">
            리뷰 작성하기
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">아직 작성된 리뷰가 없습니다.</p>
            <Button>첫 번째 리뷰를 작성해보세요</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            구매확인
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {renderStars(review.rating)}
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{review.content}</p>
                </div>

                {/* 구매 정보 */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">구매옵션:</span>
                    <Badge variant="outline">{review.color}</Badge>
                    <Badge variant="outline">{review.size}</Badge>
                  </div>
                  {review.height && review.weight && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">체형:</span>
                      <span>
                        {review.height}, {review.weight}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">사이즈:</span>
                    <Badge className={getFitColor(review.fit)}>{getFitText(review.fit)}</Badge>
                  </div>
                </div>

                {/* 리뷰 이미지 */}
                {review.images.length > 0 && (
                  <div className="flex space-x-2">
                    {review.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`리뷰 이미지 ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        />
                        <div className="absolute top-1 right-1 bg-black/50 rounded-full p-1">
                          <Camera className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 도움이 됐어요 */}
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    도움이 됐어요 ({review.helpfulCount})
                  </Button>
                </div>

                <Separator />
              </div>
            ))}

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                <span className="flex items-center px-3 text-sm">
                  {currentPage} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  다음
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
