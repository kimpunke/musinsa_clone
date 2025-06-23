"use client"

import { useState, useEffect } from "react"
import { type Product, type ProductFilters, mockApi, type Brand } from "@/lib/api"

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  const fetchProducts = async (newFilters: ProductFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const mergedFilters = { ...filters, ...newFilters }
      const response = await mockApi.getProducts(mergedFilters)

      setProducts(response.data)
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const refetch = (newFilters: ProductFilters = {}) => {
    fetchProducts(newFilters)
  }

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  }
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await mockApi.getProduct(id)
        setProduct(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await mockApi.getFeaturedProducts()
        setProducts(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch featured products")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return { products, loading, error }
}

export function useRelatedProducts(productId: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await mockApi.getRelatedProducts(productId)
        setProducts(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch related products")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchRelatedProducts()
    }
  }, [productId])

  return { products, loading, error }
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await mockApi.getBrands()
        setBrands(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch brands")
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return { brands, loading, error }
}
