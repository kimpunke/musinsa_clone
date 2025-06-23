// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.musinsa-clone.com"

// API 응답 타입 정의
export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  discount: number
  image: string
  images: string[]
  colors: string[]
  sizes: string[]
  description: string
  details: string[]
  rating: number
  reviewCount: number
  isNew: boolean
  category: string
  subcategory?: string
  stock: number
  salesCount: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  image: string
  productCount: number
}

export interface Brand {
  id: number
  name: string
  slug: string
  logo: string
  description: string
}

export interface Review {
  id: number
  productId: number
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  images: string[]
  size: string
  color: string
  height?: string
  weight?: string
  fit: "small" | "normal" | "large"
  isVerified: boolean
  helpfulCount: number
  createdAt: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProductFilters {
  category?: string
  categories?: string[]
  brands?: string[]
  priceMin?: number
  priceMax?: number
  colors?: string[]
  sizes?: string[]
  sortBy?: "popular" | "newest" | "price-low" | "price-high" | "rating"
  page?: number
  limit?: number
  search?: string
}

// API 클라이언트 클래스
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // 상품 관련 API
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(","))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    return this.request<Product[]>(`/products?${params.toString()}`)
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`)
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>("/products/featured")
  }

  async getRelatedProducts(productId: number): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/${productId}/related`)
  }

  async getRecommendedProducts(userId?: string): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/recommended${userId ? `?userId=${userId}` : ""}`)
  }

  async getBestSellers(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>("/products/bestsellers")
  }

  async searchProducts(query: string, filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams({ search: query })

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(","))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    return this.request<Product[]>(`/products/search?${params.toString()}`)
  }

  // 리뷰 관련 API
  async getReviews(productId: number, page = 1): Promise<ApiResponse<Review[]>> {
    return this.request<Review[]>(`/products/${productId}/reviews?page=${page}`)
  }

  async createReview(review: Omit<Review, "id" | "createdAt" | "helpfulCount">): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/products/${review.productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
    })
  }

  // 카테고리 관련 API
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>("/categories")
  }

  async getCategory(slug: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${slug}`)
  }

  // 브랜드 관련 API
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    return this.request<Brand[]>("/brands")
  }

  async getBrand(slug: string): Promise<ApiResponse<Brand>> {
    return this.request<Brand>(`/brands/${slug}`)
  }
}

// API 클라이언트 인스턴스
export const apiClient = new ApiClient(API_BASE_URL)

// Mock 데이터 (개발용) - 더 많은 상품 추가
export const mockProducts: Product[] = [
  // 상의 카테고리
  {
    id: 1,
    name: "오버핏 후드 티셔츠",
    brand: "무신사 스탠다드",
    price: 39000,
    originalPrice: 49000,
    discount: 20,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "White", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "편안한 착용감의 오버핏 후드 티셔츠입니다. 부드러운 면 소재로 제작되어 일상복으로 착용하기 좋습니다.",
    details: ["소재: 면 100%", "색상: 블랙, 화이트, 그레이, 네이비", "사이즈: S~XXL", "세탁방법: 찬물 손세탁 권장"],
    rating: 4.5,
    reviewCount: 1247,
    isNew: true,
    category: "tops",
    subcategory: "후드티",
    stock: 150,
    salesCount: 2847,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: 2,
    name: "베이직 크루넥 티셔츠",
    brand: "유니클로",
    price: 19900,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=750&fit=crop",
    ],
    colors: ["White", "Black", "Gray", "Navy", "Red"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "심플하고 베이직한 크루넥 티셔츠입니다. 어떤 스타일링에도 잘 어울리는 필수 아이템입니다.",
    details: ["소재: 면 100%", "색상: 화이트, 블랙, 그레이, 네이비, 레드", "사이즈: XS~XL"],
    rating: 4.3,
    reviewCount: 2156,
    isNew: false,
    category: "tops",
    subcategory: "티셔츠",
    stock: 300,
    salesCount: 5432,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: 3,
    name: "스트라이프 셔츠",
    brand: "커버낫",
    price: 65000,
    originalPrice: 85000,
    discount: 24,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop",
    ],
    colors: ["Blue", "White", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "클래식한 스트라이프 패턴의 셔츠입니다. 비즈니스 캐주얼부터 데일리까지 활용도가 높습니다.",
    details: ["소재: 면 100%", "색상: 블루, 화이트, 네이비", "사이즈: S~XL"],
    rating: 4.6,
    reviewCount: 892,
    isNew: true,
    category: "tops",
    subcategory: "셔츠",
    stock: 120,
    salesCount: 1234,
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
  },

  // 하의 카테고리
  {
    id: 4,
    name: "와이드 데님 팬츠",
    brand: "리바이스",
    price: 89000,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=750&fit=crop",
    ],
    colors: ["Blue", "Black", "Light Blue"],
    sizes: ["28", "30", "32", "34", "36"],
    description: "트렌디한 와이드 핏의 데님 팬츠입니다. 편안한 착용감과 스타일리시한 실루엣을 동시에 만족시킵니다.",
    details: ["소재: 면 98%, 스판덱스 2%", "색상: 블루, 블랙, 라이트블루", "사이즈: 28~36"],
    rating: 4.4,
    reviewCount: 1456,
    isNew: false,
    category: "bottoms",
    subcategory: "데님",
    stock: 89,
    salesCount: 3456,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: 5,
    name: "슬랙스 팬츠",
    brand: "무신사 스탠다드",
    price: 45000,
    originalPrice: 59000,
    discount: 24,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "Navy", "Gray", "Beige"],
    sizes: ["28", "30", "32", "34", "36"],
    description: "깔끔한 핏의 슬랙스 팬츠입니다. 오피스룩부터 캐주얼까지 다양하게 활용 가능합니다.",
    details: ["소재: 폴리에스터 70%, 레이온 30%", "색상: 블랙, 네이비, 그레이, 베이지"],
    rating: 4.2,
    reviewCount: 678,
    isNew: true,
    category: "bottoms",
    subcategory: "슬랙스",
    stock: 156,
    salesCount: 1876,
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: 6,
    name: "카고 팬츠",
    brand: "스톤아일랜드",
    price: 125000,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=750&fit=crop",
    ],
    colors: ["Khaki", "Black", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    description: "실용적인 포켓이 많은 카고 팬츠입니다. 스트릿 패션의 필수 아이템입니다.",
    details: ["소재: 면 100%", "색상: 카키, 블랙, 올리브", "사이즈: S~XL"],
    rating: 4.7,
    reviewCount: 543,
    isNew: true,
    category: "bottoms",
    subcategory: "카고팬츠",
    stock: 67,
    salesCount: 987,
    createdAt: "2024-01-16T00:00:00Z",
    updatedAt: "2024-01-21T00:00:00Z",
  },

  // 아우터 카테고리
  {
    id: 7,
    name: "오버사이즈 블레이저",
    brand: "앤더슨벨",
    price: 159000,
    originalPrice: 199000,
    discount: 20,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "Navy", "Beige"],
    sizes: ["S", "M", "L", "XL"],
    description: "트렌디한 오버사이즈 핏의 블레이저입니다. 포멀부터 캐주얼까지 다양하게 연출 가능합니다.",
    details: ["소재: 폴리에스터 80%, 레이온 20%", "색상: 블랙, 네이비, 베이지"],
    rating: 4.6,
    reviewCount: 324,
    isNew: false,
    category: "outerwear",
    subcategory: "블레이저",
    stock: 45,
    salesCount: 654,
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
  {
    id: 8,
    name: "패딩 점퍼",
    brand: "노스페이스",
    price: 189000,
    originalPrice: 229000,
    discount: 17,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "Navy", "Red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "따뜻하고 가벼운 패딩 점퍼입니다. 겨울철 필수 아우터로 보온성이 뛰어납니다.",
    details: ["소재: 나ylon 100%, 충전재: 다운 90%", "색상: 블랙, 네이비, 레드"],
    rating: 4.8,
    reviewCount: 1892,
    isNew: true,
    category: "outerwear",
    subcategory: "패딩",
    stock: 234,
    salesCount: 4321,
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: 9,
    name: "트렌치 코트",
    brand: "버버리",
    price: 450000,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=750&fit=crop",
    ],
    colors: ["Beige", "Black", "Navy"],
    sizes: ["S", "M", "L"],
    description: "클래식한 트렌치 코트입니다. 우아하고 세련된 스타일을 연출할 수 있습니다.",
    details: ["소재: 면 100%", "색상: 베이지, 블랙, 네이비", "사이즈: S~L"],
    rating: 4.9,
    reviewCount: 156,
    isNew: false,
    category: "outerwear",
    subcategory: "코트",
    stock: 23,
    salesCount: 234,
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },

  // 신발 카테고리
  {
    id: 10,
    name: "클래식 스니커즈",
    brand: "컨버스",
    price: 75000,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=750&fit=crop",
    ],
    colors: ["White", "Black", "Red"],
    sizes: ["240", "250", "260", "270", "280"],
    description: "클래식한 디자인의 캔버스 스니커즈입니다. 어떤 스타일에도 잘 어울리는 만능 신발입니다.",
    details: ["소재: 캔버스", "색상: 화이트, 블랙, 레드", "사이즈: 240~280"],
    rating: 4.5,
    reviewCount: 3456,
    isNew: false,
    category: "shoes",
    subcategory: "스니커즈",
    stock: 189,
    salesCount: 6789,
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
  {
    id: 11,
    name: "러닝화",
    brand: "나이키",
    price: 129000,
    originalPrice: 149000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["240", "250", "260", "270", "280", "290"],
    description: "편안한 쿠셔닝의 러닝화입니다. 운동할 때나 일상생활에서 편안하게 착용할 수 있습니다.",
    details: ["소재: 메쉬, 합성소재", "색상: 블랙, 화이트, 블루, 레드"],
    rating: 4.7,
    reviewCount: 2134,
    isNew: true,
    category: "shoes",
    subcategory: "러닝화",
    stock: 267,
    salesCount: 3987,
    createdAt: "2024-01-13T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
  },
  {
    id: 12,
    name: "첼시 부츠",
    brand: "닥터마틴",
    price: 189000,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "Brown"],
    sizes: ["250", "260", "270", "280"],
    description: "클래식한 첼시 부츠입니다. 세련되고 고급스러운 느낌을 연출할 수 있습니다.",
    details: ["소재: 천연가죽", "색상: 블랙, 브라운", "사이즈: 250~280"],
    rating: 4.6,
    reviewCount: 892,
    isNew: false,
    category: "shoes",
    subcategory: "부츠",
    stock: 78,
    salesCount: 1456,
    createdAt: "2024-01-09T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z",
  },

  // 가방 카테고리
  {
    id: 13,
    name: "미니멀 크로스백",
    brand: "마르헨제이",
    price: 45000,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "Brown", "Beige"],
    sizes: ["One Size"],
    description: "심플하고 실용적인 크로스백입니다. 데일리 아이템으로 활용하기 좋습니다.",
    details: ["소재: 인조가죽", "색상: 블랙, 브라운, 베이지", "사이즈: 원사이즈"],
    rating: 4.4,
    reviewCount: 678,
    isNew: true,
    category: "bags",
    subcategory: "크로스백",
    stock: 123,
    salesCount: 1234,
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
  },
  {
    id: 14,
    name: "백팩",
    brand: "잔스포츠",
    price: 65000,
    originalPrice: 79000,
    discount: 18,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "Navy", "Gray", "Red"],
    sizes: ["One Size"],
    description: "실용적이고 튼튼한 백팩입니다. 학교나 직장, 여행 등 다양한 용도로 사용 가능합니다.",
    details: ["소재: 나일론", "색상: 블랙, 네이비, 그레이, 레드"],
    rating: 4.6,
    reviewCount: 1234,
    isNew: false,
    category: "bags",
    subcategory: "백팩",
    stock: 189,
    salesCount: 2345,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: 15,
    name: "토트백",
    brand: "에코백",
    price: 25000,
    originalPrice: 35000,
    discount: 29,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop",
    ],
    colors: ["Beige", "White", "Black"],
    sizes: ["One Size"],
    description: "친환경적이고 실용적인 토트백입니다. 쇼핑이나 일상생활에서 유용하게 사용할 수 있습니다.",
    details: ["소재: 캔버스", "색상: 베이지, 화이트, 블랙"],
    rating: 4.3,
    reviewCount: 567,
    isNew: true,
    category: "bags",
    subcategory: "토트백",
    stock: 234,
    salesCount: 876,
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },

  // 액세서리 카테고리
  {
    id: 16,
    name: "실버 체인 목걸이",
    brand: "아가타",
    price: 89000,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=750&fit=crop",
    ],
    colors: ["Silver"],
    sizes: ["One Size"],
    description: "세련된 실버 체인 목걸이입니다. 심플하면서도 고급스러운 느낌을 연출할 수 있습니다.",
    details: ["소재: 925 실버", "색상: 실버", "사이즈: 원사이즈"],
    rating: 4.7,
    reviewCount: 345,
    isNew: false,
    category: "accessories",
    subcategory: "목걸이",
    stock: 67,
    salesCount: 543,
    createdAt: "2024-01-07T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 17,
    name: "가죽 시계",
    brand: "다니엘 웰링턴",
    price: 159000,
    originalPrice: 189000,
    discount: 16,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=750&fit=crop",
    ],
    colors: ["Brown", "Black"],
    sizes: ["One Size"],
    description: "클래식한 가죽 스트랩 시계입니다. 어떤 스타일에도 잘 어울리는 타임리스한 디자인입니다.",
    details: ["소재: 가죽 스트랩, 스테인리스 스틸", "색상: 브라운, 블랙"],
    rating: 4.8,
    reviewCount: 892,
    isNew: true,
    category: "accessories",
    subcategory: "시계",
    stock: 89,
    salesCount: 1567,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-21T00:00:00Z",
  },
  {
    id: 18,
    name: "베이스볼 캡",
    brand: "뉴에라",
    price: 35000,
    originalPrice: 45000,
    discount: 22,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "Navy", "White", "Red"],
    sizes: ["One Size"],
    description: "클래식한 베이스볼 캡입니다. 캐주얼한 스타일링의 완성품입니다.",
    details: ["소재: 면 100%", "색상: 블랙, 네이비, 화이트, 레드"],
    rating: 4.5,
    reviewCount: 1456,
    isNew: false,
    category: "accessories",
    subcategory: "모자",
    stock: 178,
    salesCount: 2876,
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },

  // 추가 상품들 (각 카테고리별로 더 많은 상품)
  {
    id: 19,
    name: "니트 스웨터",
    brand: "COS",
    price: 95000,
    originalPrice: 120000,
    discount: 21,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop",
    ],
    colors: ["Cream", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "부드럽고 따뜻한 니트 스웨터입니다. 가을, 겨울철 필수 아이템입니다.",
    details: ["소재: 울 70%, 아크릴 30%", "색상: 크림, 그레이, 네이비"],
    rating: 4.6,
    reviewCount: 567,
    isNew: true,
    category: "tops",
    subcategory: "니트",
    stock: 89,
    salesCount: 1098,
    createdAt: "2024-01-16T00:00:00Z",
    updatedAt: "2024-01-21T00:00:00Z",
  },
  {
    id: 20,
    name: "조거 팬츠",
    brand: "아디다스",
    price: 55000,
    originalPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=600&h=750&fit=crop",
    ],
    colors: ["Black", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "편안한 조거 팬츠입니다. 운동할 때나 홈웨어로 착용하기 좋습니다.",
    details: ["소재: 면 60%, 폴리에스터 40%", "색상: 블랙, 그레이, 네이비"],
    rating: 4.4,
    reviewCount: 789,
    isNew: false,
    category: "bottoms",
    subcategory: "조거팬츠",
    stock: 156,
    salesCount: 2109,
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
  },
]

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "상의",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop",
    productCount: 6,
  },
  {
    id: 2,
    name: "하의",
    slug: "bottoms",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=120&h=120&fit=crop",
    productCount: 4,
  },
  {
    id: 3,
    name: "아우터",
    slug: "outerwear",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    productCount: 3,
  },
  {
    id: 4,
    name: "신발",
    slug: "shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&h=120&fit=crop",
    productCount: 3,
  },
  {
    id: 5,
    name: "가방",
    slug: "bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&h=120&fit=crop",
    productCount: 3,
  },
  {
    id: 6,
    name: "액세서리",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=120&h=120&fit=crop",
    productCount: 3,
  },
]

export const mockBrands: Brand[] = [
  {
    id: 1,
    name: "무신사 스탠다드",
    slug: "musinsa-standard",
    logo: "/placeholder.svg?height=60&width=120",
    description: "무신사의 자체 브랜드",
  },
  {
    id: 2,
    name: "커버낫",
    slug: "covernat",
    logo: "/placeholder.svg?height=60&width=120",
    description: "한국의 대표 스트릿 브랜드",
  },
  {
    id: 3,
    name: "스타일난다",
    slug: "stylenanda",
    logo: "/placeholder.svg?height=60&width=120",
    description: "트렌디한 여성 패션 브랜드",
  },
  {
    id: 4,
    name: "유니클로",
    slug: "uniqlo",
    logo: "/placeholder.svg?height=60&width=120",
    description: "일본의 글로벌 패션 브랜드",
  },
  {
    id: 5,
    name: "나이키",
    slug: "nike",
    logo: "/placeholder.svg?height=60&width=120",
    description: "세계적인 스포츠 브랜드",
  },
  {
    id: 6,
    name: "아디다스",
    slug: "adidas",
    logo: "/placeholder.svg?height=60&width=120",
    description: "독일의 스포츠 브랜드",
  },
]

// Mock 리뷰 데이터
export const mockReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    userId: "user1",
    userName: "김**",
    rating: 5,
    title: "정말 만족스러운 후드티!",
    content:
      "오버핏이라고 해서 너무 클까 걱정했는데 딱 좋네요. 소재도 부드럽고 색상도 예뻐요. 세탁 후에도 형태가 잘 유지되고 있습니다.",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop"],
    size: "M",
    color: "Black",
    height: "170cm",
    weight: "65kg",
    fit: "normal",
    isVerified: true,
    helpfulCount: 24,
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    productId: 1,
    userId: "user2",
    userName: "이**",
    rating: 4,
    title: "색상이 예뻐요",
    content:
      "그레이 색상으로 주문했는데 사진보다 더 예쁜 것 같아요. 다만 생각보다 두꺼워서 여름에는 입기 힘들 것 같네요.",
    images: [],
    size: "L",
    color: "Gray",
    height: "175cm",
    weight: "70kg",
    fit: "normal",
    isVerified: true,
    helpfulCount: 12,
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: 3,
    productId: 2,
    userId: "user3",
    userName: "박**",
    rating: 5,
    title: "기본템으로 최고",
    content: "유니클로 티셔츠는 역시 믿고 사는 제품이에요. 가격 대비 품질이 정말 좋고, 어떤 옷과도 잘 어울려요.",
    images: [],
    size: "M",
    color: "White",
    height: "168cm",
    weight: "60kg",
    fit: "normal",
    isVerified: true,
    helpfulCount: 18,
    createdAt: "2024-01-15T09:15:00Z",
  },
]

// Mock API 함수들 (실제 API가 없을 때 사용)
export const mockApi = {
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    // 필터링 로직 시뮬레이션
    let filteredProducts = [...mockProducts]

    if (filters.category) {
      filteredProducts = filteredProducts.filter((p) => p.category === filters.category)
    }

    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter((p) => filters.categories!.includes(p.category))
    }

    if (filters.brands && filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter((p) => filters.brands!.includes(p.brand))
    }

    if (filters.priceMin) {
      filteredProducts = filteredProducts.filter((p) => p.price >= filters.priceMin!)
    }

    if (filters.priceMax) {
      filteredProducts = filteredProducts.filter((p) => p.price <= filters.priceMax!)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) => p.name.toLowerCase().includes(searchTerm) || p.brand.toLowerCase().includes(searchTerm),
      )
    }

    // 정렬
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case "rating":
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
        case "newest":
          filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        default:
          // popular (기본값)
          filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
      }
    }

    // 페이지네이션
    const page = filters.page || 1
    const limit = filters.limit || 12
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
      data: paginatedProducts,
      message: "Products fetched successfully",
      success: true,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
    }
  },

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    const product = mockProducts.find((p) => p.id === id)

    if (!product) {
      throw new Error("Product not found")
    }

    return {
      data: product,
      message: "Product fetched successfully",
      success: true,
    }
  },

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return {
      data: mockProducts.slice(0, 6),
      message: "Featured products fetched successfully",
      success: true,
    }
  },

  async getRelatedProducts(productId: number): Promise<ApiResponse<Product[]>> {
    const currentProduct = mockProducts.find((p) => p.id === productId)
    if (!currentProduct) {
      throw new Error("Product not found")
    }

    // 같은 카테고리의 다른 상품들 반환
    const relatedProducts = mockProducts
      .filter((p) => p.id !== productId && p.category === currentProduct.category)
      .slice(0, 4)

    return {
      data: relatedProducts,
      message: "Related products fetched successfully",
      success: true,
    }
  },

  async getRecommendedProducts(userId?: string): Promise<ApiResponse<Product[]>> {
    // 개인화 추천 로직 시뮬레이션
    let recommendedProducts = [...mockProducts]

    if (userId) {
      // 사용자 기반 추천 (예: 최근 본 상품의 카테고리 기반)
      recommendedProducts = mockProducts
        .filter((p) => p.rating >= 4.5) // 높은 평점 상품
        .sort((a, b) => b.salesCount - a.salesCount) // 판매량 순
    } else {
      // 일반 추천 (인기 상품)
      recommendedProducts = mockProducts.sort((a, b) => b.salesCount - a.salesCount)
    }

    return {
      data: recommendedProducts.slice(0, 8),
      message: "Recommended products fetched successfully",
      success: true,
    }
  },

  async getBestSellers(): Promise<ApiResponse<Product[]>> {
    const bestSellers = [...mockProducts].sort((a, b) => b.salesCount - a.salesCount).slice(0, 10)

    return {
      data: bestSellers,
      message: "Best sellers fetched successfully",
      success: true,
    }
  },

  async getReviews(productId: number, page = 1): Promise<ApiResponse<Review[]>> {
    const productReviews = mockReviews.filter((r) => r.productId === productId)
    const limit = 5
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReviews = productReviews.slice(startIndex, endIndex)

    return {
      data: paginatedReviews,
      message: "Reviews fetched successfully",
      success: true,
      pagination: {
        page,
        limit,
        total: productReviews.length,
        totalPages: Math.ceil(productReviews.length / limit),
      },
    }
  },

  async createReview(review: Omit<Review, "id" | "createdAt" | "helpfulCount">): Promise<ApiResponse<Review>> {
    const newReview: Review = {
      ...review,
      id: mockReviews.length + 1,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
    }

    mockReviews.push(newReview)

    return {
      data: newReview,
      message: "Review created successfully",
      success: true,
    }
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return {
      data: mockCategories,
      message: "Categories fetched successfully",
      success: true,
    }
  },

  async getBrands(): Promise<ApiResponse<Brand[]>> {
    return {
      data: mockBrands,
      message: "Brands fetched successfully",
      success: true,
    }
  },
}
