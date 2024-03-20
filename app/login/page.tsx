"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const formSchema = z.object({
  username: z.string().min(2).max(50),
});

const LoginPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `http://localhost:8080/auth/login?username=${values.username}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(JSON.stringify(data));
      if (response.ok) {
        console.log("Login successful");
        router.push("/");
      } else {
        console.log("Login error");
      }
    } catch (error) {
      console.log(`"Login error" ${error}`);
    }
  }

  return (
    <main className="min-h-screen flex justify-center p-24">
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-6 border-2"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="text-center"
              variant="default"
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default LoginPage;
