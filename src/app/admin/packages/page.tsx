
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { AddPackageDialog } from '@/components/admin/AddPackageDialog';
import { EditPackageDialog } from '@/components/admin/EditPackageDialog';

export default function AdminPackagesPage() {
  const { products, deletePackage } = useProducts();
  const productList = products ? Object.values(products) : [];

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-6">Package Price Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Product Packages</CardTitle>
          <CardDescription>View, add, edit, or delete packages for each product.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {productList.map((product) => {
              if (!product?.slug) return null;

              return (
              <AccordionItem value={product.slug} key={product.slug}>
                <AccordionTrigger className="text-lg font-medium hover:no-underline">{product.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end mb-4">
                    <AddPackageDialog productSlug={product.slug}>
                      <Button size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Package
                      </Button>
                    </AddPackageDialog>
                  </div>
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Package Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {(product.options || []).map((option) => {
                          if (!option?.name) return null;
                          return (
                            <TableRow key={option.name}>
                              <TableCell className="font-medium">{option.name}</TableCell>
                              <TableCell>৳{(option.price || 0).toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                  <EditPackageDialog productSlug={product.slug} productPackage={option}>
                                    <Button variant="ghost" size="icon" className="hover:text-primary">
                                      <Pencil className="h-4 w-4" />
                                      <span className="sr-only">Edit Price</span>
                                    </Button>
                                  </EditPackageDialog>
                                  <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => deletePackage(product.slug, option.name)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Package</span>
                                  </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
