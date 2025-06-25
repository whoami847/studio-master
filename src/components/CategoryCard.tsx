
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { EditCategoryDialog } from "./admin/EditCategoryDialog";

type CategoryCardProps = {
  name: string;
  slug: string;
  imageUrl: string;
  animationDelay: string;
};

const AdminControls = ({ slug }: { slug: string }) => {
  const { deleteCategory, mainCategories } = useProducts();
  const category = mainCategories.find(c => c.slug === slug);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteCategory(slug);
  };
  
  if (!category) return null;

  return (
    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
      <EditCategoryDialog category={category}>
        <Button size="icon" className="h-8 w-8 bg-primary/80 hover:bg-primary" onClick={(e) => e.preventDefault()}>
          <Pencil className="h-4 w-4" />
        </Button>
      </EditCategoryDialog>
      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const CategoryCard = ({ name, slug, imageUrl, animationDelay }: CategoryCardProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="relative group animate-slide-in-from-left" style={{ animationDelay }}>
      {isAdmin && <AdminControls slug={slug} />}
      <Link href={`/category/${slug}`} className="block">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3 bg-card">
              <h3 className="text-sm font-bold text-center group-hover:text-primary transition-colors">{name}</h3>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};
