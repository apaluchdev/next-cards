"use server";

import { cookies } from "next/headers";

export async function SetCookie(name: string, value: string, expiresDate: Date): Promise<void> {
  cookies().set(name, value, { expires: expiresDate, domain: process.env.NEXT_PUBLIC_GO_BACKEND });
}
