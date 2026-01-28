"use client";

import { useCart } from "@/contexts/CartContext";

// Mock Shopify product data structure
interface MockProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  variantId: string;
}

const mockProducts: MockProduct[] = [
  {
    id: "print-1",
    title: "Print Collection 1",
    price: 49.99,
    image: "https://via.placeholder.com/400x400",
    description: "High-quality art print",
    variantId: "variant-1",
  },
  {
    id: "print-2",
    title: "Print Collection 2",
    price: 59.99,
    image: "https://via.placeholder.com/400x400",
    description: "Premium art print",
    variantId: "variant-2",
  },
  {
    id: "print-3",
    title: "Print Collection 3",
    price: 39.99,
    image: "https://via.placeholder.com/400x400",
    description: "Standard art print",
    variantId: "variant-3",
  },
  {
    id: "print-4",
    title: "Print Collection 4",
    price: 69.99,
    image: "https://via.placeholder.com/400x400",
    description: "Limited edition print",
    variantId: "variant-4",
  },
  {
    id: "print-5",
    title: "Print Collection 5",
    price: 54.99,
    image: "https://via.placeholder.com/400x400",
    description: "Artist signed print",
    variantId: "variant-5",
  },
  {
    id: "print-6",
    title: "Print Collection 6",
    price: 44.99,
    image: "https://via.placeholder.com/400x400",
    description: "Gallery quality print",
    variantId: "variant-6",
  },
];

export default function Prints() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: MockProduct) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      variantId: product.variantId,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container-artwork py-20 lg:py-24">
        <div className="mb-16 animate-fade-in">
          <h1>Prints</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {mockProducts.map((product, index) => (
            <div
              key={product.id}
              className="group border border-gray-200 overflow-hidden transition-all duration-[500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:border-gray-300 hover:-translate-y-1"
            >
              <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-light mb-2">{product.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <p className="text-xl font-light">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-outline w-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
