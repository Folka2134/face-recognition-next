"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const imageUrlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

const formSchema = z.object({
  imageUrl: z.string().refine((url) => imageUrlRegex.test(url), {
    message: "Invalid image URL",
    path: ["imageUrl"],
  }),
});

export default function inputForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="url..." {...field} />
              </FormControl>
              <FormDescription>Enter a URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Detect</Button>
      </form>
    </Form>
  );
}
