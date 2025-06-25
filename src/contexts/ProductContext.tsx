
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, writeBatch, query, where, setDoc } from 'firebase/firestore';
import { type Product, type MainCategory, type ProductOption, defaultProducts, defaultMainCategories } from '@/lib/products';

type NewCategory = {
    name: string;
    imageUrl: string;
};

type UpdateCategoryPayload = {
    name: string;
    imageUrl: string;
};

type NewProductPayload = {
    name: string;
    imageUrl: string;
    category: string;
    type: 'games' | 'vouchers';
    formType: 'uid' | 'ingame' | 'voucher';
};

type UpdateProductPayload = {
    name: string;
    imageUrl: string;
    category: string;
    type: 'games' | 'vouchers';
    formType: 'uid' | 'ingame' | 'voucher';
    description: string[];
};

type NewPackagePayload = {
    name: string;
    price: number;
}

type UpdatePackagePayload = {
    name: string;
    price: number;
}


type ProductContextType = {
  products: Record<string, Product>;
  mainCategories: MainCategory[];
  addCategory: (category: NewCategory) => Promise<void>;
  deleteCategory: (slug: string) => Promise<void>;
  updateCategory: (slug: string, data: UpdateCategoryPayload) => Promise<void>;
  addProduct: (product: NewProductPayload) => Promise<void>;
  updateProduct: (slug: string, data: UpdateProductPayload) => Promise<void>;
  deleteProduct: (slug:string) => Promise<void>;
  addPackage: (productSlug: string, newPackage: NewPackagePayload) => Promise<void>;
  updatePackage: (productSlug: string, oldPackageName: string, updatedPackage: UpdatePackagePayload) => Promise<void>;
  deletePackage: (productSlug: string, packageName: string) => Promise<void>;
  loading: boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const formFieldTemplates = {
    uid: [ 
        { name: 'playerId', label: 'PLAYER ID *', placeholder: 'Enter Player ID (UID)', type: 'text', required: true },
        { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 }
    ],
    ingame: [
        { name: 'accountType', label: 'SELECT ACCOUNT TYPE *', type: 'select', options: ['Facebook', 'Google'], required: true, placeholder: "Select account type" },
        { name: 'emailPhone', label: 'EMAIL / PHONE *', placeholder: 'Enter your Email or Phone', type: 'text', required: true },
        { name: 'password', label: 'PASSWORD *', placeholder: 'Enter your password', type: 'password', required: true },
        { name: 'twoStepCode', label: 'TWO STEP CODE', placeholder: 'Enter your two-step code if enabled', type: 'text', required: false },
        { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 }
    ],
    voucher: [ 
        { name: 'email', label: 'EMAIL *', placeholder: 'Enter your email', type: 'email', required: true },
        { name: 'quantity', label: 'Quantity', type: 'number_input', required: true, defaultValue: 1 }
    ],
};

// Helper function to convert Data URI to File object
const dataURIToFile = (dataURI: string, filename: string): File => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], filename, { type: mimeString });
};

const uploadImageToHost = async (dataUrl: string): Promise<string> => {
    if (!dataUrl.startsWith('data:image')) {
      return dataUrl;
    }
    try {
      const file = dataURIToFile(dataUrl, 'image-upload.png');
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Image upload failed with status: ${response.status}`);
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      if (Array.isArray(result) && result.length > 0 && result[0].src) {
        return `https://telegra.ph${result[0].src}`;
      } else {
        throw new Error('Invalid response from image host');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return "https://placehold.co/400x400.png";
    }
}

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const seedDatabaseIfNeeded = async () => {
      const categoriesCollectionRef = collection(db, 'mainCategories');
      const categoriesSnapshot = await getDocs(query(categoriesCollectionRef));
      if (categoriesSnapshot.empty) {
        console.log("Seeding database with default product data...");
        const batch = writeBatch(db);

        // Seed categories
        defaultMainCategories.forEach(category => {
          const categoryDocRef = doc(db, 'mainCategories', category.slug);
          batch.set(categoryDocRef, category);
        });

        // Seed products
        Object.entries(defaultProducts).forEach(([slug, product]) => {
          const productDocRef = doc(db, 'products', slug);
          batch.set(productDocRef, product);
        });

        await batch.commit();
        console.log("Database seeded successfully.");
      }
    };

    seedDatabaseIfNeeded().then(() => {
        const productsUnsub = onSnapshot(collection(db, "products"), (snapshot) => {
            const productsData = snapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = { ...doc.data(), slug: doc.id } as Product;
                return acc;
            }, {} as Record<string, Product>);
            setProducts(productsData);
            setLoading(false);
        });

        const categoriesUnsub = onSnapshot(collection(db, "mainCategories"), (snapshot) => {
            const categoriesData = snapshot.docs.map(doc => ({ ...doc.data(), slug: doc.id } as MainCategory));
            setMainCategories(categoriesData);
            setLoading(false);
        });

        return () => {
            productsUnsub();
            categoriesUnsub();
        };
    });
  }, []);

  const addCategory = async (category: NewCategory) => {
    const slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const imageUrl = await uploadImageToHost(category.imageUrl);
    await setDoc(doc(db, "mainCategories", slug), { name: category.name, slug, imageUrl });
  };

  const deleteCategory = async (slug: string) => {
    if (window.confirm(`Are you sure you want to delete category "${slug}"? This will also delete all associated products.`)) {
        // Delete category doc
        const categoryDocRef = doc(db, 'mainCategories', slug);
        await deleteDoc(categoryDocRef);
        
        // Batch delete products in that category
        const productsQuery = query(collection(db, 'products'), where('category', '==', slug));
        const productsSnapshot = await getDocs(productsQuery);
        const batch = writeBatch(db);
        productsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
  };
  
  const updateCategory = async (slug: string, data: UpdateCategoryPayload) => {
    const catDocRef = doc(db, 'mainCategories', slug);
    const finalData = { ...data };
    if (data.imageUrl.startsWith('data:image')) {
        finalData.imageUrl = await uploadImageToHost(data.imageUrl);
    }
    await updateDoc(catDocRef, finalData);
  };

  const addProduct = async (productData: NewProductPayload) => {
    const slug = productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const imageUrl = await uploadImageToHost(productData.imageUrl);
    const newProduct: Omit<Product, 'slug'> = {
        title: productData.name,
        name: productData.name,
        imageUrl,
        type: productData.type,
        formType: productData.formType,
        category: productData.category,
        options: [],
        formFields: formFieldTemplates[productData.formType] || [],
        description: ["New product. Please edit description."],
        selectLabel: "Select an option",
    };
    await setDoc(doc(db, 'products', slug), { ...newProduct, slug });
  };

  const updateProduct = async (slug: string, data: UpdateProductPayload) => {
    const productDocRef = doc(db, 'products', slug);
    const product = products[slug];
    if (product) {
        const formFieldsChanged = product.formType !== data.formType;
        const finalData = { ...data };
        if(data.imageUrl.startsWith('data:image')) {
            finalData.imageUrl = await uploadImageToHost(data.imageUrl);
        }
        const updatePayload = {
            ...finalData,
            title: data.name,
            formFields: formFieldsChanged ? formFieldTemplates[data.formType] : product.formFields
        };
        await updateDoc(productDocRef, updatePayload);
    }
  };

  const deleteProduct = async (slug: string) => {
    if (window.confirm(`Are you sure you want to delete the product "${slug}"?`)) {
        await deleteDoc(doc(db, 'products', slug));
    }
  };
  
  const addPackage = async (productSlug: string, newPackage: NewPackagePayload) => {
    const product = products[productSlug];
    if(product) {
        const updatedOptions = [...product.options, newPackage];
        await updateDoc(doc(db, 'products', productSlug), { options: updatedOptions });
    }
  };

  const updatePackage = async (productSlug: string, oldPackageName: string, updatedPackage: UpdatePackagePayload) => {
    const product = products[productSlug];
    if(product) {
        const updatedOptions = product.options.map(opt => opt.name === oldPackageName ? updatedPackage : opt);
        await updateDoc(doc(db, 'products', productSlug), { options: updatedOptions });
    }
  };

  const deletePackage = async (productSlug: string, packageName: string) => {
    if (window.confirm(`Are you sure you want to delete package "${packageName}"?`)) {
        const product = products[productSlug];
        if(product) {
            const updatedOptions = product.options.filter(opt => opt.name !== packageName);
            await updateDoc(doc(db, 'products', productSlug), { options: updatedOptions });
        }
    }
  };

  const value = { 
      products, 
      mainCategories, 
      addCategory, 
      deleteCategory, 
      updateCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      addPackage,
      updatePackage, 
      deletePackage,
      loading 
  };

  return (
    <ProductContext.Provider value={value}>
      {!loading ? children : null}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
