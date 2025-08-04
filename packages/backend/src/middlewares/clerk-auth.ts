import { requireAuth } from "@clerk/express";
import { RequestHandler } from "express";

// This middleware will verify the Clerk session (via cookie or header)
export const verifyClerk: RequestHandler = requireAuth();
