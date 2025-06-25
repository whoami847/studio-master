
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { AddProductDialog } from '@/components/admin/AddProductDialog';
import { EditProductDialog } from '@/components/admin/EditProductDialog';

export default function AdminProductsPage() {
  const { products, deleteProduct } = useProducts();
  const productList = Object.values(products);

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Product Management</h1>
        <AddProductDialog>
          <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </AddProductDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>View, edit, or delete product packages.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productList.map((product) => (
                  <TableRow key={product.slug}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{product.category}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.options.length}</TableCell>
                    <TableCell className="text-right">
                      <EditProductDialog product={product}>
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </EditProductDialog>
                      <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => deleteProduct(product.slug)}>
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
