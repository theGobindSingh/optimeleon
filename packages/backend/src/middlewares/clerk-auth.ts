import { requireAuth } from "@clerk/express";

// This middleware will verify the Clerk session (via cookie or header)
export const verifyClerk = requireAuth();
