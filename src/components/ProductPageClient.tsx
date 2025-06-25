
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Gem, Info, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { type Product } from "@/lib/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { QuantityInput } from "./QuantityInput";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useOrders } from "@/contexts/OrderContext";
import { useWallet } from "@/contexts/WalletContext";
import { ToastAction } from "@/components/ui/toast";
import { PasswordInput } from "./PasswordInput";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { EditProductDialog } from "./admin/EditProductDialog";

type ProductPageClientProps = {
  product: Product;
};

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { toast } = useToast();
  const { addOrder } = useOrders();
  const { balance, addTransaction } = useWallet();
  const { deleteProduct } = useProducts();
  const router = useRouter();
  const [totalPrice, setTotalPrice] = React.useState(0);

  const formSchema = React.useMemo(() => {
    const schema: Record<string, any> = {
      selectedOption: z.string().min(1, { message: "Please select an option." }),
    };

    product.formFields.forEach(field => {
      let zodType;
      if (field.type === 'email') {
        zodType = z.string().email({ message: "Invalid email address." });
      } else if (field.type === 'number_input') {
        zodType = z.coerce.number().min(1, { message: "Quantity must be at least 1." });
      }
      else {
        zodType = z.string();
      }

      if (field.required && field.type !== 'number_input') {
        zodType = zodType.min(1, { message: `${field.label.replace(' *','')} is required.` });
      }
      if (!field.required) {
        zodType = zodType.optional();
      }

      schema[field.name] = zodType;
    });

    return z.object(schema);
  }, [product]);

  const defaultValues = React.useMemo(() => {
    const defaults: Record<string, any> = { selectedOption: "" };
    product.formFields.forEach(field => {
        defaults[field.name] = field.defaultValue ?? '';
    });
    return defaults;
  }, [product]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedOptionName = form.watch("selectedOption");
  const quantity = form.watch("quantity");

  React.useEffect(() => {
    const option = product.options.find(opt => opt.name === selectedOptionName);
    if (option) {
      const q = product.formFields.some(f => f.name === 'quantity') ? (quantity || 1) : 1;
      setTotalPrice(option.price * q);
    } else {
      setTotalPrice(0);
    }
  }, [selectedOptionName, quantity, product]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Logged In",
            description: "You must be logged in to make a purchase.",
        });
        router.push('/login');
        return;
    }

    if (balance < totalPrice) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `Your balance is ৳${balance.toFixed(2)}, but you need ৳${totalPrice.toFixed(2)}.`,
        action: (
          <ToastAction altText="Top Up Now" onClick={() => router.push('/my-wallet/topup')}>
            Top Up
          </ToastAction>
        ),
      });
      return;
    }
    
    try {
        await addOrder({
            product: `${product.title} - ${values.selectedOption}`,
            amount: totalPrice,
        });

        await addTransaction({
          type: 'Purchase',
          description: `Purchased: ${product.title} (${values.selectedOption})`,
          amount: totalPrice,
        });
        
        toast({
          title: "Order Successful!",
          description: "Your purchase has been confirmed.",
        });

        form.reset(defaultValues);
        router.push('/order-list');
    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Order Failed",
            description: error.message || "An unexpected error occurred.",
        });
    }
  }
  
  const handleDelete = async () => {
    try {
      await deleteProduct(product.slug);
      toast({ title: "Product Deleted", description: `"${product.name}" has been removed.` });
      router.push(`/category/${product.category}`);
    } catch (error: any) {
       toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: error.message || "Could not delete the product.",
        });
    }
  };


  return (
    <>
      {isAdmin && (
        <div className="flex justify-end gap-2 mb-4">
            <EditProductDialog product={product}>
              <Button>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Product
              </Button>
            </EditProductDialog>
            <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Product
            </Button>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>{product.selectLabel || 'Select an Option'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="selectedOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                          >
                            {product.options.map((option) => (
                              <FormItem key={option.name}>
                                <FormControl>
                                  <RadioGroupItem value={option.name} className="sr-only" />
                                </FormControl>
                                <FormLabel className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 font-normal hover:border-primary cursor-pointer ${field.value === option.name ? 'border-primary' : ''}`}>
                                  <Gem className="h-6 w-6 mb-2 text-primary" />
                                  <span className="text-sm font-semibold text-center">{option.name}</span>
                                  <span className="text-xs text-muted-foreground mt-1">৳{option.price}</span>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="pt-2" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="space-y-8">
                  <Card>
                      <CardHeader>
                          <CardTitle>Enter Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          {product.formFields.map(formField => (
                              <FormField
                                  key={formField.name}
                                  control={form.control}
                                  name={formField.name}
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>{formField.label}</FormLabel>
                                          <FormControl>
                                              {formField.type === 'select' ? (
                                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                      <SelectTrigger>
                                                          <SelectValue placeholder={formField.placeholder} />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                          {formField.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                      </SelectContent>
                                                  </Select>
                                              ) : formField.type === 'number_input' ? (
                                                  <QuantityInput value={field.value as number} onChange={field.onChange} />
                                              ) : formField.type === 'password' ? (
                                                  <PasswordInput placeholder={formField.placeholder} {...field} />
                                              ) : (
                                                  <Input type={formField.type} placeholder={formField.placeholder} {...field} />
                                              )}
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                          ))}
                      </CardContent>
                  </Card>

                  <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Notice</AlertTitle>
                      <AlertDescription>
                          <ul className="list-disc list-inside space-y-1">
                              {product.description.map((line, i) => <li key={i}>{line}</li>)}
                          </ul>
                      </AlertDescription>
                  </Alert>

                  <Card>
                      <CardContent className="pt-6">
                          <div className="flex justify-between items-center text-xl font-bold mb-4">
                              <span>Total:</span>
                              <span className="text-primary">৳{totalPrice.toFixed(2)}</span>
                          </div>
                          <Button type="submit" className="w-full text-lg" size="lg">Buy Now</Button>
                      </CardContent>
                  </Card>
              </div>
          </div>
        </form>
      </Form>
    </>
  );
}
