import { ProviderType } from "@/services/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProviderFromEnv(): ProviderType {
  const provider = process.env.NEXT_PUBLIC_PROVIDER_TO_USE;
  if (provider === undefined) {
    return "auto" as ProviderType;
  }
  return provider.toLowerCase() as ProviderType;
}