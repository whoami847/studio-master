
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNotification } from '@/contexts/NotificationContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useTutorials } from '@/contexts/TutorialContext';
import { AddTutorialDialog } from '@/components/admin/AddTutorialDialog';
import { EditTutorialDialog } from '@/components/admin/EditTutorialDialog';
import { ImageUpload } from '@/components/admin/ImageUpload';

const notificationFormSchema = z.object({
  enabled: z.boolean(),
  title: z.string().min(1, "Title is required."),
  message: z.string().min(1, "Message is required."),
  imageUrl: z.string().optional(),
});

export default function MoreSettingsPage() {
  const { settings, updateSettings } = useNotification();
  const { tutorials, deleteTutorial } = useTutorials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      enabled: false,
      title: "",
      message: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        enabled: settings.enabled,
        title: settings.title,
        message: settings.message,
        imageUrl: settings.imageUrl || '',
      });
    }
  }, [settings, form.reset]);
  
  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    updateSettings(data);
    toast({
      title: "Settings Saved",
      description: "Popup notification settings have been updated.",
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">More Settings</h1>
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Popup Notification Settings</CardTitle>
            <CardDescription>Control the welcome popup for all users.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onNotificationSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>Enable Popup</Label>
                        <p className="text-sm text-muted-foreground">
                          Show a notification popup to new visitors.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Title</Label>
                      <FormControl>
                        <Input placeholder="Enter popup title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Message</Label>
                      <FormControl>
                        <Textarea placeholder="Enter popup message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Image (Optional)</Label>
                      <FormControl>
                        <ImageUpload value={field.value || ''} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Save Settings
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tutorial Management</CardTitle>
            <CardDescription>Add, edit, or delete tutorial videos and thumbnails.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <AddTutorialDialog>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Tutorial
                </Button>
              </AddTutorialDialog>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Thumbnail</TableHead>
                    <TableHead>Video Link</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tutorials.map((tutorial) => (
                    <TableRow key={tutorial.id}>
                      <TableCell>
                        <Image
                          src={tutorial.thumbnail}
                          alt="Tutorial Thumbnail"
                          width={120}
                          height={68}
                          className="rounded-md object-cover"
                          data-ai-hint="video thumbnail"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                          <Link href={tutorial.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                              {tutorial.link}
                          </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <EditTutorialDialog tutorial={tutorial}>
                            <Button variant="ghost" size="icon" className="hover:text-primary">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                            </Button>
                        </EditTutorialDialog>
                        <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => deleteTutorial(tutorial.id)}>
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
      </div>
    </>
  );
}
