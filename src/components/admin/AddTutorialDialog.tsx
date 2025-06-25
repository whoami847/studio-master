
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTutorials } from "@/contexts/TutorialContext";

const formSchema = z.object({
  link: z.string().url("Please enter a valid video URL."),
  thumbnail: z.string().url("Please enter a valid image URL for the thumbnail."),
});

type AddTutorialDialogProps = {
  children: React.ReactNode;
};

export function AddTutorialDialog({ children }: AddTutorialDialogProps) {
  const [open, setOpen] = useState(false);
  const { addTutorial } = useTutorials();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      thumbnail: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addTutorial(values);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Tutorial</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="link">Video Link</Label>
                  <FormControl>
                    <Input id="link" placeholder="e.g., https://youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <FormControl>
                    <Input
                      id="thumbnail"
                      placeholder="https://placehold.co/120x68.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Tutorial</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
