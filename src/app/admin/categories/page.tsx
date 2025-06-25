
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useProducts } from '@/contexts/ProductContext';
import { AddCategoryDialog } from '@/components/admin/AddCategoryDialog';
import { EditCategoryDialog } from '@/components/admin/EditCategoryDialog';

export default function AdminCategoriesPage() {
  const { mainCategories, deleteCategory } = useProducts();

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Category Management</h1>
        <AddCategoryDialog>
          <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
          </Button>
        </AddCategoryDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>View, edit, or delete product categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mainCategories.map((category) => (
                  <TableRow key={category.slug}>
                    <TableCell>
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{category.slug}</TableCell>
                    <TableCell className="text-right">
                      <EditCategoryDialog category={category}>
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </EditCategoryDialog>
                      <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => deleteCategory(category.slug)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
