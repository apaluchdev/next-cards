"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { SetCookie } from "@/app/server-actions/set-cookie";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idQueryParam = searchParams.get("id") ?? "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Attempting to login...");
      let url = `${process.env.NEXT_PUBLIC_USE_HTTP == "true" ? "http:" : "https:"}//${process.env.NEXT_PUBLIC_GO_BACKEND}/auth/login?username=${values.username}`;

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful");

        // Save the token to local storage
        // TODO - Remove this for good security practice
        localStorage.setItem("Authorization", data.token);

        await SetCookie("Authorization", data.token, new Date(Date.now() + 60 * 60 * 24 * 7 * 1000));
        // If the id query param exists, redirect to the game with the id
        if (idQueryParam) router.push(`/?id=${idQueryParam}`);
        else router.push("/");
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 border-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="text-center" variant="default" type="submit" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default Login;
