
// Mock data for the entire application
export const mockProducts = [
  {
    id: 1,
    name: "Cashmere Blend Coat",
    brand: "LUXE",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d4e?w=400&h=500&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d4e?w=400&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop&crop=center"
    ],
    category: "men",
    colors: ["Black", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 127,
    isNew: true,
    isSale: false,
    tags: ["New", "Premium"],
    description: "Luxurious cashmere blend coat perfect for any occasion."
  },
  {
    id: 2,
    name: "Silk Evening Dress",
    brand: "Elite",
    price: 899,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&crop=center"
    ],
    category: "women",
    colors: ["Black", "Red", "Navy"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.9,
    reviewCount: 89,
    isNew: false,
    isSale: true,
    tags: ["Sale", "Evening"],
    description: "Elegant silk evening dress for special occasions."
  },
  {
    id: 3,
    name: "Leather Ankle Boots",
    brand: "Classic",
    price: 449,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center"
    ],
    category: "accessories",
    colors: ["Black", "Brown"],
    sizes: ["38", "39", "40", "41", "42"],
    rating: 4.7,
    reviewCount: 156,
    isNew: false,
    isSale: false,
    tags: ["Classic", "Leather"],
    description: "Premium leather ankle boots with modern design."
  },
  {
    id: 4,
    name: "Leather Ankle Boots",
    brand: "Classic",
    price: 449,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center"
    ],
    category: "accessories",
    colors: ["Black", "Brown"],
    sizes: ["38", "39", "40", "41", "42"],
    rating: 4.7,
    reviewCount: 156,
    isNew: false,
    isSale: false,
    tags: ["Classic", "Leather"],
    description: "Premium leather ankle boots with modern design."
  },
];

export const mockCategories = [
  {
    id: 1,
    name: "Men's Collection",
    image: "/Images/Men/client1/public/Images/Men/Purple_Three_Piece_Textured_Suit_Opto-CP002349U3-image4.webp",
    href: "/shop/men",
    description: "Sophisticated essentials"
  },
  {
    id: 2,
    name: "Women's Collection",
    image: "/Images/Women/client1/public/Images/Women/napat-saeng-mVGW8j9rrC4-unsplash.jpg",
    href: "/shop/women",
    description: "Elegant collections"
  },
  {
    id: 3,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop&crop=center",
    href: "/shop/accessories",
    description: "Premium accessories"
  }
];

export const mockLookbook = [
  {
    id: 1,
    title: "Timeless Elegance",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop&crop=center",
    products: [1, 2],
    description: "Discover the art of refined sophistication with our curated selection of timeless pieces"
  },
  {
    id: 2,
    title: "Modern Minimalism",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop&crop=center",
    products: [1, 3],
    description: "Clean lines and contemporary silhouettes define this season's essential wardrobe"
  },
  {
    id: 3,
    title: "Evening Sophistication",
    image: "https://images.unsplash.com/photo-1494790108755-2616c041a80b?w=800&h=1200&fit=crop&crop=center",
    products: [2, 3],
    description: "Luxurious fabrics and impeccable tailoring for your most memorable moments"
  },
  {
    id: 4,
    title: "Casual Luxury",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1200&fit=crop&crop=center",
    products: [1, 4],
    description: "Effortless style meets premium comfort in our relaxed luxury collection"
  },
  {
    id: 5,
    title: "Urban Sophistication",
    image: "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=800&h=1200&fit=crop&crop=center",
    products: [2, 4],
    description: "Contemporary designs crafted for the modern lifestyle and urban adventures"
  },
  {
    id: 6,
    title: "Heritage Craftsmanship",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=center",
    products: [3, 4],
    description: "Traditional techniques meet modern design in our artisanal heritage collection"
  }
];

export const mockReviews = [
  {
    id: 1,
    productId: 1,
    name: "Sarah M.",
    rating: 5,
    title: "Excellent quality!",
    comment: "The fabric quality is outstanding and the fit is perfect.",
    date: "2024-01-15",
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    productId: 1,
    name: "Ahmed K.",
    rating: 4,
    title: "Great design",
    comment: "Beautiful design and good quality. Delivery was fast.",
    date: "2024-01-10",
    helpful: 8,
    verified: true
  }
];

export const mockBanners = [
  {
    id: 1,
    title: "New Collection",
    subtitle: "Discover luxury fashion",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&crop=center",
    cta: "Shop Now",
    link: "/shop"
  },
  {
    id: 2,
    title: "Summer Sale",
    subtitle: "Up to 50% off",
    image: "https://unsplash.com/photos/womens-white-sleeveless-dress-QY0qR938qL8",
    cta: "Shop Sale",
    link: "/shop/sale"
  }
];
