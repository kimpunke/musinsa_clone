"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Minus, Plus, Trash2, Search, User, ShoppingBag } from "lucide-react"
import { useStore } from "@/lib/store"
import { useState } from "react"

export default function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useStore()
  const [selectedItems, setSelectedItems] = useState<string[]>(cartItems.map((item) => item.id))

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map((item) => item.id))
    }
  }

  const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id))
  const totalPrice = selectedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const totalOriginalPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity,
    0,
  )
  const totalDiscount = totalOriginalPrice - totalPrice
  const deliveryFee = totalPrice >= 50000 ? 0 : 3000
  const finalPrice = totalPrice + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-xl font-bold">장바구니</h1>
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
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-medium mb-2">장바구니가 비어있습니다</h2>
            <p className="text-gray-500 mb-6">원하는 상품을 장바구니에 담아보세요</p>
            <Link href="/">
              <Button>쇼핑 계속하기</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                      <span className="font-medium">
                        전체선택 ({selectedItems.length}/{cartItems.length})
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500"
                        onClick={() => {
                          selectedItems.forEach((itemId) => removeFromCart(itemId))
                          setSelectedItems([])
                        }}
                        disabled={selectedItems.length === 0}
                      >
                        선택삭제
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500"
                        onClick={() => {
                          clearCart()
                          setSelectedItems([])
                        }}
                      >
                        전체삭제
                      </Button>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />

                        <Link href={`/product/${item.product.id}`}>
                          <img
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-20 h-24 object-cover rounded cursor-pointer hover:opacity-80"
                          />
                        </Link>

                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">{item.product.brand}</p>
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="font-medium mb-2 hover:text-gray-600 cursor-pointer">{item.product.name}</h3>
                          </Link>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.color} / {item.size}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold">
                                  {(item.product.price * item.quantity).toLocaleString()}원
                                </span>
                                {item.product.originalPrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {(item.product.originalPrice * item.quantity).toLocaleString()}원
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-bold mb-4">주문 요약</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>상품금액 ({selectedCartItems.length}개)</span>
                      <span>{totalOriginalPrice.toLocaleString()}원</span>
                    </div>

                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-red-500">
                        <span>할인금액</span>
                        <span>-{totalDiscount.toLocaleString()}원</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>배송비</span>
                      <span>{deliveryFee === 0 ? "무료" : `${deliveryFee.toLocaleString()}원`}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>총 결제금액</span>
                      <span>{finalPrice.toLocaleString()}원</span>
                    </div>
                  </div>

                  {totalPrice < 50000 && totalPrice > 0 && (
                    <p className="text-xs text-gray-500 mt-3">
                      {(50000 - totalPrice).toLocaleString()}원 더 구매하시면 무료배송!
                    </p>
                  )}

                  <Button className="w-full mt-6 h-12" disabled={selectedCartItems.length === 0}>
                    주문하기 ({selectedCartItems.length}개)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">배송 안내</h3>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 5만원 이상 구매시 무료배송</li>
                    <li>• 평일 오후 2시 이전 주문시 당일발송</li>
                    <li>• 제주/도서산간 지역 추가배송비 발생</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
