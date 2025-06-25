
"use client";

import { GameCard } from '@/components/GameCard';
import { notFound, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { AddProductDialog } from '@/components/admin/AddProductDialog';

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params as { slug: string };
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { mainCategories, products } = useProducts();

  const category = mainCategories.find(c => c.slug === slug);
  
  // This needs to be inside the component logic, not at the top level
  if (!category) {
    // Handling notFound in a client component requires a bit of a workaround
    // or restructuring. For now, we'll just show a message.
    // A better approach would be to fetch data in a parent server component.
    // Or, for client-only, useEffect could push to a 404 page.
    if (typeof window !== 'undefined') {
        return notFound();
    }
    return null;
  }

  const categoryProducts = Object.values(products).filter(p => p.category === slug);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-center font-headline">{category.name}</h1>
        {isAdmin && (
          <div className="absolute right-0">
            <AddProductDialog defaultCategory={slug}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </AddProductDialog>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {categoryProducts.map((item, index) => (
          <div
            key={item.slug}
            className="animate-slide-in-from-left"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <GameCard
              name={item.name}
              imageUrl={item.imageUrl}
              slug={item.slug}
              type={item.type}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
