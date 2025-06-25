
"use client";

import { HeroCarousel } from "@/components/HeroCarousel";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { useProducts } from "@/contexts/ProductContext";
import { AddCategoryDialog } from "@/components/admin/AddCategoryDialog";

export default function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { mainCategories } = useProducts();

  return (
    <div className="space-y-8 md:space-y-12 pb-12">
      <HeroCarousel />
      <section className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-6 relative">
          <h2 className="text-2xl font-bold text-center text-accent">Favourite Games</h2>
          {isAdmin && (
            <div className="absolute right-0">
              <AddCategoryDialog>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </AddCategoryDialog>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {mainCategories.map((item, index) => (
            <CategoryCard
              key={item.slug}
              name={item.name}
              slug={item.slug}
              imageUrl={item.imageUrl}
              animationDelay={`${index * 100}ms`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
