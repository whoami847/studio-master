"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const isUrl = value && value.startsWith('http');
  const [activeTab, setActiveTab] = useState(isUrl ? 'url' : 'upload');

  // Sync tab with value type if it changes from outside
  useEffect(() => {
    const newIsUrl = value && value.startsWith('http');
    const newTab = newIsUrl ? 'url' : 'upload';
    if (activeTab !== newTab) {
        setActiveTab(newTab);
    }
  }, [value, activeTab]);


  return (
    <div className={cn("space-y-4", className)}>
        {value && (
            <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                <Image
                src={value}
                alt="Image Preview"
                fill
                className="object-cover"
                />
            </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="url">Image URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-2 pt-2">
                <Label htmlFor="image-upload">Choose a file</Label>
                <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:text-primary file:font-medium"
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    (e.target as HTMLInputElement).value = '';
                    }}
                />
            </TabsContent>
            <TabsContent value="url" className="space-y-2 pt-2">
                <Label htmlFor="image-url">Paste image link</Label>
                <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={value && value.startsWith('http') ? value : ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}
