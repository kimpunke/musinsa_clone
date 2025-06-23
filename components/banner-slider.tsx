"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  buttonText: string
  buttonLink: string
  backgroundColor: string
}

const banners: Banner[] = [
  {
    id: 1,
    title: "NEW SEASON",
    subtitle: "2024 F/W 컬렉션",
    description: "최신 트렌드를 만나보세요",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    buttonText: "지금 쇼핑하기",
    buttonLink: "/products",
    backgroundColor: "from-gray-900 to-gray-700",
  },
  {
    id: 2,
    title: "SPECIAL SALE",
    subtitle: "최대 50% 할인",
    description: "놓치면 후회하는 특가 상품",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
    buttonText: "할인 상품 보기",
    buttonLink: "/sale",
    backgroundColor: "from-red-600 to-pink-600",
  },
  {
    id: 3,
    title: "PREMIUM BRANDS",
    subtitle: "럭셔리 브랜드 컬렉션",
    description: "세계적인 브랜드들을 만나보세요",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop",
    buttonText: "브랜드 보기",
    buttonLink: "/brands",
    backgroundColor: "from-purple-600 to-blue-600",
  },
  {
    id: 4,
    title: "STREET FASHION",
    subtitle: "스트릿 스타일",
    description: "개성 넘치는 스트릿 패션 아이템",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&h=600&fit=crop",
    buttonText: "스타일 보기",
    buttonLink: "/category/tops",
    backgroundColor: "from-orange-500 to-yellow-500",
  },
]

export function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // 자동 슬라이드
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // 5초마다 변경

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // 3초 후 자동 재생 재개
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner.image})` }} />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.backgroundColor} opacity-80`} />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
              <div className="text-white max-w-2xl">
                <p className="text-sm md:text-base font-medium mb-2 opacity-90">{banner.subtitle}</p>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{banner.title}</h1>
                <p className="text-lg md:text-xl mb-6 opacity-90">{banner.description}</p>
                <Link href={banner.buttonLink}>
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-base px-8 py-3">
                    {banner.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: isAutoPlaying ? `${((currentSlide + 1) / banners.length) * 100}%` : "0%",
          }}
        />
      </div>
    </section>
  )
}
