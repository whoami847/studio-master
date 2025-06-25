
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { EditProductDialog } from './admin/EditProductDialog';

type GameCardProps = {
  name: string;
  imageUrl: string;
  slug: string;
  type: 'games' | 'vouchers';
};

const AdminControls = ({ slug }: { slug: string }) => {
    const { products, deleteProduct } = useProducts();
    const product = products[slug];

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        deleteProduct(slug);
    };

    if (!product) return null;

    return (
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          <EditProductDialog product={product}>
            <Button size="icon" className="h-8 w-8 bg-primary/80 hover:bg-primary" onClick={(e) => e.preventDefault()}>
              <Pencil className="h-4 w-4" />
            </Button>
          </EditProductDialog>
          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
    );
}

export function GameCard({ name, imageUrl, slug, type }: GameCardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const href = `/${type}/${slug}`;

  return (
    <div className="relative h-full">
      {isAdmin && <AdminControls slug={slug} />}
      <Link href={href} className="group block h-full">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary h-full flex flex-col">
          <CardContent className="p-0 flex flex-col flex-grow">
            <div className="relative aspect-[4/5] w-full flex-grow">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 bg-card">
              <h3 className="text-lg font-bold text-center font-headline group-hover:text-primary transition-colors">{name}</h3>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
