"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "./api"

// 사용자 타입
export interface User {
  id: string
  name: string
  email: string
  isGuest: boolean
}

// 장바구니 아이템 타입
export interface CartItem {
  id: string
  product: Product
  color: string
  size: string
  quantity: number
  addedAt: string
}

// 찜 아이템 타입
export interface WishlistItem {
  id: string
  product: Product
  addedAt: string
}

// 스토어 타입
interface Store {
  // 사용자 관련
  user: User | null
  setUser: (user: User) => void
  logout: () => void

  // 장바구니 관련
  cartItems: CartItem[]
  addToCart: (product: Product, color: string, size: string, quantity: number) => void
  removeFromCart: (itemId: string) => void
  updateCartQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number

  // 찜하기 관련
  wishlistItems: WishlistItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean

  // 검색 관련
  searchHistory: string[]
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // 사용자 관련
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, cartItems: [], wishlistItems: [] }),

      // 장바구니 관련
      cartItems: [],
      addToCart: (product, color, size, quantity) => {
        const existingItem = get().cartItems.find(
          (item) => item.product.id === product.id && item.color === color && item.size === size,
        )

        if (existingItem) {
          // 기존 아이템이 있으면 수량 증가
          set({
            cartItems: get().cartItems.map((item) =>
              item.id === existingItem.id ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          })
        } else {
          // 새 아이템 추가
          const newItem: CartItem = {
            id: `${product.id}-${color}-${size}-${Date.now()}`,
            product,
            color,
            size,
            quantity,
            addedAt: new Date().toISOString(),
          }
          set({ cartItems: [...get().cartItems, newItem] })
        }
      },
      removeFromCart: (itemId) => {
        set({ cartItems: get().cartItems.filter((item) => item.id !== itemId) })
      },
      updateCartQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId)
          return
        }
        set({
          cartItems: get().cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        })
      },
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },
      getCartCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0)
      },

      // 찜하기 관련
      wishlistItems: [],
      addToWishlist: (product) => {
        const existingItem = get().wishlistItems.find((item) => item.product.id === product.id)
        if (!existingItem) {
          const newItem: WishlistItem = {
            id: `wishlist-${product.id}-${Date.now()}`,
            product,
            addedAt: new Date().toISOString(),
          }
          set({ wishlistItems: [...get().wishlistItems, newItem] })
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlistItems: get().wishlistItems.filter((item) => item.product.id !== productId) })
      },
      isInWishlist: (productId) => {
        return get().wishlistItems.some((item) => item.product.id === productId)
      },

      // 검색 관련
      searchHistory: [],
      addToSearchHistory: (query) => {
        const history = get().searchHistory
        const filteredHistory = history.filter((item) => item !== query)
        const newHistory = [query, ...filteredHistory].slice(0, 10) // 최대 10개까지 저장
        set({ searchHistory: newHistory })
      },
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: "musinsa-store",
      partialize: (state) => ({
        user: state.user,
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        searchHistory: state.searchHistory,
      }),
    },
  ),
)
