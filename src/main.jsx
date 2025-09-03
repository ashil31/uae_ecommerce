
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Create mock data for development
const createMockProducts = () => {
  const products = [];
  const categories = ['Men', 'Women', 'Accessories'];
  const brands = ['UAE', 'Premium', 'Elite', 'Classic'];
  const colors = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Brown'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  for (let i = 1; i <= 20; i++) {
    products.push({
      id: i,
      name: `Premium ${categories[Math.floor(Math.random() * categories.length)]} Item ${i}`,
      brand: brands[Math.floor(Math.random() * brands.length)],
      price: Math.floor(Math.random() * 500) + 50,
      originalPrice: Math.floor(Math.random() * 100) + 600,
      wholesalePrice: Math.floor(Math.random() * 300) + 30,
      images: [
        `/images/products/product-${i}-1.jpg`,
        `/images/products/product-${i}-2.jpg`
      ],
      colors: colors.slice(0, Math.floor(Math.random() * 3) + 1),
      sizes: sizes.slice(0, Math.floor(Math.random() * 4) + 2),
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 100) + 5,
      isNew: Math.random() > 0.7,
      moq: Math.floor(Math.random() * 20) + 5,
      description: `High-quality ${categories[Math.floor(Math.random() * categories.length)]} item with premium materials and expert craftsmanship.`,
      category: categories[Math.floor(Math.random() * categories.length)].toLowerCase(),
    });
  }
  
  return products;
};

// Store mock data in localStorage for development
if (!localStorage.getItem('mockProducts')) {
  localStorage.setItem('mockProducts', JSON.stringify(createMockProducts()));
}

createRoot(document.getElementById("root")).render(<App />);
