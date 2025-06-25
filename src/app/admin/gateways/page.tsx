
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import Image from 'next/image';
import { useGateways } from '@/contexts/GatewayContext';
import { AddGatewayDialog } from '@/components/admin/AddGatewayDialog';
import { Badge } from '@/components/ui/badge';

export default function AdminGatewaysPage() {
  const { gateways, updateGateway, deleteGateway } = useGateways();

  const handleToggle = (gateway: any) => {
    updateGateway(gateway.id, { ...gateway, enabled: !gateway.enabled });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Payment Gateways</h1>
        <AddGatewayDialog>
          <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Gateway
          </Button>
        </AddGatewayDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Gateways</CardTitle>
          <CardDescription>Manage your website's payment gateways.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Store ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gateways.map((gateway) => (
                  <TableRow key={gateway.id}>
                    <TableCell>
                      <Image
                        src={gateway.logoUrl || "https://placehold.co/64x64.png"}
                        alt={gateway.name}
                        width={64}
                        height={64}
                        className="rounded-md object-contain"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{gateway.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{gateway.storeId}</TableCell>
                    <TableCell>
                      <Badge variant={gateway.enabled ? 'success' : 'secondary'}>
                        {gateway.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => handleToggle(gateway)}>
                        {gateway.enabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        <span className="sr-only">Toggle Status</span>
                      </Button>
                      <AddGatewayDialog gateway={gateway}>
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </AddGatewayDialog>
                      <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => deleteGateway(gateway.id)}>
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
