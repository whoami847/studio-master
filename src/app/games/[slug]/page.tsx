
"use client";

import { ProductPageClient } from '@/components/ProductPageClient';
import { useProducts } from '@/contexts/ProductContext';
import { useParams, notFound } from 'next/navigation';

export default function GamePage() {
  const params = useParams();
  const { slug } = params as { slug: string };
  const { products } = useProducts();
  const product = products[slug as keyof typeof products];

  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 font-headline">{product.title}</h1>
      <ProductPageClient product={product} />
    </div>
  );
}
