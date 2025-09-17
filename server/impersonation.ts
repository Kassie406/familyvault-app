// server/impersonation.ts

import { prisma } from "./storage";

// Function to impersonate a user by email
export async function impersonateUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found for impersonation.");
    }

    console.log(`✅ Impersonating user: ${user.email}`);
    return user;
  } catch (err) {
    console.error("❌ Failed to impersonate user:", err);
    throw err;
  }
}
