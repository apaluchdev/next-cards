"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useAppContext } from "@/context/app-context";
const formSchema = z.object({
  username: z.string().min(2).max(50),
});

const LoginPage = () => {
  const router = useRouter();
  //const { state, setState } = useAppContext();
  const searchParams = useSearchParams();

  const idQueryParam = searchParams.get("id");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  console.log("Rendering login page");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //setState({ name: values.username, score: 0, session: "" });
      const response = await fetch(
        `http://localhost:8080/auth/login?username=${values.username}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful");
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
